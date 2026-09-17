package com.example.demo.dto.response;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class ArticleDetailResponse {
    private Long id;
    private String title;
    private String slug;
    private String excerpt;
    private String content;
    private String thumbnailUrl;
    private String thumbnailAlt;
    private String categoryName;
    private String authorName;
    private String status;
    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ProductResponse> relatedProducts;
}
