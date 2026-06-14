package com.meditrack.reminder;

import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class ReminderMapper {

    public ReminderResponseDTO toResponseDTO(ReminderSession session) {

        return ReminderResponseDTO.builder()
                .sessionId(session.getId())
                .sessionTime(session.getSessionTime())
                .medicineCount(session.getMedicineCount())
                .status(session.getStatus())
                .completedAt(session.getCompletedAt())
                .medicines(
                        session.getMedicines()
                                .stream()
                                .map(this::toMedicineDTO)
                                .collect(Collectors.toList())
                )
                .build();
    }

    private ReminderResponseDTO.ReminderMedicineDTO toMedicineDTO(
            ReminderSessionMedicine medicine
    ) {

        return ReminderResponseDTO.ReminderMedicineDTO.builder()
                .userMedicineId(
                        medicine.getUserMedicine().getId()
                )
                .medicineName(
                        medicine.getUserMedicine().getMedicineId()
                )
                .dosage(
                        medicine.getUserMedicine().getDosage()
                )
                .status(
                        medicine.getStatus().name()
                )
                .build();
    }
}