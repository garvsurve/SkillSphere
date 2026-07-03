package com.skillsphere.controller;

import com.skillsphere.entity.User;
import com.skillsphere.entity.VerifiedSkill;
import com.skillsphere.repository.VerifiedSkillRepository;
import com.skillsphere.service.GitHubSyncService;
import com.skillsphere.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users/{id}")
@RequiredArgsConstructor
public class GitHubController {

    private final GitHubSyncService gitHubSyncService;
    private final UserService userService;
    private final VerifiedSkillRepository verifiedSkillRepository;

    @PostMapping("/github/connect")
    public ResponseEntity<Void> connectGitHub(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {
            
        User currentUser = userService.getUserByEmail(userDetails.getUsername());
        if (!currentUser.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        String code = body.get("code");
        if (code == null || code.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        gitHubSyncService.connectAccount(id, code);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/github/sync")
    public ResponseEntity<Void> manualSync(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
            
        User currentUser = userService.getUserByEmail(userDetails.getUsername());
        if (!currentUser.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // The service handles rate limiting or error throws if needed.
        // For simplicity, we just trigger the sync.
        gitHubSyncService.syncSkills(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/skills")
    public ResponseEntity<List<VerifiedSkill>> getVerifiedSkills(@PathVariable Long id) {
        // Publicly accessible so anyone can view the radar chart
        List<VerifiedSkill> skills = verifiedSkillRepository.findByUserId(id);
        return ResponseEntity.ok(skills);
    }
}
