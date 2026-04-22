package com.skillsphere.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String bio;
    private String profilePicture;
    private LocalDateTime createdAt;
    private java.util.List<SkillResponse> skillsOffered;
}
