package com.meditrack.dashboard;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {

    private String userName;
    private Double todayAdherencePercentage;
    private Integer takenCount;
    private Integer missedCount;
    private Integer pendingCount;
    private Integer totalMedicines;
    private Integer currentStreak;
    private Integer bestStreak;
    private List<TodayMedicineDTO> todayMedicines;
    private Integer activeDiseasesCount;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TodayMedicineDTO {
        private String medicineId;
        private String medicineName;
        private String scheduledTime;
        private String status;
    }
}