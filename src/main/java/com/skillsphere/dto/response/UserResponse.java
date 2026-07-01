package com.skillsphere.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String bio;
    private String profilePicture;
    private String avatarId;
    private String experience;
    private String company;
    private List<String> techStack;
    private List<String> intents;
    private LocalDateTime createdAt;
    private int followerCount;
    private List<Long> followingIds;
}
