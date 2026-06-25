package com.meditrack.routine;

import com.meditrack.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.meditrack.user.User;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

@RestController
@RequestMapping("/api/routines")
@RequiredArgsConstructor
public class RoutineController {

    private final RoutineService routineService;

   @PostMapping
public ApiResponse<RoutineResponseDTO> createRoutine(
        @AuthenticationPrincipal User user,
        @RequestBody CreateRoutineDTO request
){

        return ApiResponse.success(
               routineService.createRoutine(
        request,
        user.getId()
)
        );
    }

   @GetMapping
public ApiResponse<List<RoutineResponseDTO>> getAllRoutines(
        @AuthenticationPrincipal User user
) {

    return ApiResponse.success(
            routineService.getAllRoutines(
                    user.getId()
            )
    );
}

@GetMapping("/diseases")
public ApiResponse<List<DiseaseRoutineDTO>> getRoutineDiseases(
        @AuthenticationPrincipal User user
) {

    return ApiResponse.success(
            routineService.getRoutineDiseases(
                    user.getId()
            )
    );
}

@GetMapping("/disease/{diseaseId}")
public ApiResponse<List<RoutineByDiseaseDTO>>
getRoutinesByDisease(
        @PathVariable String diseaseId
) {

    return ApiResponse.success(
            routineService.getRoutinesByDisease(
                    diseaseId
            )
    );
}

    @GetMapping("/{id}")
    public ApiResponse<RoutineDetailsDTO> getRoutineById(
            @PathVariable String id
    ) {

        return ApiResponse.success(
                routineService.getRoutineById(id)
        );
    }

    @PutMapping("/{id}")
    public ApiResponse<RoutineResponseDTO> updateRoutine(
            @PathVariable String id,
            @RequestBody UpdateRoutineDTO request
    ) {

        return ApiResponse.success(
                routineService.updateRoutine(
                        id,
                        request
                )
        );
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteRoutine(
            @PathVariable String id
    ) {

        routineService.deleteRoutine(id);

        return ApiResponse.success(
                "Routine deleted successfully"
        );
    }

    @PostMapping("/{id}/medicines")
public ApiResponse<RoutineMedicineDTO> addMedicine(
        @PathVariable String id,
        @RequestBody AddRoutineMedicineDTO request
) {

    return ApiResponse.success(
            routineService.addMedicine(
                    id,
                    request
            )
    );
}

@GetMapping("/{id}/medicines")
public ApiResponse<List<RoutineMedicineDTO>> getRoutineMedicines(
        @PathVariable String id
) {

    return ApiResponse.success(
            routineService.getRoutineMedicines(id)
    );
}

@DeleteMapping("/{routineId}/medicines/{medicineId}")
public ApiResponse<String> removeMedicine(
        @PathVariable String routineId,
        @PathVariable String medicineId
) {

    routineService.removeMedicine(
            routineId,
            medicineId
    );

    return ApiResponse.success(
            "Medicine removed successfully"
    );
}

@PutMapping("/medicines/{medicineId}")
public ApiResponse<RoutineMedicineDTO>
updateMedicine(
        @PathVariable String medicineId,
        @RequestBody UpdateRoutineMedicineDTO request
) {

    return ApiResponse.success(
            routineService.updateMedicine(
                    medicineId,
                    request
            )
    );
}
@PostMapping("/{id}/archive")
public ApiResponse<String> archiveRoutine(
        @PathVariable String id
) {

    routineService.archiveRoutine(id);

    return ApiResponse.success(
            "Routine archived successfully"
    );
}
@PostMapping("/{id}/unarchive")
public ApiResponse<String> unarchiveRoutine(
        @PathVariable String id
) {

    routineService.unarchiveRoutine(id);

    return ApiResponse.success(
            "Routine unarchived successfully"
    );
}
@PostMapping("/{id}/pause")
public ApiResponse<String> pauseRoutine(
        @PathVariable String id
) {

    routineService.pauseRoutine(id);

    return ApiResponse.success(
            "Routine paused successfully"
    );
}
@PostMapping("/{id}/resume")
public ApiResponse<String> resumeRoutine(
        @PathVariable String id
) {

    routineService.resumeRoutine(id);

    return ApiResponse.success(
            "Routine resumed successfully"
    );
}
@GetMapping("/archived")
public ApiResponse<List<RoutineResponseDTO>>
getArchivedRoutines(
        @AuthenticationPrincipal User user
) {

    return ApiResponse.success(
            routineService.getArchivedRoutines(
                    user.getId()
            )
    );
}
}