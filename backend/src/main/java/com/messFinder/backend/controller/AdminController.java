package com.messFinder.backend.controller;

import com.messFinder.backend.dtos.response.AdminStatsDTO;
import com.messFinder.backend.dtos.response.ApiResponse;
import com.messFinder.backend.dtos.response.MessDetailDTO;
import com.messFinder.backend.dtos.response.UserDTO;
import com.messFinder.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController
{
    private final AdminService adminService;

    // Get dashboard stats
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminStatsDTO>> getStats() {
        return ResponseEntity.ok(
                ApiResponse.success(
                        adminService.getStats(),
                        "Stats fetched!"
                )
        );
    }

    // Get all messes
    @GetMapping("/messes")
    public ResponseEntity<ApiResponse<List<MessDetailDTO>>> getAllMesses() {
        return ResponseEntity.ok(
                ApiResponse.success(
                        adminService.getAllMesses(),
                        "All messes fetched!"
                )
        );
    }

    // Get all users
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getAllUsers() {
        return ResponseEntity.ok(
                ApiResponse.success(
                        adminService.getAllUsers(),
                        "All users fetched!"
                )
        );
    }

    // Get all owners
    @GetMapping("/owners")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getAllOwners() {
        return ResponseEntity.ok(
                ApiResponse.success(
                        adminService.getAllOwners(),
                        "All owners fetched!"
                )
        );
    }

    // Toggle mess active/inactive
    @PatchMapping("/messes/{id}/toggle-active")
    public ResponseEntity<ApiResponse<MessDetailDTO>> toggleActive(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        adminService.toggleMessActive(id),
                        "Mess status updated!"
                )
        );
    }

    // Toggle mess featured
    @PatchMapping("/messes/{id}/toggle-featured")
    public ResponseEntity<ApiResponse<MessDetailDTO>> toggleFeatured(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        adminService.toggleMessFeatured(id),
                        "Featured status updated!"
                )
        );
    }

    // Delete mess
    @DeleteMapping("/messes/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMess(
            @PathVariable Long id) {
        adminService.deleteMess(id);
        return ResponseEntity.ok(
                ApiResponse.success(null, "Mess deleted!")
        );
    }
}
