package com.example.demo.service.impl;

import com.example.demo.dto.request.ReviewCreateRequest;
import com.example.demo.dto.request.ReviewUpdateRequest;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.dto.response.ReviewResponse;
import com.example.demo.entity.order.OrderItem;
import com.example.demo.entity.order.OrderStatus;
import com.example.demo.entity.product.Product;
import com.example.demo.entity.review.ProductReview;
import com.example.demo.entity.user.User;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.DuplicateResourceException;
import com.example.demo.exception.ForbiddenException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.OrderItemRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.ProductReviewRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.SecurityUtils;
import com.example.demo.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ProductReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderItemRepository orderItemRepository;

    @Override
    public PageResponse<ReviewResponse> getProductReviews(Long productId, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(size, 100));
        Page<ProductReview> reviewPage = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId, pageable);
        
        List<ReviewResponse> content = reviewPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
                
        return new PageResponse<>(content, reviewPage.getNumber(), reviewPage.getSize(), 
                reviewPage.getTotalElements(), reviewPage.getTotalPages());
    }

    @Override
    @Transactional
    public ReviewResponse addReview(ReviewCreateRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId).orElseThrow();
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        OrderItem orderItem = orderItemRepository.findById(request.getOrderItemId())
                .orElseThrow(() -> new ResourceNotFoundException("OrderItem not found"));

        if (!orderItem.getOrder().getUser().getId().equals(userId) || !orderItem.getProduct().getId().equals(product.getId())) {
            throw new ForbiddenException("You did not buy this item");
        }
        
        if (orderItem.getOrder().getStatus() == OrderStatus.CANCELLED) {
            throw new BadRequestException("Order is cancelled");
        }

        if (reviewRepository.findByUserIdAndProductId(userId, product.getId()).isPresent()) {
            throw new DuplicateResourceException("You have already reviewed this product");
        }

        ProductReview review = new ProductReview();
        review.setProduct(product);
        review.setUser(user);
        review.setOrderItem(orderItem);
        review.setRating(request.getRating());
        review.setContent(request.getContent());

        ProductReview saved = reviewRepository.save(review);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public ReviewResponse updateReview(Long reviewId, ReviewUpdateRequest request) {
        ProductReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
                
        Long userId = SecurityUtils.getCurrentUserId();
        if (!review.getUser().getId().equals(userId)) {
            throw new ForbiddenException("Not allowed to edit this review");
        }
        
        review.setRating(request.getRating());
        review.setContent(request.getContent());
        return mapToResponse(reviewRepository.save(review));
    }

    @Override
    @Transactional
    public void deleteReview(Long reviewId) {
        ProductReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
                
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId).orElseThrow();
        
        if (!review.getUser().getId().equals(userId) && !user.getRole().name().equals("ADMIN")) {
            throw new ForbiddenException("Not allowed to delete this review");
        }
        
        reviewRepository.delete(review);
    }
    
    private ReviewResponse mapToResponse(ProductReview review) {
        ReviewResponse res = new ReviewResponse();
        res.setId(review.getId());
        res.setProductId(review.getProduct().getId());
        res.setUserName(review.getUser().getName());
        res.setRating(review.getRating());
        res.setContent(review.getContent());
        res.setStatus(review.getStatus().name());
        res.setCreatedAt(review.getCreatedAt());
        return res;
    }
}
