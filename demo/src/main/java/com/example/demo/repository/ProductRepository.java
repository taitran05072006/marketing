package com.example.demo.repository;

import com.example.demo.entity.product.Product;
import com.example.demo.entity.product.ProductStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    @EntityGraph(attributePaths = {"category"})
    Optional<Product> findBySlug(String slug);
    
    @EntityGraph(attributePaths = {"category"})
    Page<Product> findByNameContainingIgnoreCase(String keyword, Pageable pageable);
    
    @EntityGraph(attributePaths = {"category"})
    Page<Product> findByCategorySlug(String slug, Pageable pageable);
    
    // Status-filtered methods with EntityGraph to prevent category N+1
    @EntityGraph(attributePaths = {"category"})
    Page<Product> findByStatus(ProductStatus status, Pageable pageable);
    
    @EntityGraph(attributePaths = {"category"})
    Page<Product> findByStatusAndNameContainingIgnoreCase(ProductStatus status, String keyword, Pageable pageable);
    
    @EntityGraph(attributePaths = {"category"})
    Page<Product> findByStatusAndCategorySlug(ProductStatus status, String slug, Pageable pageable);
    
    @Override
    @EntityGraph(attributePaths = {"category"})
    Page<Product> findAll(Pageable pageable);
}
