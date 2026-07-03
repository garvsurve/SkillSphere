package com.skillsphere.controller;

import com.skillsphere.service.AiService;
import com.skillsphere.service.UserService;
import com.skillsphere.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;
    private final UserService userService;

    @PostMapping("/enhance")
    public ResponseEntity<Map<String, String>> enhancePost(@RequestBody Map<String, String> payload) {
        String draft = payload.get("text");
        if (draft == null || draft.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Text cannot be empty"));
        }
        
        String enhancedText = aiService.enhancePost(draft);
        return ResponseEntity.ok(Map.of("text", enhancedText));
    }

    @GetMapping("/matches")
    public ResponseEntity<String> getMatches(Authentication authentication) {
        User currentUser = userService.getUserByEmail(authentication.getName());
        List<User> allUsers = userService.getAllUsers();
        
        String matchesJson = aiService.getBestMatches(currentUser, allUsers);
        return ResponseEntity.ok(matchesJson);
    }
}
