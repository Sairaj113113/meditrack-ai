package com.meditrack.report;

import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WeeklyReportDTO {

    private LocalDate startDate;
    private LocalDate endDate;
    private Double weeklyAdherencePercentage;
    private Integer totalTaken;
    private Integer totalMissed;
    private Integer totalSkipped;
    private Integer currentStreak;
    private String bestDay;
    private List<DailyBreakdownDTO> dailyBreakdown;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyBreakdownDTO {
        private LocalDate date;
        private Double adherencePercentage;
        private Integer takenCount;
        private Integer missedCount;
        private Integer skippedCount;
    }
}