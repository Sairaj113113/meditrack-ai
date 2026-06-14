package com.meditrack.device;

import com.meditrack.common.ApiResponse;
import com.meditrack.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/devices")
@RequiredArgsConstructor
public class DeviceController {

    private final DeviceService deviceService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<?>> registerDevice(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UserDeviceDTO dto) {
        deviceService.registerDevice(user.getId(), dto);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true).message("Device registered").build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> unregisterDevice(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        deviceService.unregisterDevice(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true).message("Device unregistered").build());
    }
}