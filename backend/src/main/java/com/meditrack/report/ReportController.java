package com.meditrack.report;

import com.meditrack.common.ApiResponse;
import com.meditrack.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/weekly")
    public ResponseEntity<ApiResponse<WeeklyReportDTO>> getWeeklyReport(
            @AuthenticationPrincipal User user) {
        WeeklyReportDTO response = reportService.getWeeklyReport(user.getId());
        return ResponseEntity.ok(ApiResponse.<WeeklyReportDTO>builder()
                .success(true).message("Success").data(response).build());
    }

    @GetMapping("/monthly")
    public ResponseEntity<ApiResponse<MonthlyReportDTO>> getMonthlyReport(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {
        MonthlyReportDTO response = reportService.getMonthlyReport(user.getId(), year, month);
        return ResponseEntity.ok(ApiResponse.<MonthlyReportDTO>builder()
                .success(true).message("Success").data(response).build());
    }

    @GetMapping("/pdf")
    public ResponseEntity<byte[]> getPdfReport(
            @AuthenticationPrincipal User user) {
        byte[] pdfBytes = reportService.generatePdfReport(user.getId());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}