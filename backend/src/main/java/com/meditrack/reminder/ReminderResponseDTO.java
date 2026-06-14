package com.meditrack.reminder;

import com.meditrack.enums.ReminderStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReminderResponseDTO {

    private String sessionId;

    private LocalDateTime sessionTime;

    private Integer medicineCount;

    private ReminderStatus status;

    private LocalDateTime completedAt;

    private List<ReminderMedicineDTO> medicines;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ReminderMedicineDTO {

        private String userMedicineId;

        private String medicineName;

        private String dosage;

        private String status;
    }
}