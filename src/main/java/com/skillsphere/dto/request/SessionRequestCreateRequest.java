package com.skillsphere.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SessionRequestCreateRequest {
    private Long postId;
    private Long toUserId;

    /** Message limited to 100 words, enforced in service */
    private String message;
}
