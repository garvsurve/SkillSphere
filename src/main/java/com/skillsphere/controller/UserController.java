package com.skillsphere.controller;

import com.skillsphere.dto.request.UserCreateRequest;
import com.skillsphere.dto.request.UserUpdateRequest;
import com.skillsphere.dto.response.UserResponse;
import com.skillsphere.entity.User;
import com.skillsphere.mapper.EntityMapper;
import com.skillsphere.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final EntityMapper mapper;

    @PostMapping
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserCreateRequest req) {
        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(req.getPassword())
                .bio(req.getBio())
                .avatarId(req.getAvatarId())
                .experience(req.getExperience())
                .company(req.getCompany())
                .techStack(req.getTechStack() != null ? req.getTechStack() : new java.util.ArrayList<>())
                .intents(req.getIntents() != null ? req.getIntents() : new java.util.ArrayList<>())
                .build();
        User created = userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toUserResponse(created));
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers().stream()
                .map(mapper::toUserResponse).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(mapper.toUserResponse(userService.getUserById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @Valid @RequestBody UserUpdateRequest req) {
        User userUpdate = User.builder()
                .name(req.getName())
                .bio(req.getBio())
                .avatarId(req.getAvatarId())
                .experience(req.getExperience())
                .company(req.getCompany())
                .techStack(req.getTechStack() != null ? req.getTechStack() : new java.util.ArrayList<>())
                .intents(req.getIntents() != null ? req.getIntents() : new java.util.ArrayList<>())
                .build();
        return ResponseEntity.ok(mapper.toUserResponse(userService.updateUser(id, userUpdate)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/follow")
    public ResponseEntity<Void> toggleFollow(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        userService.toggleFollow(userDetails.getUsername(), id);
        return ResponseEntity.ok().build();
    }
}
