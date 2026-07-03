package com.skillsphere.service;

import org.springframework.core.ParameterizedTypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillsphere.entity.GitHubProfile;
import com.skillsphere.entity.User;
import com.skillsphere.entity.VerifiedSkill;
import com.skillsphere.repository.GitHubProfileRepository;
import com.skillsphere.repository.UserRepository;
import com.skillsphere.repository.VerifiedSkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class GitHubSyncService {

    private final GitHubProfileRepository githubProfileRepository;
    private final VerifiedSkillRepository verifiedSkillRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    @Value("${github.client.id:}")
    private String clientId;

    @Value("${github.client.secret:}")
    private String clientSecret;

    private final RestClient restClient = RestClient.create();

    @Transactional
    public void connectAccount(Long userId, String oauthCode) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Map<String, String> body = new HashMap<>();
        body.put("client_id", clientId);
        body.put("client_secret", clientSecret);
        body.put("code", oauthCode);

        // 1. Exchange code for access token
        Map<String, Object> tokenResponse = restClient.post()
                .uri("https://github.com/login/oauth/access_token")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(new ParameterizedTypeReference<Map<String, Object>>() {});

        if (tokenResponse == null || !tokenResponse.containsKey("access_token")) {
            throw new RuntimeException("Failed to get GitHub access token");
        }

        String accessToken = (String) tokenResponse.get("access_token");

        // 2. Fetch GitHub username
        Map<String, Object> userResponse = restClient.get()
                .uri("https://api.github.com/user")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .retrieve()
                .body(new ParameterizedTypeReference<Map<String, Object>>() {});

        String githubUsername = (String) userResponse.get("login");

        // 3. Save Profile
        GitHubProfile profile = githubProfileRepository.findByUserId(userId)
                .orElse(GitHubProfile.builder().user(user).build());

        profile.setGithubUsername(githubUsername);
        profile.setAccessToken(accessToken);
        profile.setLastSyncedAt(null); // Force sync
        githubProfileRepository.save(profile);

        // Automatically sync skills immediately
        syncSkills(userId);
    }

    @Transactional
    public void syncSkills(Long userId) {
        GitHubProfile profile = githubProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("GitHub not connected"));

        String token = profile.getAccessToken();

        // 1. Fetch public repos
        List<Map<String, Object>> repos = restClient.get()
                .uri("https://api.github.com/user/repos?type=owner&sort=updated")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .retrieve()
                .body(new ParameterizedTypeReference<List<Map<String, Object>>>() {});

        if (repos == null || repos.isEmpty()) return;

        Map<String, Long> languageBytes = new HashMap<>();
        Map<String, Integer> languageRepoCount = new HashMap<>();

        // 2. Fetch language stats for each repo
        for (Map<String, Object> repo : repos) {
            String languagesUrl = (String) repo.get("languages_url");
            if (languagesUrl == null) continue;

            try {
                Map<String, Long> langs = restClient.get()
                        .uri(languagesUrl)
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                        .retrieve()
                        .body(new ParameterizedTypeReference<Map<String, Long>>() {});

                if (langs != null) {
                    for (Map.Entry<String, Long> entry : langs.entrySet()) {
                        String lang = entry.getKey();
                        Long bytes = entry.getValue();
                        languageBytes.put(lang, languageBytes.getOrDefault(lang, 0L) + bytes);
                        languageRepoCount.put(lang, languageRepoCount.getOrDefault(lang, 0) + 1);
                    }
                }
            } catch (Exception e) {
                // Ignore repo if language fetch fails (e.g., rate limit)
                System.err.println("Failed to fetch languages for repo: " + languagesUrl);
            }
        }

        // 3. Score calculation & DB Upsert
        verifiedSkillRepository.deleteByUserId(userId);
        List<VerifiedSkill> newSkills = new ArrayList<>();

        long maxBytes = languageBytes.values().stream().max(Long::compareTo).orElse(1L);

        for (Map.Entry<String, Long> entry : languageBytes.entrySet()) {
            String lang = entry.getKey();
            Long bytes = entry.getValue();
            int repoCount = languageRepoCount.getOrDefault(lang, 1);

            // Simple scoring: 80% volume, 20% repo count spread
            // Normalize bytes against the max byte count across languages
            double volumeScore = ((double) bytes / maxBytes) * 80.0;
            // Cap repo count score at 20 (assuming 10 repos is max score)
            double repoScore = Math.min(20.0, repoCount * 2.0); 
            
            int finalScore = (int) Math.min(100, Math.round(volumeScore + repoScore));

            VerifiedSkill skill = VerifiedSkill.builder()
                    .user(profile.getUser())
                    .language(lang)
                    .score(finalScore)
                    .linesOfCode(bytes / 30) // rough estimate of LOC from bytes
                    .repoCount(repoCount)
                    .lastSyncedAt(LocalDateTime.now())
                    .build();
            
            newSkills.add(skill);
        }

        verifiedSkillRepository.saveAll(newSkills);
        profile.setLastSyncedAt(LocalDateTime.now());
        githubProfileRepository.save(profile);
    }

    // Run every day at midnight to sync all connected users
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void scheduledSync() {
        List<GitHubProfile> profiles = githubProfileRepository.findAll();
        for (GitHubProfile p : profiles) {
            try {
                syncSkills(p.getUser().getId());
            } catch (Exception e) {
                System.err.println("Scheduled sync failed for user " + p.getUser().getId());
            }
        }
    }
}
