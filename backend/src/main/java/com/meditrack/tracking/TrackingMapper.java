package com.meditrack.tracking;

import org.springframework.stereotype.Component;

@Component
public class TrackingMapper {

    public MedicineLogDTO toDTO(MedicineIntakeLog log) {
        return MedicineLogDTO.builder()
                .id(log.getId())
                .userMedicineId(log.getUserMedicineId())
                .intakeDate(log.getIntakeDate())
                .scheduledTime(log.getScheduledTime())
                .action(log.getAction())
                .markedBy(log.getMarkedBy())
                .actionTime(log.getActionTime())
                .build();
    }
}