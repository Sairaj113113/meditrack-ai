package com.meditrack.tracking;

import com.meditrack.enums.IntakeAction;
import com.meditrack.enums.MarkedBy;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicineLogDTO {

    private String id;
    private String userMedicineId;
    private LocalDate intakeDate;
    private LocalTime scheduledTime;

    @NotNull(message = "Action is required")
    private IntakeAction action;

    private MarkedBy markedBy;
    private LocalDateTime actionTime;
}