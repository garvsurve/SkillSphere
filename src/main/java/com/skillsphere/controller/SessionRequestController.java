package com.skillsphere.controller;

import com.skillsphere.dto.request.SessionRequestActionRequest;
import com.skillsphere.dto.request.SessionRequestCreateRequest;
import com.skillsphere.dto.response.SessionRequestResponse;
import com.skillsphere.service.SessionRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST endpoints for the session request workflow.
 * Base URL: /api/session-requests
 */
@RestController
@RequestMapping("/api/session-requests")
@RequiredArgsConstructor
public class SessionRequestController {

    private final SessionRequestService sessionRequestService;

    /** POST /api/session-requests — send a session request from a post */
    @PostMapping
    public ResponseEntity<SessionRequestResponse> createRequest(
            @Valid @RequestBody SessionRequestCreateRequest req,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(sessionRequestService.createRequest(userDetails.getUsername(), req));
    }

    /** GET /api/session-requests/sent — all requests I sent */
    @GetMapping("/sent")
    public ResponseEntity<List<SessionRequestResponse>> getSent(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(sessionRequestService.getSentRequests(userDetails.getUsername()));
    }

    /** GET /api/session-requests/incoming — all requests I received */
    @GetMapping("/incoming")
    public ResponseEntity<List<SessionRequestResponse>> getIncoming(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(sessionRequestService.getIncomingRequests(userDetails.getUsername()));
    }

    /** PATCH /api/session-requests/{id}/accept */
    @PatchMapping("/{id}/accept")
    public ResponseEntity<SessionRequestResponse> accept(
            @PathVariable Long id,
            @RequestBody(required = false) SessionRequestActionRequest action,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (action == null) action = new SessionRequestActionRequest();
        return ResponseEntity.ok(sessionRequestService.acceptRequest(id, userDetails.getUsername(), action));
    }

    /** PATCH /api/session-requests/{id}/reject */
    @PatchMapping("/{id}/reject")
    public ResponseEntity<SessionRequestResponse> reject(
            @PathVariable Long id,
            @RequestBody(required = false) SessionRequestActionRequest action,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (action == null) action = new SessionRequestActionRequest();
        return ResponseEntity.ok(sessionRequestService.rejectRequest(id, userDetails.getUsername(), action));
    }
}
