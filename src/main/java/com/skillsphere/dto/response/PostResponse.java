package com.skillsphere.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class PostResponse {
    private Long id;
    private String content;
    private Long authorId;
    private String authorName;
    private String authorAvatarId;
    private List<String> authorTechStack;
    private long likeCount;
    private long dislikeCount;
    private String myReaction;   // "LIKE", "DISLIKE", or null
    private long commentCount;
    private LocalDateTime createdAt;
}
