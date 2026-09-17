package com.example.demo.controller;

import com.example.demo.dto.request.ArticleCategoryCreateRequest;
import com.example.demo.dto.request.ArticleCategoryUpdateRequest;
import com.example.demo.dto.response.ArticleCategoryResponse;
import com.example.demo.service.ArticleCategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/article-categories")
@RequiredArgsConstructor
public class AdminArticleCategoryController {
    private final ArticleCategoryService service;

    @GetMapping
    public List<ArticleCategoryResponse> getAllCategories() {
        return service.getAllCategories();
    }

    @PostMapping
    public ArticleCategoryResponse createCategory(@Valid @RequestBody ArticleCategoryCreateRequest request) {
        return service.createCategory(request);
    }

    @PutMapping("/{id}")
    public ArticleCategoryResponse updateCategory(@PathVariable Long id, @Valid @RequestBody ArticleCategoryUpdateRequest request) {
        return service.updateCategory(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable Long id) {
        service.deleteCategory(id);
    }
}
