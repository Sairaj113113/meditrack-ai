package com.meditrack.report;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyReportDTO {

    private Integer year;
    private Integer month;
    private Double monthlyAdherencePercentage;
    private Integer totalTaken;
    private Integer totalMissed;
    private Integer totalSkipped;
    private Integer totalNoData;
    private Integer bestStreak;
    private List<WeeklySummaryDTO> weeklySummary;
    private List<String> insights;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WeeklySummaryDTO {
        private Integer weekNumber;
        private Double adherencePercentage;
    }
}