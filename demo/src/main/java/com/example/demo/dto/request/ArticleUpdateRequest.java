package com.example.demo.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class ArticleUpdateRequest {
    @NotBlank(message = "Title cannot be blank")
    private String title;

    @NotBlank(message = "Slug cannot be blank")
    private String slug;

    private String excerpt;

    @NotBlank(message = "Content cannot be blank")
    private String content;

    private String thumbnailUrl;
    private String thumbnailAlt;

    @NotNull(message = "Category ID cannot be null")
    private Long categoryId;

    private List<Long> productIds;

    private String status;
}
