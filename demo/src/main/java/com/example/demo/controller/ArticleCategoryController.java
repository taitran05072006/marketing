package com.example.demo.controller;

import com.example.demo.dto.response.ArticleCategoryResponse;
import com.example.demo.service.ArticleCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/article-categories")
@RequiredArgsConstructor
public class ArticleCategoryController {
    private final ArticleCategoryService service;

    @GetMapping
    public List<ArticleCategoryResponse> getAllCategories() {
        return service.getAllCategories();
    }

    @GetMapping("/{slug}")
    public ArticleCategoryResponse getCategoryBySlug(@PathVariable String slug) {
        return service.getCategoryBySlug(slug);
    }
}
