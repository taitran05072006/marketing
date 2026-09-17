package com.example.demo.dto.response;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class ArticleResponse {
    private Long id;
    private String title;
    private String slug;
    private String excerpt;
    private String thumbnailUrl;
    private String thumbnailAlt;
    private String categoryName;
    private String authorName;
    private String status;
    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
