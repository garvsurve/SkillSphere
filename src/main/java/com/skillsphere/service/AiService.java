package com.skillsphere.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import com.skillsphere.entity.User;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AiService {

    @Value("${skillsphere.gemini.api.key}")
    private String apiKey;

    @Value("${skillsphere.gemini.api.key.backup:}")
    private String backupApiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    public String enhancePost(String draft) {
        if (apiKey == null || apiKey.isBlank() || apiKey.equals("your_api_key_here")) {
            throw new RuntimeException("Gemini API key is not configured. Please set GEMINI_API_KEY.");
        }
        
        String[] keysToTry = (backupApiKey != null && !backupApiKey.isBlank()) 
                ? new String[]{apiKey, backupApiKey} 
                : new String[]{apiKey};
                
        String model = "gemini-2.5-flash";
        
        Exception lastException = null;

        for (String key : keysToTry) {
            for (int attempt = 1; attempt <= 2; attempt++) {
                try {
                    return callGeminiApi(draft, key, model);
                } catch (Exception e) {
                    lastException = e;
                    if (e.getMessage().contains("429")) {
                        System.out.println("Rate limited on key. Waiting 15 seconds before retry...");
                        try {
                            Thread.sleep(15000);
                        } catch (InterruptedException ie) {
                            Thread.currentThread().interrupt();
                        }
                    } else {
                        break;
                    }
                }
            }
        }
        
        System.out.println("Gemini API exhausted. Using offline heuristic fallback.");
        return heuristicEnhance(draft);
    }

    private String heuristicEnhance(String draft) {
        String enhanced = draft.trim();
        if (enhanced.isEmpty()) return enhanced;
        enhanced = enhanced.substring(0, 1).toUpperCase() + enhanced.substring(1);
        if (!enhanced.endsWith(".") && !enhanced.endsWith("!") && !enhanced.endsWith("?")) {
            enhanced += ".";
        }
        return enhanced + " 🚀✨\n\n#Update";
    }

    private String callGeminiApi(String draft, String key, String model) throws Exception {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + key;
        
        String prompt = "You are an AI assistant for a developer platform called SkillSphere. " +
                        "Your job is to enhance a user's rough draft for a post. " +
                        "Fix grammar, improve the tone, add relevant emojis, and keep it concise. " +
                        "IMPORTANT: You must also append the most relevant intent hashtag at the end of the post. " +
                        "The possible intents are: #AskForHelp, #ShareKnowledge, #ShareProject, #Update, #Collaborators, #OpenSource, #Learning. " +
                        "Return ONLY the enhanced text, without quotes or conversational filler. " +
                        "Here is the draft:\n" + draft;

        Map<String, Object> requestBodyMap = Map.of(
            "contents", new Object[]{
                Map.of("parts", new Object[]{
                    Map.of("text", prompt)
                })
            }
        );

        String requestBody = objectMapper.writeValueAsString(requestBodyMap);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("Error from Gemini API: " + response.statusCode() + " - " + response.body());
        }

        JsonNode root = objectMapper.readTree(response.body());
        return root.path("candidates").get(0)
                   .path("content")
                   .path("parts").get(0)
                   .path("text").asText().trim();
    }

    public String getBestMatches(User currentUser, List<User> candidates) {
        if (apiKey == null || apiKey.isBlank() || apiKey.equals("your_api_key_here")) {
            throw new RuntimeException("Gemini API key is not configured.");
        }

        try {
            // Simplify user representations to save tokens
            String currentUserJson = objectMapper.writeValueAsString(Map.of(
                    "id", currentUser.getId(),
                    "name", currentUser.getName(),
                    "experience", currentUser.getExperience(),
                    "techStack", currentUser.getTechStack(),
                    "intents", currentUser.getIntents(),
                    "bio", currentUser.getBio()
            ));

            List<Map<String, Object>> candidatesJson = candidates.stream()
                    .filter(u -> !u.getId().equals(currentUser.getId()))
                    .map(u -> Map.of(
                            "id", u.getId(),
                            "name", u.getName(),
                            "experience", u.getExperience(),
                            "techStack", u.getTechStack(),
                            "intents", u.getIntents(),
                            "bio", u.getBio()
                    )).collect(Collectors.toList());

            String candidatesStr = objectMapper.writeValueAsString(candidatesJson);

            String prompt = "You are an AI Matchmaker for SkillSphere. I will provide a 'currentUser' and a list of 'candidates'. " +
                    "Your job is to pick the top 3 best matching candidates for the currentUser based on complementary tech stacks, intents, and experience. " +
                    "Return a JSON array of objects. Each object must have an 'id' (the candidate's id) and a 'reason' (a 1-sentence explanation of why they are a good match). " +
                    "DO NOT return markdown blocks, just raw JSON. " +
                    "\n\ncurrentUser:\n" + currentUserJson +
                    "\n\ncandidates:\n" + candidatesStr;

            String[] keysToTry = (backupApiKey != null && !backupApiKey.isBlank()) 
                    ? new String[]{apiKey, backupApiKey} 
                    : new String[]{apiKey};
            String model = "gemini-2.5-flash";
            
            String responseText = null;
            Exception lastException = null;

            for (String key : keysToTry) {
                for (int attempt = 1; attempt <= 1; attempt++) { // Reduced to 1 attempt for matchmaker to fail fast
                    try {
                        responseText = callGeminiApi(prompt, key, model);
                        break;
                    } catch (Exception e) {
                        lastException = e;
                    }
                }
                if (responseText != null) break;
            }

            if (responseText == null) {
                System.out.println("Matchmaker API exhausted. Using offline heuristic fallback.");
                return heuristicMatchmaker(candidates, currentUser);
            }
            
            // Clean up potential markdown formatting from Gemini response
            if (responseText.startsWith("```json")) {
                responseText = responseText.substring(7);
            }
            if (responseText.startsWith("```")) {
                responseText = responseText.substring(3);
            }
            if (responseText.endsWith("```")) {
                responseText = responseText.substring(0, responseText.length() - 3);
            }
            return responseText.trim();

        } catch (Exception e) {
            System.out.println("Matchmaker exception. Using offline heuristic fallback.");
            return heuristicMatchmaker(candidates, currentUser);
        }
    }

    private String heuristicMatchmaker(List<User> candidates, User currentUser) {
        List<Map<String, String>> result = new java.util.ArrayList<>();
        int count = 0;
        for (User c : candidates) {
            if (!c.getId().equals(currentUser.getId())) {
                result.add(Map.of("id", c.getId().toString(), "reason", "Great profile match based on complementary skills!"));
                count++;
                if (count >= 3) break;
            }
        }
        try {
            return objectMapper.writeValueAsString(result);
        } catch (Exception e) {
            return "[]";
        }
    }
}
