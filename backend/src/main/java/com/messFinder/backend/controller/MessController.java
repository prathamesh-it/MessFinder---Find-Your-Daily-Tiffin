package com.messFinder.backend.controller;

import com.messFinder.backend.dtos.request.CreateMessRequest;
import com.messFinder.backend.dtos.request.OwnerUpdateMessRequest;
import com.messFinder.backend.dtos.response.ApiResponse;
import com.messFinder.backend.dtos.response.MessDetailDTO;
import com.messFinder.backend.dtos.response.MessSummaryDTO;
import com.messFinder.backend.service.MessService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class MessController
{
    private final MessService messService;

    // ─── PUBLIC ROUTES ────────────────────────────────────────────
    // Get all messes
    @GetMapping("/api/v1/public/messes")
    public ResponseEntity<ApiResponse<List<MessSummaryDTO>>> getAllMesses() {
        return ResponseEntity.ok(
                ApiResponse.success(messService.getAllMesses(), "Messes fetched!")
        );
    }

    // Search messes
    @GetMapping("/api/v1/public/messes/search")
    public ResponseEntity<ApiResponse<List<MessSummaryDTO>>> searchMesses(
            @RequestParam String query) {
        return ResponseEntity.ok(
                ApiResponse.success(messService.searchMesses(query), "Search results!")
        );
    }

    // Get featured messes
    @GetMapping("/api/v1/public/messes/featured")
    public ResponseEntity<ApiResponse<List<MessSummaryDTO>>> getFeatured() {
        return ResponseEntity.ok(
                ApiResponse.success(messService.getFeaturedMesses(), "Featured messes!")
        );
    }

    // Get mess by id
    @GetMapping("/api/v1/public/messes/{id}")
    public ResponseEntity<ApiResponse<MessDetailDTO>> getMessById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.success(messService.getMessById(id), "Mess detail!")
        );
    }

    // Filter by veg/nonveg
    @GetMapping("/api/v1/public/messes/filter")
    public ResponseEntity<ApiResponse<List<MessSummaryDTO>>> filterByType(
            @RequestParam Boolean isVeg) {
        return ResponseEntity.ok(
                ApiResponse.success(messService.getMessesByType(isVeg), "Filtered messes!")
        );
    }

    // ─── OWNER ROUTES ─────────────────────────────────────────────
    // Create mess
    @PostMapping("/api/v1/owner/mess")
    public ResponseEntity<ApiResponse<MessDetailDTO>> createMess(
            @Valid @RequestBody CreateMessRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        messService.createMess(request, userDetails.getUsername()),
                        "Mess created successfully!"
                )
        );
    }

    // Update mess
    @PutMapping("/api/v1/owner/mess")
    public ResponseEntity<ApiResponse<MessDetailDTO>> updateMess(
            @RequestBody OwnerUpdateMessRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        messService.updateMess(request, userDetails.getUsername()),
                        "Mess updated successfully!"
                )
        );
    }

    // Get my mess
    @GetMapping("/api/v1/owner/mess")
    public ResponseEntity<ApiResponse<MessDetailDTO>> getMyMess(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        messService.getMyMess(userDetails.getUsername()),
                        "Your mess!"
                )
        );
    }
}
