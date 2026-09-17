package com.example.demo.service.impl;

import com.example.demo.dto.request.ArticleCategoryCreateRequest;
import com.example.demo.dto.request.ArticleCategoryUpdateRequest;
import com.example.demo.dto.response.ArticleCategoryResponse;
import com.example.demo.entity.article.ArticleCategory;
import com.example.demo.exception.DuplicateResourceException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.ArticleCategoryRepository;
import com.example.demo.service.ArticleCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ArticleCategoryServiceImpl implements ArticleCategoryService {

    private final ArticleCategoryRepository repository;

    @Override
    public List<ArticleCategoryResponse> getAllCategories() {
        return repository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public ArticleCategoryResponse getCategoryBySlug(String slug) {
        ArticleCategory category = repository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with slug: " + slug));
        return mapToResponse(category);
    }

    @Override
    public ArticleCategoryResponse getCategoryById(Long id) {
        ArticleCategory category = getEntityById(id);
        return mapToResponse(category);
    }

    @Override
    @Transactional
    public ArticleCategoryResponse createCategory(ArticleCategoryCreateRequest request) {
        if (repository.findBySlug(request.getSlug()).isPresent()) {
            throw new DuplicateResourceException("Slug already exists");
        }
        ArticleCategory category = new ArticleCategory();
        category.setName(request.getName());
        category.setSlug(request.getSlug());
        category.setDescription(request.getDescription());
        
        ArticleCategory saved = repository.save(category);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public ArticleCategoryResponse updateCategory(Long id, ArticleCategoryUpdateRequest request) {
        ArticleCategory category = getEntityById(id);
        if (!category.getSlug().equals(request.getSlug()) && repository.findBySlug(request.getSlug()).isPresent()) {
            throw new DuplicateResourceException("Slug already exists");
        }
        category.setName(request.getName());
        category.setSlug(request.getSlug());
        category.setDescription(request.getDescription());
        
        ArticleCategory saved = repository.save(category);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        ArticleCategory category = getEntityById(id);
        repository.delete(category);
    }

    private ArticleCategory getEntityById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }

    private ArticleCategoryResponse mapToResponse(ArticleCategory category) {
        ArticleCategoryResponse response = new ArticleCategoryResponse();
        response.setId(category.getId());
        response.setName(category.getName());
        response.setSlug(category.getSlug());
        response.setDescription(category.getDescription());
        return response;
    }
}
