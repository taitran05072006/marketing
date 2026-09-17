package com.example.demo.service;

import com.example.demo.dto.request.CommentCreateRequest;
import com.example.demo.dto.request.CommentUpdateRequest;
import com.example.demo.dto.response.CommentResponse;
import com.example.demo.dto.response.PageResponse;

public interface CommentService {
    PageResponse<CommentResponse> getArticleComments(Long articleId, int page, int size);
    CommentResponse addComment(Long articleId, CommentCreateRequest request);
    CommentResponse updateComment(Long commentId, CommentUpdateRequest request);
    void deleteComment(Long commentId);
}
