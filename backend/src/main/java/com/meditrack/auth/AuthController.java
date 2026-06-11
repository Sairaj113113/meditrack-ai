package com.meditrack.auth;

import com.meditrack.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> register(
            @Valid @RequestBody RegisterRequestDTO dto) {
        AuthResponseDTO response = authService.register(dto);
        return ResponseEntity.ok(ApiResponse.<AuthResponseDTO>builder()
                .success(true)
                .message(response.getMessage())
                .data(response)
                .build());
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> verifyOtp(
            @Valid @RequestBody VerifyOtpDTO dto) {
        AuthResponseDTO response = authService.verifyOtp(dto);
        return ResponseEntity.ok(ApiResponse.<AuthResponseDTO>builder()
                .success(true)
                .message(response.getMessage())
                .data(response)
                .build());
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> login(
            @Valid @RequestBody LoginRequestDTO dto) {
        AuthResponseDTO response = authService.login(dto);
        return ResponseEntity.ok(ApiResponse.<AuthResponseDTO>builder()
                .success(true)
                .message(response.getMessage())
                .data(response)
                .build());
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> forgotPassword(
            @Valid @RequestBody ForgotPasswordDTO dto) {
        AuthResponseDTO response = authService.forgotPassword(dto);
        return ResponseEntity.ok(ApiResponse.<AuthResponseDTO>builder()
                .success(true)
                .message(response.getMessage())
                .data(response)
                .build());
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> resetPassword(
            @Valid @RequestBody ResetPasswordDTO dto) {
        AuthResponseDTO response = authService.resetPassword(dto);
        return ResponseEntity.ok(ApiResponse.<AuthResponseDTO>builder()
                .success(true)
                .message(response.getMessage())
                .data(response)
                .build());
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> refreshToken(
            @Valid @RequestBody RefreshTokenDTO dto) {
        AuthResponseDTO response = authService.refreshToken(dto);
        return ResponseEntity.ok(ApiResponse.<AuthResponseDTO>builder()
                .success(true)
                .message("Token refreshed")
                .data(response)
                .build());
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<?>> logout(
            @Valid @RequestBody RefreshTokenDTO dto) {
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Logged out successfully")
                .build());
    }
}