package com.meditrack.adherence;

import org.springframework.stereotype.Component;

@Component
public class AdherenceMapper {

    public AdherenceDTO toDTO(DailyAdherence adherence, AdherenceStreak streak) {
        return AdherenceDTO.builder()
                .date(adherence.getDate())
                .totalMedicines(adherence.getTotalMedicines())
                .takenCount(adherence.getTakenCount())
                .missedCount(adherence.getMissedCount())
                .skippedCount(adherence.getSkippedCount())
                .adherencePercentage(adherence.getAdherencePercentage())
                .currentStreak(streak != null ? streak.getCurrentStreak() : 0)
                .bestStreak(streak != null ? streak.getBestStreak() : 0)
                .build();
    }

    public String getCalendarStatus(DailyAdherence adherence) {
        if (adherence == null || adherence.getTotalMedicines() == 0) {
            return "NO_DATA";
        }
        double percentage = adherence.getAdherencePercentage();
        if (percentage >= 100) return "ALL_TAKEN";
        if (percentage > 0) return "PARTIAL";
        return "MISSED";
    }
}