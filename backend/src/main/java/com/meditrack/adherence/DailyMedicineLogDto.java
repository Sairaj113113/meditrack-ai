package com.meditrack.adherence;

import com.meditrack.enums.IntakeAction;
import com.meditrack.enums.MarkedBy;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyMedicineLogDto {

    private String medicineId;
    private String medicineName;
    private String scheduledTime;
    private IntakeAction action;
    private MarkedBy markedBy;
    private LocalDateTime actionTime;
}