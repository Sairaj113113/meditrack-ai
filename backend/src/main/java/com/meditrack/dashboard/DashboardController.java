package com.meditrack.dashboard;

import com.meditrack.common.ApiResponse;
import com.meditrack.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<ApiResponse<DashboardDTO>> getDashboard(
            @AuthenticationPrincipal User user) {
        DashboardDTO response = dashboardService.getDashboard(user.getId());
        return ResponseEntity.ok(ApiResponse.<DashboardDTO>builder()
                .success(true).message("Success").data(response).build());
    }
}