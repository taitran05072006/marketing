package com.example.demo.controller;

import com.example.demo.dto.request.CommentCreateRequest;
import com.example.demo.dto.request.CommentUpdateRequest;
import com.example.demo.dto.response.CommentResponse;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/articles/{articleId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService service;

    @GetMapping
    public PageResponse<CommentResponse> getComments(
            @PathVariable Long articleId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return service.getArticleComments(articleId, page, size);
    }

    @PostMapping
    public CommentResponse addComment(
            @PathVariable Long articleId,
            @Valid @RequestBody CommentCreateRequest request) {
        return service.addComment(articleId, request);
    }

    @PutMapping("/{commentId}")
    public CommentResponse updateComment(
            @PathVariable Long articleId,
            @PathVariable Long commentId,
            @Valid @RequestBody CommentUpdateRequest request) {
        return service.updateComment(commentId, request);
    }

    @DeleteMapping("/{commentId}")
    public void deleteComment(@PathVariable Long articleId, @PathVariable Long commentId) {
        service.deleteComment(commentId);
    }
}
