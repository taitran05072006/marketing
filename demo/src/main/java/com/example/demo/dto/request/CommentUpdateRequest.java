package com.example.demo.dto.request;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentUpdateRequest {
    @NotBlank(message = "Content cannot be blank")
    @Size(max = 1000, message = "Content too long")
    private String content;
}
