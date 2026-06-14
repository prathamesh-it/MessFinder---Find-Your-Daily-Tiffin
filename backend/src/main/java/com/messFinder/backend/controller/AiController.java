package com.messFinder.backend.controller;

import com.messFinder.backend.dtos.response.ApiResponse;
import com.messFinder.backend.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AiController
{
    private final AiService aiService;

    @GetMapping("/summarize/{messId}")
    public ResponseEntity<ApiResponse<String>> summarize(
            @PathVariable Long messId) {

        String summary = aiService.summarizeReviews(messId);
        return ResponseEntity.ok(
                ApiResponse.success(summary, "Summary generated!")
        );
    }
}
