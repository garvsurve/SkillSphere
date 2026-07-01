package com.skillsphere.controller;

import com.skillsphere.dto.request.MessageSendRequest;
import com.skillsphere.dto.response.MessageResponse;
import com.skillsphere.dto.response.UserResponse;
import com.skillsphere.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<MessageResponse> sendMessage(Authentication authentication, @Valid @RequestBody MessageSendRequest req) {
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        return ResponseEntity.status(HttpStatus.CREATED).body(messageService.sendMessage(email, req));
    }

    @GetMapping("/{otherUserId}")
    public ResponseEntity<List<MessageResponse>> getChatHistory(Authentication authentication, @PathVariable Long otherUserId) {
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        return ResponseEntity.ok(messageService.getChatHistory(email, otherUserId));
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<UserResponse>> getConversations(Authentication authentication) {
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        return ResponseEntity.ok(messageService.getConversations(email));
    }
}
