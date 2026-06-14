package com.meditrack.ocr;

import com.meditrack.common.ApiResponse;
import com.meditrack.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/ocr")
@RequiredArgsConstructor
public class OcrController {

    private final OcrService ocrService;

    @PostMapping("/upload-prescription")
    public ResponseEntity<ApiResponse<OcrResponseDTO>> uploadPrescription(
            @AuthenticationPrincipal User user,
            @RequestParam("file") MultipartFile file) {
        OcrResponseDTO response = ocrService.uploadPrescription(user.getId(), file);
        return ResponseEntity.ok(ApiResponse.<OcrResponseDTO>builder()
                .success(true).message("Prescription uploaded").data(response).build());
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<OcrResponseDTO>>> getHistory(
            @AuthenticationPrincipal User user) {
        List<OcrResponseDTO> response = ocrService.getHistory(user.getId());
        return ResponseEntity.ok(ApiResponse.<List<OcrResponseDTO>>builder()
                .success(true).message("Success").data(response).build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OcrResponseDTO>> getById(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        OcrResponseDTO response = ocrService.getById(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.<OcrResponseDTO>builder()
                .success(true).message("Success").data(response).build());
    }

    @PostMapping("/{id}/confirm")
    public ResponseEntity<ApiResponse<?>> confirmPrescription(
            @AuthenticationPrincipal User user,
            @PathVariable String id,
            @Valid @RequestBody OcrConfirmDTO dto) {
        ocrService.confirmPrescription(user.getId(), id, dto);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true).message("Prescription confirmed").build());
    }
}