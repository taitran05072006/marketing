package com.example.demo.controller;

import com.example.demo.dto.request.ReviewCreateRequest;
import com.example.demo.dto.request.ReviewUpdateRequest;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.dto.response.ReviewResponse;
import com.example.demo.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products/{productId}/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService service;

    @GetMapping
    public PageResponse<ReviewResponse> getReviews(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return service.getProductReviews(productId, page, size);
    }

    @PostMapping
    public ReviewResponse addReview(
            @PathVariable Long productId,
            @Valid @RequestBody ReviewCreateRequest request) {
        request.setProductId(productId);
        return service.addReview(request);
    }

    @PutMapping("/{reviewId}")
    public ReviewResponse updateReview(
            @PathVariable Long productId,
            @PathVariable Long reviewId,
            @Valid @RequestBody ReviewUpdateRequest request) {
        return service.updateReview(reviewId, request);
    }

    @DeleteMapping("/{reviewId}")
    public void deleteReview(@PathVariable Long productId, @PathVariable Long reviewId) {
        service.deleteReview(reviewId);
    }
}
