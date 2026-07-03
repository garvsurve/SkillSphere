package com.skillsphere.controller;

import com.skillsphere.entity.Notification;
import com.skillsphere.entity.User;
import com.skillsphere.service.NotificationService;
import com.skillsphere.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    @GetMapping("/stream")
    public SseEmitter subscribe(Authentication authentication) {
        User user = userService.getUserByEmail(authentication.getName());
        return notificationService.subscribe(user.getId());
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getUnreadNotifications(Authentication authentication) {
        User user = userService.getUserByEmail(authentication.getName());
        List<Notification> unread = notificationService.getUnreadNotifications(user.getId());
        
        List<Map<String, Object>> response = unread.stream().map(n -> Map.<String, Object>of(
                "id", n.getId(),
                "message", n.getMessage(),
                "isRead", n.isRead(),
                "createdAt", n.getCreatedAt()
        )).toList();
        
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }
}
