package com.skillsphere.controller;

import com.skillsphere.dto.request.LoginRequest;
import com.skillsphere.dto.response.JwtResponse;
import com.skillsphere.entity.User;
import com.skillsphere.security.jwt.JwtUtils;
import com.skillsphere.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // Enrich response with full user data so frontend doesn't need extra call
        User user = userService.getUserByEmail(userDetails.getUsername());

        return ResponseEntity.ok(new JwtResponse(
                jwt,
                "Bearer",
                user.getEmail(),
                user.getId(),
                user.getName(),
                user.getAvatarId(),
                user.getBio(),
                user.getExperience(),
                user.getCompany(),
                user.getTechStack(),
                user.getIntents()
        ));
    }
}
