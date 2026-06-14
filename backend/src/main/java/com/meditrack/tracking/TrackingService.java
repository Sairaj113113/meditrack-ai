package com.meditrack.tracking;

import com.meditrack.adherence.AdherenceStreak;
import com.meditrack.adherence.AdherenceStreakRepository;
import com.meditrack.adherence.DailyAdherence;
import com.meditrack.adherence.DailyAdherenceRepository;
import com.meditrack.enums.IntakeAction;
import com.meditrack.enums.MarkedBy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrackingService {

    private final MedicineIntakeLogRepository intakeLogRepository;
    private final DailyAdherenceRepository dailyAdherenceRepository;
    private final AdherenceStreakRepository streakRepository;
    private final TrackingMapper trackingMapper;

    @Transactional
    public MedicineLogDTO logIntake(String userId, MedicineLogDTO dto) {
        MedicineIntakeLog log = MedicineIntakeLog.builder()
                .userId(userId)
                .userMedicineId(dto.getUserMedicineId())
                .intakeDate(dto.getIntakeDate() != null ? dto.getIntakeDate() : LocalDate.now())
                .scheduledTime(dto.getScheduledTime())
                .action(dto.getAction())
                .markedBy(dto.getMarkedBy() != null ? dto.getMarkedBy() : MarkedBy.USER)
                .actionTime(LocalDateTime.now())
                .build();

        intakeLogRepository.save(log);

        updateDailyAdherence(userId, log.getIntakeDate());

        return trackingMapper.toDTO(log);
    }

    public List<MedicineLogDTO> getLogsForDate(String userId, LocalDate date) {
        return intakeLogRepository.findByUserIdAndIntakeDate(userId, date)
                .stream()
                .map(trackingMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    private void updateDailyAdherence(String userId, LocalDate date) {
        List<MedicineIntakeLog> logs = intakeLogRepository.findByUserIdAndIntakeDate(userId, date);

        int taken = (int) logs.stream().filter(l -> l.getAction() == IntakeAction.TAKEN).count();
        int missed = (int) logs.stream().filter(l -> l.getAction() == IntakeAction.MISSED).count();
        int skipped = (int) logs.stream().filter(l -> l.getAction() == IntakeAction.SKIPPED).count();
        int total = logs.size();

        double percentage = total > 0 ? (taken * 100.0 / total) : 0.0;

        DailyAdherence adherence = dailyAdherenceRepository
                .findByUserIdAndDate(userId, date)
                .orElseGet(() -> DailyAdherence.builder()
                        .userId(userId)
                        .date(date)
                        .build());

        adherence.setTotalMedicines(total);
        adherence.setTakenCount(taken);
        adherence.setMissedCount(missed);
        adherence.setSkippedCount(skipped);
        adherence.setAdherencePercentage(percentage);

        dailyAdherenceRepository.save(adherence);

        updateStreak(userId, date, percentage);
    }

    private void updateStreak(String userId, LocalDate date, double percentage) {
        AdherenceStreak streak = streakRepository.findByUserId(userId)
                .orElseGet(() -> AdherenceStreak.builder()
                        .userId(userId)
                        .build());

        if (percentage >= 100) {
            if (streak.getLastUpdatedDate() != null
                    && streak.getLastUpdatedDate().equals(date.minusDays(1))) {
                streak.setCurrentStreak(streak.getCurrentStreak() + 1);
            } else if (streak.getLastUpdatedDate() == null
                    || !streak.getLastUpdatedDate().equals(date)) {
                streak.setCurrentStreak(1);
            }

            if (streak.getCurrentStreak() > streak.getBestStreak()) {
                streak.setBestStreak(streak.getCurrentStreak());
            }
            streak.setLastUpdatedDate(date);
        } else {
            streak.setCurrentStreak(0);
            streak.setLastUpdatedDate(date);
        }

        streakRepository.save(streak);
    }
}