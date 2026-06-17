
package com.meditrack.caregiver;

import com.meditrack.common.ApiResponse;
import com.meditrack.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/caregivers")
@RequiredArgsConstructor
public class CaregiverController {

    private final CaregiverService caregiverService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CaregiverDTO>>> getCaregivers(
            @AuthenticationPrincipal User user
    ) {

        List<CaregiverDTO> response =
                caregiverService.getCaregivers(
                        user.getId()
                );

        return ResponseEntity.ok(
                ApiResponse.<List<CaregiverDTO>>builder()
                        .success(true)
                        .message("Success")
                        .data(response)
                        .build()
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CaregiverDTO>> addCaregiver(
            @AuthenticationPrincipal User user,
            @RequestBody CaregiverDTO dto
    ) {

        CaregiverDTO response =
                caregiverService.addCaregiver(
                        user.getId(),
                        dto
                );

        return ResponseEntity.ok(
                ApiResponse.<CaregiverDTO>builder()
                        .success(true)
                        .message("Caregiver added")
                        .data(response)
                        .build()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CaregiverDTO>> updateCaregiver(
            @AuthenticationPrincipal User user,
            @PathVariable String id,
            @RequestBody CaregiverDTO dto
    ) {

        CaregiverDTO response =
                caregiverService.updateCaregiver(
                        user.getId(),
                        id,
                        dto
                );

        return ResponseEntity.ok(
                ApiResponse.<CaregiverDTO>builder()
                        .success(true)
                        .message("Caregiver updated")
                        .data(response)
                        .build()
        );
    }

    @PutMapping("/set-primary/{id}")
    public ResponseEntity<ApiResponse<?>> setPrimaryCaregiver(
            @AuthenticationPrincipal User user,
            @PathVariable String id
    ) {

        caregiverService.setPrimaryCaregiver(
                user.getId(),
                id
        );

        return ResponseEntity.ok(
                ApiResponse.builder()
                        .success(true)
                        .message("Primary caregiver updated")
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> removeCaregiver(
            @AuthenticationPrincipal User user,
            @PathVariable String id
    ) {

        caregiverService.removeCaregiver(
                user.getId(),
                id
        );

        return ResponseEntity.ok(
                ApiResponse.builder()
                        .success(true)
                        .message("Caregiver removed")
                        .build()
        );
    }

    @PostMapping("/invite")
    public ResponseEntity<ApiResponse<CaregiverDTO>> inviteCaregiver(
            @AuthenticationPrincipal User user,
            @RequestBody CaregiverDTO dto
    ) {

        CaregiverDTO response =
                caregiverService.inviteCaregiver(
                        user.getId(),
                        dto
                );

        return ResponseEntity.ok(
                ApiResponse.<CaregiverDTO>builder()
                        .success(true)
                        .message("Invite sent")
                        .data(response)
                        .build()
        );
    }

    @PostMapping("/accept")
    public ResponseEntity<ApiResponse<?>> acceptInvite(
            @RequestBody Map<String, String> body
    ) {

        caregiverService.acceptInvite(
                body.get("caregiverId")
        );

        return ResponseEntity.ok(
                ApiResponse.builder()
                        .success(true)
                        .message("Invite accepted")
                        .build()
        );
    }

    @PostMapping("/reject")
    public ResponseEntity<ApiResponse<?>> rejectInvite(
            @RequestBody Map<String, String> body
    ) {

        caregiverService.rejectInvite(
                body.get("caregiverId")
        );

        return ResponseEntity.ok(
                ApiResponse.builder()
                        .success(true)
                        .message("Invite rejected")
                        .build()
        );
    }
}

