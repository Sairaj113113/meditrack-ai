package com.meditrack.medicine;

import com.meditrack.common.ApiResponse;
import com.meditrack.enums.MedicineCategory;
import com.meditrack.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicines")
@RequiredArgsConstructor
public class MedicineController {

    private final MedicineService medicineService;

    @PostMapping
    public ResponseEntity<ApiResponse<MedicineResponseDTO>> addMedicine(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody AddMedicineDTO dto) {
        MedicineResponseDTO response = medicineService.addMedicine(user.getId(), dto);
        return ResponseEntity.ok(ApiResponse.<MedicineResponseDTO>builder()
                .success(true).message("Medicine added").data(response).build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MedicineResponseDTO>>> getMedicines(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) MedicineCategory category,
            @RequestParam(required = false) String period) {
        List<MedicineResponseDTO> response =
                medicineService.getMedicines(user.getId(), category, period);
        return ResponseEntity.ok(ApiResponse.<List<MedicineResponseDTO>>builder()
                .success(true).message("Success").data(response).build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MedicineResponseDTO>> getMedicineById(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        MedicineResponseDTO response = medicineService.getMedicineById(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.<MedicineResponseDTO>builder()
                .success(true).message("Success").data(response).build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MedicineResponseDTO>> updateMedicine(
            @AuthenticationPrincipal User user,
            @PathVariable String id,
            @Valid @RequestBody EditMedicineDTO dto) {
        MedicineResponseDTO response = medicineService.updateMedicine(user.getId(), id, dto);
        return ResponseEntity.ok(ApiResponse.<MedicineResponseDTO>builder()
                .success(true).message("Medicine updated").data(response).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteMedicine(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        medicineService.deleteMedicine(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true).message("Medicine deleted").build());
    }

    @PostMapping("/{id}/pause")
    public ResponseEntity<ApiResponse<?>> pauseMedicine(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        medicineService.pauseMedicine(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true).message("Medicine paused").build());
    }

    @PostMapping("/{id}/resume")
    public ResponseEntity<ApiResponse<?>> resumeMedicine(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        medicineService.resumeMedicine(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true).message("Medicine resumed").build());
    }

    @PostMapping("/{id}/archive")
    public ResponseEntity<ApiResponse<?>> archiveMedicine(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        medicineService.archiveMedicine(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true).message("Medicine archived").build());
    }

    @PostMapping("/{id}/unarchive")
    public ResponseEntity<ApiResponse<?>> unarchiveMedicine(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        medicineService.unarchiveMedicine(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true).message("Medicine unarchived").build());
    }

    @GetMapping("/archived")
    public ResponseEntity<ApiResponse<List<MedicineResponseDTO>>> getArchivedMedicines(
            @AuthenticationPrincipal User user) {
        List<MedicineResponseDTO> response =
                medicineService.getArchivedMedicines(user.getId());
        return ResponseEntity.ok(ApiResponse.<List<MedicineResponseDTO>>builder()
                .success(true).message("Success").data(response).build());
    }
}