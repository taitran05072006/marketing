package com.example.demo.controller;

import com.example.demo.dto.response.SitemapEntryDto;
import com.example.demo.entity.article.Article;
import com.example.demo.entity.article.ArticleCategory;
import com.example.demo.entity.article.ArticleStatus;
import com.example.demo.entity.product.Product;
import com.example.demo.entity.product.ProductCategory;
import com.example.demo.entity.product.ProductStatus;
import com.example.demo.repository.ArticleCategoryRepository;
import com.example.demo.repository.ArticleRepository;
import com.example.demo.repository.ProductCategoryRepository;
import com.example.demo.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/sitemap")
@RequiredArgsConstructor
public class SitemapController {

    private final ArticleRepository articleRepository;
    private final ProductRepository productRepository;
    private final ArticleCategoryRepository articleCategoryRepository;
    private final ProductCategoryRepository productCategoryRepository;

    @GetMapping("/entries")
    public ResponseEntity<List<SitemapEntryDto>> getSitemapEntries() {
        List<SitemapEntryDto> entries = new ArrayList<>();

        // Articles
        List<Article> articles = articleRepository.findAllByStatusForSitemap(ArticleStatus.PUBLISHED);
        for (Article a : articles) {
            entries.add(new SitemapEntryDto(a.getSlug(), a.getUpdatedAt(), "article"));
        }

        // Products
        List<Product> products = productRepository.findAllByStatusForSitemap(ProductStatus.ACTIVE);
        for (Product p : products) {
            entries.add(new SitemapEntryDto(p.getSlug(), p.getUpdatedAt(), "product"));
        }

        // Article categories
        List<ArticleCategory> articleCats = articleCategoryRepository.findAll();
        for (ArticleCategory c : articleCats) {
            entries.add(new SitemapEntryDto(c.getSlug(), c.getUpdatedAt(), "article-category"));
        }

        // Product categories
        List<ProductCategory> productCats = productCategoryRepository.findAll();
        for (ProductCategory c : productCats) {
            entries.add(new SitemapEntryDto(c.getSlug(), c.getUpdatedAt(), "product-category"));
        }

        return ResponseEntity.ok(entries);
    }
}
