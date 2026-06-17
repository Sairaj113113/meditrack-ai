package com.meditrack.user;

import com.meditrack.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileDTO>> getProfile(
            @AuthenticationPrincipal User user) {

        UserProfileDTO response =
                userService.getProfile(user.getId());

        return ResponseEntity.ok(
                ApiResponse.<UserProfileDTO>builder()
                        .success(true)
                        .message("Success")
                        .data(response)
                        .build()
        );
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileDTO>> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody UserProfileDTO dto) {

        UserProfileDTO response =
                userService.updateProfile(
                        user.getId(),
                        dto
                );

        return ResponseEntity.ok(
                ApiResponse.<UserProfileDTO>builder()
                        .success(true)
                        .message("Profile updated")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/medical-profile")
    public ResponseEntity<ApiResponse<MedicalProfileDTO>> getMedicalProfile(
            @AuthenticationPrincipal User user) {

        MedicalProfileDTO response =
                userService.getMedicalProfile(
                        user.getId()
                );

        return ResponseEntity.ok(
                ApiResponse.<MedicalProfileDTO>builder()
                        .success(true)
                        .message("Success")
                        .data(response)
                        .build()
        );
    }

    @PutMapping("/medical-profile")
    public ResponseEntity<ApiResponse<MedicalProfileDTO>> updateMedicalProfile(
            @AuthenticationPrincipal User user,
            @RequestBody MedicalProfileDTO dto) {

        MedicalProfileDTO response =
                userService.updateMedicalProfile(
                        user.getId(),
                        dto
                );

        return ResponseEntity.ok(
                ApiResponse.<MedicalProfileDTO>builder()
                        .success(true)
                        .message("Medical profile updated")
                        .data(response)
                        .build()
        );
    }

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal User user,
            @RequestBody ChangePasswordDTO dto) {

        userService.changePassword(
                user.getId(),
                dto.getCurrentPassword(),
                dto.getNewPassword()
        );

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Password updated successfully")
                        .build()
        );
    }
}