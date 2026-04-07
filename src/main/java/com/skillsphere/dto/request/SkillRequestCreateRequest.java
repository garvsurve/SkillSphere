package com.skillsphere.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SkillRequestCreateRequest {
    @NotNull(message = "Skill ID is required")
    private Long skillId;
    
    @NotNull(message = "Learner ID is required")
    private Long learnerId;
    
    private String message;
}
