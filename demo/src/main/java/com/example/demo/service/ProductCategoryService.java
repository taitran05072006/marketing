package com.example.demo.service;

import com.example.demo.dto.request.ProductCategoryCreateRequest;
import com.example.demo.dto.request.ProductCategoryUpdateRequest;
import com.example.demo.dto.response.ProductCategoryResponse;

import java.util.List;

public interface ProductCategoryService {
    List<ProductCategoryResponse> getAllCategories();
    ProductCategoryResponse getCategoryBySlug(String slug);
    ProductCategoryResponse getCategoryById(Long id);
    ProductCategoryResponse createCategory(ProductCategoryCreateRequest request);
    ProductCategoryResponse updateCategory(Long id, ProductCategoryUpdateRequest request);
    void deleteCategory(Long id);
}
