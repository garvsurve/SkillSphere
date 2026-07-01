package com.skillsphere.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PostCommentRequest {
    @NotBlank(message = "Comment content is required")
    private String content;
    private Long parentCommentId;
}
