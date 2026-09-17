package com.example.demo.dto.response;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class ReviewResponse {
    private Long id;
    private Long productId;
    private String userName;
    private Integer rating;
    private String content;
    private String status;
    private LocalDateTime createdAt;
}
