package com.skillsphere.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class SkillResponse {
    private Long id;
    private String title;
    private String description;
    private String category;
    private Long ownerId;
    private String ownerName;
    private LocalDateTime createdAt;
}
