package com.meditrack.adherence;

import com.meditrack.common.ApiResponse;
import com.meditrack.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/api/adherence")
@RequiredArgsConstructor
public class AdherenceController {

    private final AdherenceService adherenceService;

    @GetMapping("/daily")
    public ResponseEntity<ApiResponse<AdherenceDTO>> getDaily(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String date) {
        LocalDate targetDate = date != null ? LocalDate.parse(date) : LocalDate.now();
        AdherenceDTO response = adherenceService.getDailyAdherence(user.getId(), targetDate);
        return ResponseEntity.ok(ApiResponse.<AdherenceDTO>builder()
                .success(true).message("Success").data(response).build());
    }

    @GetMapping("/weekly")
    public ResponseEntity<ApiResponse<List<AdherenceDTO>>> getWeekly(
            @AuthenticationPrincipal User user) {
        List<AdherenceDTO> response = adherenceService.getWeeklyAdherence(user.getId());
        return ResponseEntity.ok(ApiResponse.<List<AdherenceDTO>>builder()
                .success(true).message("Success").data(response).build());
    }

    @GetMapping("/monthly")
    public ResponseEntity<ApiResponse<List<AdherenceDTO>>> getMonthly(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {
        YearMonth ym = (year != null && month != null)
                ? YearMonth.of(year, month) : YearMonth.now();
        List<AdherenceDTO> response = adherenceService
                .getMonthlyAdherence(user.getId(), ym.getYear(), ym.getMonthValue());
        return ResponseEntity.ok(ApiResponse.<List<AdherenceDTO>>builder()
                .success(true).message("Success").data(response).build());
    }

    @GetMapping("/streak")
    public ResponseEntity<ApiResponse<AdherenceDTO>> getStreak(
            @AuthenticationPrincipal User user) {
        AdherenceDTO response = adherenceService.getStreak(user.getId());
        return ResponseEntity.ok(ApiResponse.<AdherenceDTO>builder()
                .success(true).message("Success").data(response).build());
    }

    @GetMapping("/calendar")
    public ResponseEntity<ApiResponse<MedicationCalendarResponseDto>> getCalendar(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {
        YearMonth ym = (year != null && month != null)
                ? YearMonth.of(year, month) : YearMonth.now();
        MedicationCalendarResponseDto response = adherenceService
                .getCalendar(user.getId(), ym.getYear(), ym.getMonthValue());
        return ResponseEntity.ok(ApiResponse.<MedicationCalendarResponseDto>builder()
                .success(true).message("Success").data(response).build());
    }

    @GetMapping("/day/{date}")
    public ResponseEntity<ApiResponse<DailyMedicationDetailsResponseDto>> getDayDetails(
            @AuthenticationPrincipal User user,
            @PathVariable String date) {
        DailyMedicationDetailsResponseDto response = adherenceService
                .getDailyDetails(user.getId(), LocalDate.parse(date));
        return ResponseEntity.ok(ApiResponse.<DailyMedicationDetailsResponseDto>builder()
                .success(true).message("Success").data(response).build());
    }
}