package com.meditrack.report;

import com.meditrack.adherence.AdherenceStreak;
import com.meditrack.adherence.DailyAdherence;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ReportMapper {

    public WeeklyReportDTO toWeeklyReport(List<DailyAdherence> records, AdherenceStreak streak) {
        int totalTaken = records.stream().mapToInt(DailyAdherence::getTakenCount).sum();
        int totalMissed = records.stream().mapToInt(DailyAdherence::getMissedCount).sum();
        int totalSkipped = records.stream().mapToInt(DailyAdherence::getSkippedCount).sum();

        double avgAdherence = records.stream()
                .mapToDouble(DailyAdherence::getAdherencePercentage)
                .average().orElse(0.0);

        String bestDay = records.stream()
                .max(Comparator.comparingDouble(DailyAdherence::getAdherencePercentage))
                .map(d -> d.getDate().getDayOfWeek().toString())
                .orElse("N/A");

        List<WeeklyReportDTO.DailyBreakdownDTO> breakdown = records.stream()
                .map(d -> WeeklyReportDTO.DailyBreakdownDTO.builder()
                        .date(d.getDate())
                        .adherencePercentage(d.getAdherencePercentage())
                        .takenCount(d.getTakenCount())
                        .missedCount(d.getMissedCount())
                        .skippedCount(d.getSkippedCount())
                        .build())
                .collect(Collectors.toList());

        return WeeklyReportDTO.builder()
                .startDate(records.isEmpty() ? null : records.get(0).getDate())
                .endDate(records.isEmpty() ? null : records.get(records.size() - 1).getDate())
                .weeklyAdherencePercentage(avgAdherence)
                .totalTaken(totalTaken)
                .totalMissed(totalMissed)
                .totalSkipped(totalSkipped)
                .currentStreak(streak != null ? streak.getCurrentStreak() : 0)
                .bestDay(bestDay)
                .dailyBreakdown(breakdown)
                .build();
    }

    public MonthlyReportDTO toMonthlyReport(List<DailyAdherence> records,
                                             AdherenceStreak streak,
                                             int year, int month) {
        int totalTaken = records.stream().mapToInt(DailyAdherence::getTakenCount).sum();
        int totalMissed = records.stream().mapToInt(DailyAdherence::getMissedCount).sum();
        int totalSkipped = records.stream().mapToInt(DailyAdherence::getSkippedCount).sum();
        int totalNoData = (int) records.stream()
                .filter(d -> d.getTotalMedicines() == 0).count();

        double avgAdherence = records.stream()
                .mapToDouble(DailyAdherence::getAdherencePercentage)
                .average().orElse(0.0);

        // Group by week number
        var weeklyGroups = records.stream()
                .collect(Collectors.groupingBy(d ->
                        d.getDate().get(java.time.temporal.WeekFields.ISO.weekOfMonth())));

        List<MonthlyReportDTO.WeeklySummaryDTO> weeklySummary = weeklyGroups.entrySet().stream()
                .map(e -> MonthlyReportDTO.WeeklySummaryDTO.builder()
                        .weekNumber(e.getKey())
                        .adherencePercentage(e.getValue().stream()
                                .mapToDouble(DailyAdherence::getAdherencePercentage)
                                .average().orElse(0.0))
                        .build())
                .sorted(Comparator.comparingInt(MonthlyReportDTO.WeeklySummaryDTO::getWeekNumber))
                .collect(Collectors.toList());

        List<String> insights = generateInsights(avgAdherence, totalMissed, totalSkipped);

        return MonthlyReportDTO.builder()
                .year(year)
                .month(month)
                .monthlyAdherencePercentage(avgAdherence)
                .totalTaken(totalTaken)
                .totalMissed(totalMissed)
                .totalSkipped(totalSkipped)
                .totalNoData(totalNoData)
                .bestStreak(streak != null ? streak.getBestStreak() : 0)
                .weeklySummary(weeklySummary)
                .insights(insights)
                .build();
    }

    private List<String> generateInsights(double avgAdherence, int missed, int skipped) {
        List<String> insights = new java.util.ArrayList<>();
        if (avgAdherence >= 90) {
            insights.add("Excellent adherence this month! Keep it up.");
        } else if (avgAdherence >= 70) {
            insights.add("Good adherence, but there's room for improvement.");
        } else {
            insights.add("Adherence is low. Consider setting more reminders.");
        }
        if (missed > 5) {
            insights.add("You missed " + missed + " doses this month. Try the ALARM reminder mode.");
        }
        if (skipped > 5) {
            insights.add("You skipped " + skipped + " doses. Consult your doctor if side effects are a concern.");
        }
        return insights;
    }
}