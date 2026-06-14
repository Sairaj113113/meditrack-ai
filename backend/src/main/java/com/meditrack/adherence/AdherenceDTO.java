package com.meditrack.adherence;

import lombok.*;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdherenceDTO {

    private LocalDate date;
    private Integer totalMedicines;
    private Integer takenCount;
    private Integer missedCount;
    private Integer skippedCount;
    private Double adherencePercentage;
    private Integer currentStreak;
    private Integer bestStreak;
}