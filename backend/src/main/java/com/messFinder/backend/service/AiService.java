package com.messFinder.backend.service;

import com.messFinder.backend.entity.Mess;
import com.messFinder.backend.entity.Review;
import com.messFinder.backend.repository.MessRepository;
import com.messFinder.backend.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiService
{
    private final MessRepository messRepository;
    private final ReviewRepository reviewRepository;
    private final RestTemplate restTemplate;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public String summarizeReviews(Long messId) {

        Mess mess = messRepository.findById(messId)
                .orElseThrow(() -> new RuntimeException("Mess not found!"));

        // Get all approved reviews
        List<Review> reviews = reviewRepository
                .findByMessAndIsApprovedTrue(mess);

        // No reviews yet
        if (reviews.isEmpty()) {
            return "No reviews yet for this mess.";
        }

        // Build review text for prompt
        String reviewText = reviews.stream()
                .map(r -> "Rating: " + r.getRating() + "/5 — " + r.getComment())
                .collect(Collectors.joining("\n"));

        // Build prompt
        String prompt = "Summarize these reviews for \"" + mess.getName() + "\" mess " +
                "in ONE single line only. Maximum 15 words. " +
                "Cover the overall sentiment. No bullet points. Just one line.\n\n" +
                "Reviews:\n" + reviewText;

        // Call Gemini API
        return callGemini(prompt);
    }

    private String callGemini(String prompt) {
        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/" +
                    "gemini-2.5-flash:generateContent?key=" + geminiApiKey;

            // Build request body
            Map<String, Object> part    = Map.of("text", prompt);
            Map<String, Object> content = Map.of("parts", List.of(part));
            Map<String, Object> body    = Map.of("contents", List.of(content));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                    url, request, Map.class
            );

            // Parse response
            List<Map> candidates = (List<Map>) response.getBody().get("candidates");
            Map firstCandidate   = candidates.get(0);
            Map contentMap       = (Map) firstCandidate.get("content");
            List<Map> parts      = (List<Map>) contentMap.get("parts");
            return (String) parts.get(0).get("text");

        } catch (Exception e) {
            log.error("Gemini API error: {}", e.getMessage());
            return "AI summary is temporarily unavailable. Please try again later.";
        }
    }
}
