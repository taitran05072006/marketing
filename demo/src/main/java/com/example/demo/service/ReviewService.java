package com.example.demo.service;
import com.example.demo.dto.request.ReviewCreateRequest;
import com.example.demo.dto.request.ReviewUpdateRequest;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.dto.response.ReviewResponse;

public interface ReviewService {
    PageResponse<ReviewResponse> getProductReviews(Long productId, int page, int size);
    ReviewResponse addReview(ReviewCreateRequest request);
    ReviewResponse updateReview(Long reviewId, ReviewUpdateRequest request);
    void deleteReview(Long reviewId);
}
