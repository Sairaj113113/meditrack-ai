package com.meditrack.routine;

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
@RequestMapping("/api/routines")
@RequiredArgsConstructor
public class RoutineController {

    private final RoutineService routineService;

    @PostMapping
    public ResponseEntity<ApiResponse<RoutineResponseDTO>> createRoutine(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateRoutineDTO dto) {
        RoutineResponseDTO response = routineService.createRoutine(user.getId(), dto);
        return ResponseEntity.ok(ApiResponse.<RoutineResponseDTO>builder()
                .success(true).message(response.getMessage()).data(response).build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RoutineResponseDTO>>> getRoutines(
            @AuthenticationPrincipal User user) {
        List<RoutineResponseDTO> response = routineService.getRoutines(user.getId());
        return ResponseEntity.ok(ApiResponse.<List<RoutineResponseDTO>>builder()
                .success(true).message("Success").data(response).build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RoutineDetailsDTO>> getRoutineDetails(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        RoutineDetailsDTO response = routineService.getRoutineDetails(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.<RoutineDetailsDTO>builder()
                .success(true).message("Success").data(response).build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> updateRoutine(
            @AuthenticationPrincipal User user,
            @PathVariable String id,
            @RequestBody UpdateRoutineDTO dto) {
        routineService.updateRoutine(user.getId(), id, dto);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true).message("Routine updated").build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteRoutine(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        routineService.deleteRoutine(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true).message("Routine deleted").build());
    }

    @PostMapping("/{id}/medicines")
    public ResponseEntity<ApiResponse<?>> addMedicineToRoutine(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        routineService.addMedicineToRoutine(id, body);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true).message("Medicine added to routine").build());
    }

    @DeleteMapping("/{routineId}/medicines/{medicineId}")
    public ResponseEntity<ApiResponse<?>> removeMedicineFromRoutine(
            @PathVariable String routineId,
            @PathVariable String medicineId) {
        routineService.removeMedicineFromRoutine(routineId, medicineId);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true).message("Medicine removed from routine").build());
    }
}