package com.messFinder.backend.controller;

import com.messFinder.backend.dtos.request.CreateReviewRequest;
import com.messFinder.backend.dtos.response.ApiResponse;
import com.messFinder.backend.dtos.response.ReviewDTO;
import com.messFinder.backend.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ReviewController
{
    private final ReviewService reviewService;

    // Get all reviews for a mess (public)
    @GetMapping("/api/v1/public/messes/{messId}/reviews")
    public ResponseEntity<ApiResponse<List<ReviewDTO>>> getReviews(
            @PathVariable Long messId) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        reviewService.getReviewsByMess(messId),
                        "Reviews fetched!"
                )
        );
    }

    // Add review (logged in users only)
    @PostMapping("/api/v1/reviews/{messId}")
    public ResponseEntity<ApiResponse<ReviewDTO>> addReview(
            @PathVariable Long messId,
            @Valid @RequestBody CreateReviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        reviewService.addReview(
                                messId,
                                request,
                                userDetails.getUsername()
                        ),
                        "Review added successfully!"
                )
        );
    }

}
