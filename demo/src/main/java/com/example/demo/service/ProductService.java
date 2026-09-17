package com.example.demo.service;

import com.example.demo.dto.request.ProductCreateRequest;
import com.example.demo.dto.request.ProductUpdateRequest;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.dto.response.ProductDetailResponse;
import com.example.demo.dto.response.ProductResponse;

public interface ProductService {
    PageResponse<ProductResponse> getPublishedProducts(int page, int size, String keyword, String categorySlug);
    ProductDetailResponse getPublishedProductBySlug(String slug);
    PageResponse<ProductResponse> getProductsByCategorySlug(String slug, int page, int size);
    
    // Admin
    PageResponse<ProductDetailResponse> getAllProducts(int page, int size);
    ProductDetailResponse getProductById(Long id);
    ProductDetailResponse createProduct(ProductCreateRequest request);
    ProductDetailResponse updateProduct(Long id, ProductUpdateRequest request);
    void deleteProduct(Long id);
}
