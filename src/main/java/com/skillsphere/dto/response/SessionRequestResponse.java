package com.skillsphere.dto.response;

import com.skillsphere.entity.SessionRequestStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class SessionRequestResponse {
    private Long id;
    private Long fromUserId;
    private String fromUserName;
    private String fromUserAvatarId;
    private List<String> fromUserTechStack;
    private Long toUserId;
    private String toUserName;
    private String toUserAvatarId;
    private Long postId;
    private String postContentSnippet;
    private String message;
    private String responseNote;
    private SessionRequestStatus status;
    private LocalDateTime createdAt;
}
