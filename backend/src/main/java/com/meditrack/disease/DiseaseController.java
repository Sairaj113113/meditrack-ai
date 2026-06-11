package com.meditrack.disease;

import com.meditrack.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/diseases")
@RequiredArgsConstructor
public class DiseaseController {

    private final DiseaseService diseaseService;

    @PostMapping
    public ApiResponse<DiseaseDTO> createDisease(
            @RequestParam String userId,
            @RequestBody DiseaseDTO dto) {

        return ApiResponse.<DiseaseDTO>builder()
                .success(true)
                .message("Disease created successfully")
                .data(diseaseService.createDisease(userId, dto))
                .build();
    }

    @GetMapping
    public ApiResponse<List<DiseaseDTO>> getAllDiseases(
            @RequestParam String userId) {

        return ApiResponse.<List<DiseaseDTO>>builder()
                .success(true)
                .message("Diseases fetched successfully")
                .data(diseaseService.getAllDiseases(userId))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<DiseaseDTO> getDiseaseById(
            @PathVariable String id) {

        return ApiResponse.<DiseaseDTO>builder()
                .success(true)
                .message("Disease fetched successfully")
                .data(diseaseService.getDiseaseById(id))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteDisease(
            @PathVariable String id) {

        diseaseService.deleteDisease(id);

        return ApiResponse.<String>builder()
                .success(true)
                .message("Disease deleted successfully")
                .data("Deleted")
                .build();
    }
}