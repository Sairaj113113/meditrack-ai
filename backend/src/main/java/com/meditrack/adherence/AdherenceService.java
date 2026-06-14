package com.meditrack.adherence;

import com.meditrack.tracking.MedicineIntakeLog;
import com.meditrack.tracking.MedicineIntakeLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdherenceService {

    private final DailyAdherenceRepository dailyAdherenceRepository;
    private final AdherenceStreakRepository streakRepository;
    private final AdherenceMapper adherenceMapper;
    private final MedicineIntakeLogRepository intakeLogRepository;

    public AdherenceDTO getDailyAdherence(String userId, LocalDate date) {
        DailyAdherence adherence = dailyAdherenceRepository
                .findByUserIdAndDate(userId, date)
                .orElseGet(() -> DailyAdherence.builder()
                        .userId(userId)
                        .date(date)
                        .build());

        AdherenceStreak streak = streakRepository.findByUserId(userId).orElse(null);

        return adherenceMapper.toDTO(adherence, streak);
    }

    public List<AdherenceDTO> getWeeklyAdherence(String userId) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(6);

        List<DailyAdherence> records = dailyAdherenceRepository
                .findByUserIdAndDateBetweenOrderByDateAsc(userId, startDate, endDate);

        AdherenceStreak streak = streakRepository.findByUserId(userId).orElse(null);

        return records.stream()
                .map(a -> adherenceMapper.toDTO(a, streak))
                .collect(Collectors.toList());
    }

    public List<AdherenceDTO> getMonthlyAdherence(String userId, int year, int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        List<DailyAdherence> records = dailyAdherenceRepository
                .findByUserIdAndDateBetweenOrderByDateAsc(userId, startDate, endDate);

        AdherenceStreak streak = streakRepository.findByUserId(userId).orElse(null);

        return records.stream()
                .map(a -> adherenceMapper.toDTO(a, streak))
                .collect(Collectors.toList());
    }

    public AdherenceDTO getStreak(String userId) {
        AdherenceStreak streak = streakRepository.findByUserId(userId)
                .orElseGet(() -> AdherenceStreak.builder()
                        .userId(userId)
                        .build());

        DailyAdherence today = dailyAdherenceRepository
                .findByUserIdAndDate(userId, LocalDate.now())
                .orElseGet(() -> DailyAdherence.builder()
                        .userId(userId)
                        .date(LocalDate.now())
                        .build());

        return adherenceMapper.toDTO(today, streak);
    }

    public MedicationCalendarResponseDto getCalendar(String userId, int year, int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        List<DailyAdherence> records = dailyAdherenceRepository
                .findByUserIdAndDateBetweenOrderByDateAsc(userId, startDate, endDate);

        List<CalendarDayDto> days = records.stream()
                .map(a -> CalendarDayDto.builder()
                        .date(a.getDate())
                        .status(adherenceMapper.getCalendarStatus(a))
                        .adherencePercentage(a.getAdherencePercentage())
                        .build())
                .collect(Collectors.toList());

        return MedicationCalendarResponseDto.builder()
                .year(year)
                .month(month)
                .days(days)
                .build();
    }

    public DailyMedicationDetailsResponseDto getDailyDetails(String userId, LocalDate date) {
        DailyAdherence adherence = dailyAdherenceRepository
                .findByUserIdAndDate(userId, date)
                .orElseGet(() -> DailyAdherence.builder()
                        .userId(userId)
                        .date(date)
                        .build());

        List<MedicineIntakeLog> logs = intakeLogRepository
                .findByUserIdAndIntakeDate(userId, date);

        List<DailyMedicineLogDto> timeline = logs.stream()
                .map(log -> DailyMedicineLogDto.builder()
                        .medicineId(log.getUserMedicineId())
                        .scheduledTime(log.getScheduledTime() != null
                                ? log.getScheduledTime().toString() : null)
                        .action(log.getAction())
                        .markedBy(log.getMarkedBy())
                        .actionTime(log.getActionTime())
                        .build())
                .collect(Collectors.toList());

        int pending = adherence.getTotalMedicines()
                - adherence.getTakenCount()
                - adherence.getMissedCount()
                - adherence.getSkippedCount();

        return DailyMedicationDetailsResponseDto.builder()
                .date(date)
                .totalMedicines(adherence.getTotalMedicines())
                .takenCount(adherence.getTakenCount())
                .missedCount(adherence.getMissedCount())
                .skippedCount(adherence.getSkippedCount())
                .pendingCount(Math.max(pending, 0))
                .adherencePercentage(adherence.getAdherencePercentage())
                .medicineTimeline(timeline)
                .build();
    }
}