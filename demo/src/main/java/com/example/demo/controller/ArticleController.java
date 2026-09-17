package com.example.demo.controller;

import com.example.demo.dto.response.ArticleDetailResponse;
import com.example.demo.dto.response.ArticleResponse;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.service.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class ArticleController {
    private final ArticleService service;

    @GetMapping
    public PageResponse<ArticleResponse> getArticles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String categorySlug) {
        return service.getPublishedArticles(page, size, keyword, categorySlug);
    }

    @GetMapping("/{slug}")
    public ArticleDetailResponse getArticleBySlug(@PathVariable String slug) {
        return service.getPublishedArticleBySlug(slug);
    }

    @GetMapping("/category/{slug}")
    public PageResponse<ArticleResponse> getArticlesByCategory(
            @PathVariable String slug,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return service.getArticlesByCategorySlug(slug, page, size);
    }
}
