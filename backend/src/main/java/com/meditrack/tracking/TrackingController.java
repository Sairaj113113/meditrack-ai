package com.meditrack.tracking;

import com.meditrack.common.ApiResponse;
import com.meditrack.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/tracking")
@RequiredArgsConstructor
public class TrackingController {

    private final TrackingService trackingService;

    @PostMapping("/log")
    public ResponseEntity<ApiResponse<MedicineLogDTO>> logIntake(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody MedicineLogDTO dto) {
        MedicineLogDTO response = trackingService.logIntake(user.getId(), dto);
        return ResponseEntity.ok(ApiResponse.<MedicineLogDTO>builder()
                .success(true).message("Logged successfully").data(response).build());
    }

    @GetMapping("/logs")
    public ResponseEntity<ApiResponse<List<MedicineLogDTO>>> getLogs(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String date) {
        LocalDate targetDate = date != null ? LocalDate.parse(date) : LocalDate.now();
        List<MedicineLogDTO> response = trackingService.getLogsForDate(user.getId(), targetDate);
        return ResponseEntity.ok(ApiResponse.<List<MedicineLogDTO>>builder()
                .success(true).message("Success").data(response).build());
    }
}