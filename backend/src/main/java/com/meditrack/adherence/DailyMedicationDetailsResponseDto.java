package com.meditrack.adherence;

import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyMedicationDetailsResponseDto {

    private LocalDate date;
    private Integer totalMedicines;
    private Integer takenCount;
    private Integer missedCount;
    private Integer skippedCount;
    private Integer pendingCount;
    private Double adherencePercentage;
    private List<DailyMedicineLogDto> medicineTimeline;
}