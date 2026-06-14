package com.meditrack.routine;

import com.meditrack.medicine.Medicine;
import com.meditrack.medicine.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class RoutineMapper {

    private final MedicineRepository medicineRepository;

    public RoutineResponseDTO toCreateResponse(MedicineRoutine routine) {
        return RoutineResponseDTO.builder()
                .routineId(routine.getId())
                .routineName(routine.getRoutineName())
                .routineTime(routine.getRoutineTime().toString())
                .message("Routine created successfully")
                .build();
    }

    public RoutineResponseDTO toListItem(MedicineRoutine routine) {
        return RoutineResponseDTO.builder()
                .routineId(routine.getId())
                .routineName(routine.getRoutineName())
                .routineTime(routine.getRoutineTime().toString())
                .build();
    }

    public RoutineDetailsDTO toDetailsDTO(MedicineRoutine routine, List<RoutineMedicine> routineMedicines) {
        List<RoutineDetailsDTO.RoutineMedicineDTO> medicineDTOs = routineMedicines.stream()
                .map(rm -> {
                    String name = medicineRepository.findById(rm.getUserMedicineId())
                            .map(Medicine::getMedicineName)
                            .orElse("Unknown");
                    return RoutineDetailsDTO.RoutineMedicineDTO.builder()
                            .medicineId(rm.getUserMedicineId())
                            .medicineName(name)
                            .dosage(rm.getDosage())
                            .build();
                })
                .collect(Collectors.toList());

        return RoutineDetailsDTO.builder()
                .routineId(routine.getId())
                .routineName(routine.getRoutineName())
                .routineTime(routine.getRoutineTime().toString())
                .userDiseaseId(routine.getUserDiseaseId())
                .repeatCount(routine.getRepeatCount())
                .startDate(routine.getStartDate())
                .endDate(routine.getEndDate())
                .reminderTone(routine.getReminderTone())
                .medicines(medicineDTOs)
                .build();
    }
}