package com.skillsphere.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PostCreateRequest {
    @NotBlank(message = "Post content is required")
    @Size(max = 2000, message = "Post content must be under 2000 characters")
    private String content;
}
