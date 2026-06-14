package com.meditrack.report;

import lombok.*;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyReportDTO {

    private LocalDate date;
    private Double adherencePercentage;
    private Integer takenCount;
    private Integer missedCount;
    private Integer skippedCount;
    private Integer totalMedicines;
}