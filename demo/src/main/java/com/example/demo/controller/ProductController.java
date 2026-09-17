package com.example.demo.controller;

import com.example.demo.dto.response.PageResponse;
import com.example.demo.dto.response.ProductDetailResponse;
import com.example.demo.dto.response.ProductResponse;
import com.example.demo.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService service;

    @GetMapping
    public PageResponse<ProductResponse> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String categorySlug) {
        return service.getPublishedProducts(page, size, keyword, categorySlug);
    }

    @GetMapping("/{slug}")
    public ProductDetailResponse getProductBySlug(@PathVariable String slug) {
        return service.getPublishedProductBySlug(slug);
    }

    @GetMapping("/category/{slug}")
    public PageResponse<ProductResponse> getProductsByCategory(
            @PathVariable String slug,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return service.getProductsByCategorySlug(slug, page, size);
    }
}
