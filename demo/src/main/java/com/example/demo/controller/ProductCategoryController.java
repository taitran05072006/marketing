package com.example.demo.controller;

import com.example.demo.dto.response.ProductCategoryResponse;
import com.example.demo.service.ProductCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-categories")
@RequiredArgsConstructor
public class ProductCategoryController {
    private final ProductCategoryService service;

    @GetMapping
    public List<ProductCategoryResponse> getAllCategories() {
        return service.getAllCategories();
    }

    @GetMapping("/{slug}")
    public ProductCategoryResponse getCategoryBySlug(@PathVariable String slug) {
        return service.getCategoryBySlug(slug);
    }
}
