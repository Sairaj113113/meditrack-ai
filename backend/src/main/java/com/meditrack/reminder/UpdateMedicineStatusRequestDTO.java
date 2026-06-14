package com.meditrack.reminder;

import com.meditrack.enums.ReminderMedicineStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateMedicineStatusRequestDTO {

    @NotNull(message = "Status is required")
    private ReminderMedicineStatus status;

    private String skipReason;

    private Integer minutes;
}