package com.meditrack.settings;

import com.meditrack.common.ApiResponse;
import com.meditrack.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SettingsController {

    private final SettingsService settingsService;

    @GetMapping
    public ResponseEntity<ApiResponse<UserSettingsDTO>> getSettings(
            @AuthenticationPrincipal User user) {
        UserSettingsDTO response = settingsService.getSettings(user.getId());
        return ResponseEntity.ok(ApiResponse.<UserSettingsDTO>builder()
                .success(true).message("Success").data(response).build());
    }

    @PutMapping
    public ResponseEntity<ApiResponse<UserSettingsDTO>> updateSettings(
            @AuthenticationPrincipal User user,
            @RequestBody UserSettingsDTO dto) {
        UserSettingsDTO response = settingsService.updateSettings(user.getId(), dto);
        return ResponseEntity.ok(ApiResponse.<UserSettingsDTO>builder()
                .success(true).message("Settings updated").data(response).build());
    }
}