package com.skillsphere.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SessionScheduleRequest {
    @NotBlank(message = "Meeting link is required")
    private String meetingLink;
    
    @NotNull(message = "Schedule time is required")
    private LocalDateTime scheduledAt;
}
