package com.meditrack.reminder;

import com.meditrack.common.ApiResponse;
import com.meditrack.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reminders")
@RequiredArgsConstructor
public class ReminderController {

    private final ReminderService reminderService;

    @GetMapping("/today")
    public ResponseEntity<ApiResponse<List<ReminderResponseDTO>>> getTodayReminders(
            @AuthenticationPrincipal User user) {
        List<ReminderResponseDTO> response = reminderService.getTodayReminders(user.getId());
        return ResponseEntity.ok(ApiResponse.<List<ReminderResponseDTO>>builder()
                .success(true).message("Success").data(response).build());
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<ReminderResponseDTO>>> getHistory(
            @AuthenticationPrincipal User user) {
        List<ReminderResponseDTO> response = reminderService.getReminderHistory(user.getId());
        return ResponseEntity.ok(ApiResponse.<List<ReminderResponseDTO>>builder()
                .success(true).message("Success").data(response).build());
    }

    @PostMapping("/session/{sessionId}/medicines/{medicineId}/status")
    public ResponseEntity<ApiResponse<?>> updateMedicineStatus(
            @AuthenticationPrincipal User user,
            @PathVariable String sessionId,
            @PathVariable String medicineId,
            @Valid @RequestBody UpdateMedicineStatusRequestDTO dto) {
        reminderService.updateMedicineStatus(sessionId, medicineId, dto);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true).message("Status updated").build());
    }

    @PostMapping("/session/{sessionId}/taken-all")
    public ResponseEntity<ApiResponse<?>> markAllTaken(
            @AuthenticationPrincipal User user,
            @PathVariable String sessionId) {
        reminderService.markAllTaken(sessionId);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true).message("All medicines marked as taken").build());
    }

    @PostMapping("/session/{sessionId}/skip-all")
    public ResponseEntity<ApiResponse<?>> markAllSkipped(
            @AuthenticationPrincipal User user,
            @PathVariable String sessionId) {
        reminderService.markAllSkipped(sessionId);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true).message("All medicines skipped").build());
    }

    @PostMapping("/session/{sessionId}/snooze")
    public ResponseEntity<ApiResponse<?>> snooze(
            @AuthenticationPrincipal User user,
            @PathVariable String sessionId,
            @RequestBody Map<String, Integer> body) {
        int minutes = body.getOrDefault("minutes", 10);
        reminderService.snoozeSession(sessionId, minutes);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true).message("Reminder snoozed for " + minutes + " minutes").build());
    }
}