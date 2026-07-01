package com.skillsphere.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String type;
    private String email;
    /** User's database ID — needed so frontend can make user-specific API calls */
    private Long userId;
    private String name;
    private String avatarId;
    private String bio;
    private String experience;
    private String company;
    private List<String> techStack;
    private List<String> intents;
}
