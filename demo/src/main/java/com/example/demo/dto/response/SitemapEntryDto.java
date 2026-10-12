package com.example.demo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter @Setter @AllArgsConstructor
public class SitemapEntryDto {
    private String slug;
    private LocalDateTime lastmod;
    private String entityType; // "article", "product", "product-category", "article-category"
}
