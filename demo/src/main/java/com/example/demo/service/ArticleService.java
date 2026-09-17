package com.example.demo.service;

import com.example.demo.dto.request.ArticleCreateRequest;
import com.example.demo.dto.request.ArticleUpdateRequest;
import com.example.demo.dto.response.ArticleDetailResponse;
import com.example.demo.dto.response.ArticleResponse;
import com.example.demo.dto.response.PageResponse;

public interface ArticleService {
    PageResponse<ArticleResponse> getPublishedArticles(int page, int size, String keyword, String categorySlug);
    ArticleDetailResponse getPublishedArticleBySlug(String slug);
    PageResponse<ArticleResponse> getArticlesByCategorySlug(String slug, int page, int size);
    
    // Admin
    PageResponse<ArticleDetailResponse> getAllArticles(int page, int size);
    ArticleDetailResponse getArticleById(Long id);
    ArticleDetailResponse createArticle(ArticleCreateRequest request, Long authorId);
    ArticleDetailResponse updateArticle(Long id, ArticleUpdateRequest request);
    void deleteArticle(Long id);
    void publishArticle(Long id);
    void draftArticle(Long id);
}
