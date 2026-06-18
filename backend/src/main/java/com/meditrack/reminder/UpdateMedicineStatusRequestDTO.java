package com.meditrack.reminder;

import com.meditrack.enums.ReminderMedicineStatus;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateMedicineStatusRequestDTO {
    private ReminderMedicineStatus status;
    private String notes;
    private Integer snoozeMinutes;
}