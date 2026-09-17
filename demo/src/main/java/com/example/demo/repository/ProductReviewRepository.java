package com.example.demo.repository;

import com.example.demo.entity.review.ProductReview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {
    Page<ProductReview> findByProductIdOrderByCreatedAtDesc(Long productId, Pageable pageable);
    Optional<ProductReview> findByUserIdAndProductId(Long userId, Long productId);
}
