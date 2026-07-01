package com.skillsphere.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class UserUpdateRequest {
    @NotBlank(message = "Name is required")
    private String name;

    private String bio;

    private String avatarId;

    private String experience;

    private String company;

    private List<String> techStack = new ArrayList<>();

    private List<String> intents = new ArrayList<>();
}
