package com.example.demo.service.impl;

import com.example.demo.dto.request.ArticleCreateRequest;
import com.example.demo.dto.request.ArticleUpdateRequest;
import com.example.demo.dto.response.ArticleDetailResponse;
import com.example.demo.dto.response.ArticleResponse;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.dto.response.ProductResponse;
import com.example.demo.entity.article.Article;
import com.example.demo.entity.article.ArticleCategory;
import com.example.demo.entity.article.ArticleProduct;
import com.example.demo.entity.article.ArticleProductId;
import com.example.demo.entity.article.ArticleStatus;
import com.example.demo.entity.product.Product;
import com.example.demo.entity.user.User;
import com.example.demo.exception.DuplicateResourceException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.ArticleCategoryRepository;
import com.example.demo.repository.ArticleProductRepository;
import com.example.demo.repository.ArticleRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.example.demo.entity.SlugRedirect;
import com.example.demo.event.ContentChangedEvent;
import com.example.demo.repository.SlugRedirectRepository;
import org.springframework.context.ApplicationEventPublisher;

@Service
@RequiredArgsConstructor
public class ArticleServiceImpl implements ArticleService {

    private final ArticleRepository articleRepository;
    private final ArticleCategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ArticleProductRepository articleProductRepository;
    private final SlugRedirectRepository slugRedirectRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    public PageResponse<ArticleResponse> getPublishedArticles(int page, int size, String keyword, String categorySlug) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(size, 100));
        Page<Article> articlePage;
        
        if (keyword != null && !keyword.trim().isEmpty()) {
            articlePage = articleRepository.findByStatusAndTitleContainingIgnoreCase(ArticleStatus.PUBLISHED, keyword.trim(), pageable);
        } else if (categorySlug != null && !categorySlug.trim().isEmpty()) {
            articlePage = articleRepository.findByStatusAndCategorySlug(ArticleStatus.PUBLISHED, categorySlug.trim(), pageable);
        } else {
            articlePage = articleRepository.findByStatus(ArticleStatus.PUBLISHED, pageable);
        }
        
        List<ArticleResponse> content = articlePage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
                
        return new PageResponse<>(content, articlePage.getNumber(), articlePage.getSize(), 
                articlePage.getTotalElements(), articlePage.getTotalPages());
    }

    @Override
    public ArticleDetailResponse getPublishedArticleBySlug(String slug) {
        Article article = articleRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found with slug: " + slug));
        if (article.getStatus() != ArticleStatus.PUBLISHED) {
            throw new ResourceNotFoundException("Article not found with slug: " + slug);
        }
        return mapToDetailResponse(article);
    }

    @Override
    public PageResponse<ArticleResponse> getArticlesByCategorySlug(String slug, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(size, 100));
        Page<Article> articlePage = articleRepository.findByStatusAndCategorySlug(ArticleStatus.PUBLISHED, slug, pageable);
        
        List<ArticleResponse> content = articlePage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
                
        return new PageResponse<>(content, articlePage.getNumber(), articlePage.getSize(), 
                articlePage.getTotalElements(), articlePage.getTotalPages());
    }

    @Override
    public PageResponse<ArticleDetailResponse> getAllArticles(int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(size, 100));
        Page<Article> articlePage = articleRepository.findByStatus(ArticleStatus.PUBLISHED, pageable);
        List<ArticleDetailResponse> content = articlePage.getContent().stream()
                .map(this::mapToDetailResponse)
                .collect(Collectors.toList());
        return new PageResponse<>(content, articlePage.getNumber(), articlePage.getSize(), 
                articlePage.getTotalElements(), articlePage.getTotalPages());
    }

    @Override
    public ArticleDetailResponse getArticleById(Long id) {
        return mapToDetailResponse(getEntityById(id));
    }

    @Override
    @Transactional
    public ArticleDetailResponse createArticle(ArticleCreateRequest request, Long authorId) {
        if (articleRepository.findBySlug(request.getSlug()).isPresent()) {
            throw new DuplicateResourceException("Slug already exists");
        }
        
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + authorId));
                
        ArticleCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        Article article = new Article();
        article.setTitle(request.getTitle());
        article.setSlug(request.getSlug());
        article.setExcerpt(request.getExcerpt());
        article.setContent(request.getContent());
        article.setThumbnailUrl(request.getThumbnailUrl());
        article.setThumbnailAlt(request.getThumbnailAlt());
        article.setAuthor(author);
        article.setCategory(category);
        
        if (request.getStatus() != null) {
            article.setStatus(ArticleStatus.valueOf(request.getStatus()));
            if (article.getStatus() == ArticleStatus.PUBLISHED) {
                article.setPublishedAt(LocalDateTime.now());
            }
        }
        
        Article savedArticle = articleRepository.save(article);
        
        eventPublisher.publishEvent(new ContentChangedEvent("article", savedArticle.getSlug(), null, category.getSlug()));
        
        // Handle related products
        if (request.getProductIds() != null && !request.getProductIds().isEmpty()) {
            for (Long productId : request.getProductIds()) {
                Product product = productRepository.findById(productId)
                        .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
                ArticleProduct ap = new ArticleProduct();
                ArticleProductId apId = new ArticleProductId(savedArticle.getId(), product.getId());
                ap.setId(apId);
                ap.setArticle(savedArticle);
                ap.setProduct(product);
                articleProductRepository.save(ap);
            }
        }
        
        return mapToDetailResponse(savedArticle);
    }

    @Override
    @Transactional
    public ArticleDetailResponse updateArticle(Long id, ArticleUpdateRequest request) {
        Article article = getEntityById(id);
        String oldSlug = article.getSlug();
        boolean slugChanged = !oldSlug.equals(request.getSlug());
        
        if (slugChanged && articleRepository.findBySlug(request.getSlug()).isPresent()) {
            throw new DuplicateResourceException("Slug already exists");
        }
        
        ArticleCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        article.setTitle(request.getTitle());
        article.setSlug(request.getSlug());
        article.setExcerpt(request.getExcerpt());
        article.setContent(request.getContent());
        article.setThumbnailUrl(request.getThumbnailUrl());
        article.setThumbnailAlt(request.getThumbnailAlt());
        article.setCategory(category);
        
        if (request.getStatus() != null) {
            ArticleStatus newStatus = ArticleStatus.valueOf(request.getStatus());
            if (article.getStatus() != ArticleStatus.PUBLISHED && newStatus == ArticleStatus.PUBLISHED) {
                article.setPublishedAt(LocalDateTime.now());
            }
            article.setStatus(newStatus);
        }
        
        Article savedArticle = articleRepository.save(article);

        if (slugChanged) {
            SlugRedirect redirect = new SlugRedirect();
            redirect.setOldSlug(oldSlug);
            redirect.setNewSlug(savedArticle.getSlug());
            redirect.setEntityType("article");
            redirect.setEntityId(savedArticle.getId());
            slugRedirectRepository.save(redirect);
        }
        
        eventPublisher.publishEvent(new ContentChangedEvent("article", savedArticle.getSlug(), slugChanged ? oldSlug : null, category.getSlug()));
        
        return mapToDetailResponse(savedArticle);
    }

    @Override
    @Transactional
    public void deleteArticle(Long id) {
        Article article = getEntityById(id);
        String categorySlug = article.getCategory() != null ? article.getCategory().getSlug() : null;
        articleRepository.delete(article);
        eventPublisher.publishEvent(new ContentChangedEvent("article", article.getSlug(), null, categorySlug));
    }

    @Override
    @Transactional
    public void publishArticle(Long id) {
        Article article = getEntityById(id);
        article.setStatus(ArticleStatus.PUBLISHED);
        article.setPublishedAt(LocalDateTime.now());
        articleRepository.save(article);
        String categorySlug = article.getCategory() != null ? article.getCategory().getSlug() : null;
        eventPublisher.publishEvent(new ContentChangedEvent("article", article.getSlug(), null, categorySlug));
    }

    @Override
    @Transactional
    public void draftArticle(Long id) {
        Article article = getEntityById(id);
        article.setStatus(ArticleStatus.DRAFT);
        articleRepository.save(article);
        String categorySlug = article.getCategory() != null ? article.getCategory().getSlug() : null;
        eventPublisher.publishEvent(new ContentChangedEvent("article", article.getSlug(), null, categorySlug));
    }
    
    private Article getEntityById(Long id) {
        return articleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found with id: " + id));
    }

    private ArticleResponse mapToResponse(Article article) {
        ArticleResponse res = new ArticleResponse();
        res.setId(article.getId());
        res.setTitle(article.getTitle());
        res.setSlug(article.getSlug());
        res.setExcerpt(article.getExcerpt());
        res.setThumbnailUrl(article.getThumbnailUrl());
        res.setThumbnailAlt(article.getThumbnailAlt());
        res.setCategoryName(article.getCategory().getName());
        res.setAuthorName(article.getAuthor().getName());
        res.setStatus(article.getStatus().name());
        res.setMetaTitle(article.getMetaTitle());
        res.setMetaDescription(article.getMetaDescription());
        res.setPublishedAt(article.getPublishedAt());
        res.setCreatedAt(article.getCreatedAt());
        res.setUpdatedAt(article.getUpdatedAt());
        return res;
    }

    private ArticleDetailResponse mapToDetailResponse(Article article) {
        ArticleDetailResponse res = new ArticleDetailResponse();
        res.setId(article.getId());
        res.setTitle(article.getTitle());
        res.setSlug(article.getSlug());
        res.setExcerpt(article.getExcerpt());
        res.setContent(article.getContent());
        res.setThumbnailUrl(article.getThumbnailUrl());
        res.setThumbnailAlt(article.getThumbnailAlt());
        res.setCategoryName(article.getCategory().getName());
        res.setCategorySlug(article.getCategory().getSlug());
        res.setAuthorName(article.getAuthor().getName());
        res.setStatus(article.getStatus().name());
        res.setMetaTitle(article.getMetaTitle());
        res.setMetaDescription(article.getMetaDescription());
        res.setOgImage(article.getOgImage());
        res.setCanonicalUrl(article.getCanonicalUrl());
        res.setPublishedAt(article.getPublishedAt());
        res.setCreatedAt(article.getCreatedAt());
        res.setUpdatedAt(article.getUpdatedAt());
        res.setRelatedProducts(new ArrayList<>()); // Need to fetch related products properly
        return res;
    }
}
