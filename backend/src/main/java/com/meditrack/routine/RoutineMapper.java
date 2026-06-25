package com.meditrack.routine;

import java.util.List;
import java.util.stream.Collectors;

public class RoutineMapper {

    private RoutineMapper() {
    }

    public static RoutineGroup toEntity(CreateRoutineDTO dto, String userId) {

        return RoutineGroup.builder()
                .userId(userId)
                .userDiseaseId(dto.getUserDiseaseId())
                .routineName(dto.getRoutineName())
                .routineTime(dto.getRoutineTime())
                .frequencyType(dto.getFrequencyType())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .isReminderEnabled(dto.getIsReminderEnabled())
                .build();
    }

    public static RoutineResponseDTO toResponse(
        RoutineGroup entity,
          String diseaseName,
        Integer medicineCount
    ) {

        return RoutineResponseDTO.builder()
                .id(entity.getId())
                .routineName(entity.getRoutineName())
                .userDiseaseId(entity.getUserDiseaseId())
                .routineTime(entity.getRoutineTime())
                .frequencyType(entity.getFrequencyType())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .isReminderEnabled(entity.getIsReminderEnabled())
                .status(entity.getStatus())                
                .medicineCount(medicineCount)  
                .diseaseName(diseaseName)
                .build();
    }

    public static RoutineDetailsDTO toDetails(
            RoutineGroup entity,
            List<RoutineGroupDay> days
    ) {

        return RoutineDetailsDTO.builder()
                .id(entity.getId())
                .routineName(entity.getRoutineName())
                .userDiseaseId(entity.getUserDiseaseId())
                .routineTime(entity.getRoutineTime())
                .frequencyType(entity.getFrequencyType())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .isReminderEnabled(entity.getIsReminderEnabled())
                .status(entity.getStatus())
                .days(
                        days.stream()
                                .map(RoutineGroupDay::getDayOfWeek)
                                .collect(Collectors.toList())
                )
                .build();
    }
}