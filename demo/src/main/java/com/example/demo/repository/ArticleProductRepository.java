package com.example.demo.repository;

import com.example.demo.entity.article.ArticleProduct;
import com.example.demo.entity.article.ArticleProductId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticleProductRepository extends JpaRepository<ArticleProduct, ArticleProductId> {
}
