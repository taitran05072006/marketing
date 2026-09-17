package com.example.demo.dto.response;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class CommentResponse {
    private Long id;
    private String userName;
    private String content;
    private String status;
    private LocalDateTime createdAt;
    private List<CommentResponse> replies;
}
