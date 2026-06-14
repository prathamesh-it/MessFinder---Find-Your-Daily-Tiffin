package com.messFinder.backend.controller;

import com.messFinder.backend.dtos.response.ApiResponse;
import com.messFinder.backend.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/owner")
@RequiredArgsConstructor
public class ImageController
{
    private final ImageService imageService;

    // Upload image
    @PostMapping("/mess/images")
    public ResponseEntity<ApiResponse<String>> uploadImage(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) throws Exception {

        String imageUrl = imageService.uploadImage(
                file,
                userDetails.getUsername()
        );

        return ResponseEntity.ok(
                ApiResponse.success(imageUrl, "Image uploaded successfully!")
        );
    }

    // Delete image
    @DeleteMapping("/mess/images/{imageId}")
    public ResponseEntity<ApiResponse<Void>> deleteImage(
            @PathVariable Long imageId,
            @AuthenticationPrincipal UserDetails userDetails) throws Exception {

        imageService.deleteImage(imageId, userDetails.getUsername());

        return ResponseEntity.ok(
                ApiResponse.success(null, "Image deleted successfully!")
        );
    }
}
