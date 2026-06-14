package com.messFinder.backend.controller;

import com.messFinder.backend.dtos.request.LoginRequest;
import com.messFinder.backend.dtos.request.SignupRequest;
import com.messFinder.backend.dtos.response.ApiResponse;
import com.messFinder.backend.dtos.response.AuthResponse;
import com.messFinder.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController
{
    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<com.messFinder.backend.dtos.response.ApiResponse<AuthResponse>> signup(
            @Valid @RequestBody SignupRequest request) {

        AuthResponse response = authService.signup(request);
        return ResponseEntity.ok(
                com.messFinder.backend.dtos.response.ApiResponse.success(response, "Signup successful!")
        );
    }

    @PostMapping("/login")
    public ResponseEntity<com.messFinder.backend.dtos.response.ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {

        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(
                ApiResponse.success(response, "Login successful!")
        );
    }
}
