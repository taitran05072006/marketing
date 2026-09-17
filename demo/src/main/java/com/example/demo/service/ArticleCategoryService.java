package com.example.demo.service;

import com.example.demo.dto.request.ArticleCategoryCreateRequest;
import com.example.demo.dto.request.ArticleCategoryUpdateRequest;
import com.example.demo.dto.response.ArticleCategoryResponse;

import java.util.List;

public interface ArticleCategoryService {
    List<ArticleCategoryResponse> getAllCategories();
    ArticleCategoryResponse getCategoryBySlug(String slug);
    ArticleCategoryResponse getCategoryById(Long id);
    ArticleCategoryResponse createCategory(ArticleCategoryCreateRequest request);
    ArticleCategoryResponse updateCategory(Long id, ArticleCategoryUpdateRequest request);
    void deleteCategory(Long id);
}
