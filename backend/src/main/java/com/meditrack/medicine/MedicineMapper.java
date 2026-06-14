package com.meditrack.medicine;

import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class MedicineMapper {

    public MedicineResponseDTO toResponse(Medicine medicine, List<MedicineSchedule> schedules) {
        return MedicineResponseDTO.builder()
                .id(medicine.getId())
                .userId(medicine.getUserId())
                .userDiseaseId(medicine.getUserDiseaseId())
                .medicineName(medicine.getMedicineName())
                .medicineCategory(medicine.getMedicineCategory())
                .medicineType(medicine.getMedicineType())
                .frequencyType(medicine.getFrequencyType())
                .intakeInstruction(medicine.getIntakeInstruction())
                .startDate(medicine.getStartDate())
                .endDate(medicine.getEndDate())
                .status(medicine.getStatus())
                .notes(medicine.getNotes())
                .schedules(schedules.stream()
                        .map(this::toScheduleResponse)
                        .collect(Collectors.toList()))
                .build();
    }

    public MedicineResponseDTO.ScheduleResponseDTO toScheduleResponse(MedicineSchedule s) {
        return MedicineResponseDTO.ScheduleResponseDTO.builder()
                .id(s.getId())
                .scheduleTime(s.getScheduleTime().toString())
                .scheduleType(s.getScheduleType())
                .dayOfWeek(s.getDayOfWeek())
                .intervalHours(s.getIntervalHours())
                .isActive(s.getIsActive())
                .build();
    }
}