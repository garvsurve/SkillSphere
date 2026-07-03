package com.skillsphere.service;

import com.skillsphere.entity.GitHubProfile;
import com.skillsphere.entity.User;
import com.skillsphere.repository.GitHubProfileRepository;
import com.skillsphere.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GitHubAuthService {

    private final UserRepository userRepository;
    private final GitHubProfileRepository gitHubProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final GitHubSyncService gitHubSyncService;
    private final RestClient restClient = RestClient.create();

    @Value("${github.client.id}")
    private String clientId;

    @Value("${github.client.secret}")
    private String clientSecret;

    @Transactional
    public User loginOrRegisterWithGitHub(String code) {
        // 1. Exchange code for access token
        Map<String, String> body = Map.of(
                "client_id", clientId,
                "client_secret", clientSecret,
                "code", code
        );

        Map<String, Object> tokenResponse = restClient.post()
                .uri("https://github.com/login/oauth/access_token")
                .accept(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(new ParameterizedTypeReference<Map<String, Object>>() {});

        if (tokenResponse == null || !tokenResponse.containsKey("access_token")) {
            throw new RuntimeException("Failed to get GitHub access token");
        }

        String accessToken = (String) tokenResponse.get("access_token");

        // 2. Fetch public profile
        Map<String, Object> userResponse = restClient.get()
                .uri("https://api.github.com/user")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .retrieve()
                .body(new ParameterizedTypeReference<Map<String, Object>>() {});

        String githubUsername = (String) userResponse.get("login");
        String name = (String) userResponse.get("name");
        if (name == null || name.isBlank()) name = githubUsername;

        // 3. Fetch primary email
        List<Map<String, Object>> emailsResponse = restClient.get()
                .uri("https://api.github.com/user/emails")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .retrieve()
                .body(new ParameterizedTypeReference<List<Map<String, Object>>>() {});

        String primaryEmail = null;
        if (emailsResponse != null) {
            for (Map<String, Object> emailObj : emailsResponse) {
                Boolean primary = (Boolean) emailObj.get("primary");
                Boolean verified = (Boolean) emailObj.get("verified");
                if (Boolean.TRUE.equals(primary) && Boolean.TRUE.equals(verified)) {
                    primaryEmail = (String) emailObj.get("email");
                    break;
                }
            }
        }

        if (primaryEmail == null) {
            throw new RuntimeException("No verified primary email found on GitHub account.");
        }

        // 4. Check if user exists or create new one
        User user = userRepository.findByEmail(primaryEmail).orElse(null);

        if (user == null) {
            // Register new user
            user = new User();
            user.setEmail(primaryEmail);
            user.setName(name);
            user.setAvatarId("avatar1");
            user.setExperience("Fresher");
            
            // Assign a random, highly secure password since they use OAuth
            String randomPassword = UUID.randomUUID().toString() + UUID.randomUUID().toString();
            user.setPassword(passwordEncoder.encode(randomPassword));
            
            user = userRepository.save(user);
        }

        // 5. Link GitHub profile
        GitHubProfile profile = gitHubProfileRepository.findByUserId(user.getId()).orElse(null);
        if (profile == null) {
            profile = new GitHubProfile();
            profile.setUser(user);
        }
        profile.setGithubUsername(githubUsername);
        profile.setAccessToken(accessToken);
        gitHubProfileRepository.save(profile);

        // 6. Trigger sync asynchronously so it doesn't block login
        final Long userId = user.getId();
        new Thread(() -> {
            try {
                gitHubSyncService.syncSkills(userId);
            } catch (Exception e) {
                System.err.println("Async GitHub sync failed for user " + userId);
            }
        }).start();

        return user;
    }
}
