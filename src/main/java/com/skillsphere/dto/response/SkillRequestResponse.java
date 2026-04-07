package com.skillsphere.dto.response;

import com.skillsphere.entity.RequestStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class SkillRequestResponse {
    private Long id;
    private Long skillId;
    private String skillTitle;
    private Long learnerId;
    private String learnerName;
    private RequestStatus status;
    private String message;
    private String meetingLink;
    private LocalDateTime scheduledAt;
    private LocalDateTime createdAt;
}
