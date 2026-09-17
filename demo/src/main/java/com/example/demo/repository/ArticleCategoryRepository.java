package com.example.demo.repository;

import com.example.demo.entity.article.ArticleCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ArticleCategoryRepository extends JpaRepository<ArticleCategory, Long> {
    Optional<ArticleCategory> findBySlug(String slug);
}
