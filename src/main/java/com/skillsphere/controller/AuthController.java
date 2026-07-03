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

import com.skillsphere.service.GitHubAuthService;
import org.springframework.security.core.userdetails.UserDetailsService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserService userService;
    private final GitHubAuthService gitHubAuthService;
    private final UserDetailsService userDetailsService;

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
    @PostMapping("/github")
    public ResponseEntity<?> authenticateWithGitHub(@RequestBody java.util.Map<String, String> body) {
        String code = body.get("code");
        if (code == null || code.isBlank()) {
            return ResponseEntity.badRequest().body("Code is required");
        }

        try {
            User user = gitHubAuthService.loginOrRegisterWithGitHub(code);

            // Generate JWT for this user
            org.springframework.security.core.userdetails.UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
            org.springframework.security.authentication.UsernamePasswordAuthenticationToken authentication =
                    new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

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
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body("GitHub Authentication Failed: " + e.getMessage());
        }
    }
}
