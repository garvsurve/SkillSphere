package com.skillsphere.dto.request;

import lombok.Data;

@Data
public class SessionRequestActionRequest {
    /** Optional response note from receiver — max 100 words enforced in service */
    private String responseNote;
}
