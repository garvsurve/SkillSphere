package com.skillsphere.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class UserCreateRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    private String bio;

    /** References a preloaded avatar image, e.g. "avatar1" */
    private String avatarId;

    /** Experience level e.g. "Fresher", "1 year", "3+ years" */
    private String experience;

    /** Company or institute name */
    private String company;

    /** Tech stack / domains — will be converted to UPPERCASE in service */
    private List<String> techStack = new ArrayList<>();

    private List<String> intents = new ArrayList<>();
}
