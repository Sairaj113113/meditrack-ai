package com.meditrack.routine;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoutineService {

    private final MedicineRoutineRepository routineRepository;
    private final RoutineMedicineRepository routineMedicineRepository;
    private final RoutineMapper routineMapper;

    public RoutineResponseDTO createRoutine(String userId, CreateRoutineDTO dto) {
        MedicineRoutine routine = MedicineRoutine.builder()
                .userId(userId)
                .userDiseaseId(dto.getUserDiseaseId())
                .routineName(dto.getRoutineName())
                .routineTime(dto.getRoutineTime())
                .repeatCount(dto.getRepeatCount() != null ? dto.getRepeatCount() : 1)
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .reminderTone(dto.getReminderTone())
                .build();

        routineRepository.save(routine);
        return routineMapper.toCreateResponse(routine);
    }

    public List<RoutineResponseDTO> getRoutines(String userId) {
        return routineRepository.findByUserIdAndIsDeletedFalse(userId)
                .stream()
                .map(routineMapper::toListItem)
                .collect(Collectors.toList());
    }

    public RoutineDetailsDTO getRoutineDetails(String userId, String routineId) {
        MedicineRoutine routine = routineRepository
                .findByIdAndUserIdAndIsDeletedFalse(routineId, userId)
                .orElseThrow(() -> new RuntimeException("Routine not found"));

        List<RoutineMedicine> medicines = routineMedicineRepository
                .findByRoutineIdAndIsDeletedFalse(routineId);

        return routineMapper.toDetailsDTO(routine, medicines);
    }

    @Transactional
    public void updateRoutine(String userId, String routineId, UpdateRoutineDTO dto) {
        MedicineRoutine routine = routineRepository
                .findByIdAndUserIdAndIsDeletedFalse(routineId, userId)
                .orElseThrow(() -> new RuntimeException("Routine not found"));

        if (dto.getRoutineName() != null) routine.setRoutineName(dto.getRoutineName());
        if (dto.getRoutineTime() != null) routine.setRoutineTime(dto.getRoutineTime());
        if (dto.getRepeatCount() != null) routine.setRepeatCount(dto.getRepeatCount());
        if (dto.getStartDate() != null) routine.setStartDate(dto.getStartDate());
        if (dto.getEndDate() != null) routine.setEndDate(dto.getEndDate());
        if (dto.getReminderTone() != null) routine.setReminderTone(dto.getReminderTone());

        routineRepository.save(routine);
    }

    public void deleteRoutine(String userId, String routineId) {
        MedicineRoutine routine = routineRepository
                .findByIdAndUserIdAndIsDeletedFalse(routineId, userId)
                .orElseThrow(() -> new RuntimeException("Routine not found"));
        routine.setIsDeleted(true);
        routineRepository.save(routine);
    }

    public void addMedicineToRoutine(String routineId, Map<String, String> body) {
        RoutineMedicine routineMedicine = RoutineMedicine.builder()
                .routineId(routineId)
                .userMedicineId(body.get("medicineId"))
                .dosage(body.get("dosage"))
                .build();
        routineMedicineRepository.save(routineMedicine);
    }

    public void removeMedicineFromRoutine(String routineId, String medicineId) {
        routineMedicineRepository.deleteByRoutineIdAndUserMedicineId(routineId, medicineId);
    }
}