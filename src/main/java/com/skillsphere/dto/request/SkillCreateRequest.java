package com.skillsphere.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SkillCreateRequest {
    @NotBlank(message = "Skill title is required")
    private String title;
    
    private String description;
    
    @NotBlank(message = "Category is required")
    private String category;
}
