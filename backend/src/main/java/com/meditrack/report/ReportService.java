package com.meditrack.report;

import com.meditrack.adherence.AdherenceStreakRepository;
import com.meditrack.adherence.DailyAdherence;
import com.meditrack.adherence.DailyAdherenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final DailyAdherenceRepository dailyAdherenceRepository;
    private final AdherenceStreakRepository streakRepository;
    private final ReportMapper reportMapper;

    public WeeklyReportDTO getWeeklyReport(String userId) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(6);

        List<DailyAdherence> records = dailyAdherenceRepository
                .findByUserIdAndDateBetweenOrderByDateAsc(userId, startDate, endDate);

        var streak = streakRepository.findByUserId(userId).orElse(null);

        return reportMapper.toWeeklyReport(records, streak);
    }

    public MonthlyReportDTO getMonthlyReport(String userId, Integer year, Integer month) {
        YearMonth ym = (year != null && month != null)
                ? YearMonth.of(year, month) : YearMonth.now();

        LocalDate startDate = ym.atDay(1);
        LocalDate endDate = ym.atEndOfMonth();

        List<DailyAdherence> records = dailyAdherenceRepository
                .findByUserIdAndDateBetweenOrderByDateAsc(userId, startDate, endDate);

        var streak = streakRepository.findByUserId(userId).orElse(null);

        return reportMapper.toMonthlyReport(records, streak, ym.getYear(), ym.getMonthValue());
    }

    public byte[] generatePdfReport(String userId) {
        // TODO: implement actual PDF generation using PdfGeneratorService
        return "PDF generation not yet implemented".getBytes();
    }
}