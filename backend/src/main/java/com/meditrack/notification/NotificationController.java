package com.meditrack.notification;

import com.meditrack.common.ApiResponse;
import com.meditrack.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationDTO>>> getNotifications(
            @AuthenticationPrincipal User user) {
        List<NotificationDTO> response = notificationService.getNotifications(user.getId());
        return ResponseEntity.ok(ApiResponse.<List<NotificationDTO>>builder()
                .success(true).message("Success").data(response).build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<NotificationDTO>> getNotificationById(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        NotificationDTO response = notificationService.getNotificationById(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.<NotificationDTO>builder()
                .success(true).message("Success").data(response).build());
    }

    @PutMapping("/read/{id}")
    public ResponseEntity<ApiResponse<?>> markAsRead(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        notificationService.markAsRead(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true).message("Marked as read").build());
    }

    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<?>> markAllAsRead(
            @AuthenticationPrincipal User user) {
        notificationService.markAllAsRead(user.getId());
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true).message("All marked as read").build());
    }
}