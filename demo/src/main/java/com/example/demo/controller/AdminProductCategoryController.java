package com.example.demo.controller;

import com.example.demo.dto.request.ProductCategoryCreateRequest;
import com.example.demo.dto.request.ProductCategoryUpdateRequest;
import com.example.demo.dto.response.ProductCategoryResponse;
import com.example.demo.service.ProductCategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/product-categories")
@RequiredArgsConstructor
public class AdminProductCategoryController {
    private final ProductCategoryService service;

    @GetMapping
    public List<ProductCategoryResponse> getAllCategories() {
        return service.getAllCategories();
    }

    @PostMapping
    public ProductCategoryResponse createCategory(@Valid @RequestBody ProductCategoryCreateRequest request) {
        return service.createCategory(request);
    }

    @PutMapping("/{id}")
    public ProductCategoryResponse updateCategory(@PathVariable Long id, @Valid @RequestBody ProductCategoryUpdateRequest request) {
        return service.updateCategory(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable Long id) {
        service.deleteCategory(id);
    }
}
