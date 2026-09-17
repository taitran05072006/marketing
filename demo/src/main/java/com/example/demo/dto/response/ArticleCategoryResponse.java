package com.example.demo.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ArticleCategoryResponse {
    private Long id;
    private String name;
    private String slug;
    private String description;
}
