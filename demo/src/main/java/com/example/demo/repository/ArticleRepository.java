package com.example.demo.repository;

import com.example.demo.entity.article.Article;
import com.example.demo.entity.article.ArticleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
    Optional<Article> findBySlug(String slug);
    Page<Article> findByTitleContainingIgnoreCase(String keyword, Pageable pageable);
    Page<Article> findByCategoryId(Long categoryId, Pageable pageable);

    Page<Article> findByStatus(ArticleStatus status, Pageable pageable);
    Page<Article> findByStatusAndTitleContainingIgnoreCase(ArticleStatus status, String keyword, Pageable pageable);
    Page<Article> findByStatusAndCategorySlug(ArticleStatus status, String slug, Pageable pageable);
}
