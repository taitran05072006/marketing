package com.example.demo.repository;

import com.example.demo.entity.article.Article;
import com.example.demo.entity.article.ArticleStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
    Optional<Article> findBySlug(String slug);
    Page<Article> findByTitleContainingIgnoreCase(String keyword, Pageable pageable);
    Page<Article> findByCategoryId(Long categoryId, Pageable pageable);

    @EntityGraph(attributePaths = {"author", "category"})
    Page<Article> findByStatus(ArticleStatus status, Pageable pageable);

    @EntityGraph(attributePaths = {"author", "category"})
    Page<Article> findByStatusAndTitleContainingIgnoreCase(ArticleStatus status, String keyword, Pageable pageable);

    @EntityGraph(attributePaths = {"author", "category"})
    Page<Article> findByStatusAndCategorySlug(ArticleStatus status, String slug, Pageable pageable);

    @EntityGraph(attributePaths = {"author", "category"})
    Optional<Article> findBySlugAndStatus(String slug, ArticleStatus status);

    // For sitemap
    @Query("SELECT a FROM Article a WHERE a.status = :status ORDER BY a.updatedAt DESC")
    List<Article> findAllByStatusForSitemap(@Param("status") ArticleStatus status);
}
