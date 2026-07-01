package com.skillsphere.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class PostCommentResponse {
    private Long id;
    private String content;
    private Long authorId;
    private String authorName;
    private String authorAvatarId;
    private LocalDateTime createdAt;
    private List<PostCommentResponse> replies;
}
