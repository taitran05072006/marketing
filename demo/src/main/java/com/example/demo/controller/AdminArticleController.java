package com.example.demo.controller;

import com.example.demo.dto.request.ArticleCreateRequest;
import com.example.demo.dto.request.ArticleUpdateRequest;
import com.example.demo.dto.response.ArticleDetailResponse;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.service.ArticleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/articles")
@RequiredArgsConstructor
public class AdminArticleController {
    private final ArticleService service;

    @GetMapping
    public PageResponse<ArticleDetailResponse> getAllArticles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return service.getAllArticles(page, size);
    }

    @GetMapping("/{id}")
    public ArticleDetailResponse getArticleById(@PathVariable Long id) {
        return service.getArticleById(id);
    }

    @PostMapping
    public ArticleDetailResponse createArticle(@Valid @RequestBody ArticleCreateRequest request) {
        Long authorId = com.example.demo.security.SecurityUtils.getCurrentUserId();
        return service.createArticle(request, authorId);
    }

    @PutMapping("/{id}")
    public ArticleDetailResponse updateArticle(
            @PathVariable Long id,
            @Valid @RequestBody ArticleUpdateRequest request) {
        return service.updateArticle(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteArticle(@PathVariable Long id) {
        service.deleteArticle(id);
    }

    @PatchMapping("/{id}/publish")
    public void publishArticle(@PathVariable Long id) {
        service.publishArticle(id);
    }

    @PatchMapping("/{id}/draft")
    public void draftArticle(@PathVariable Long id) {
        service.draftArticle(id);
    }
}
