package com.meditrack.adherence;

import com.meditrack.enums.IntakeAction;
import com.meditrack.enums.MedicineStatus;
import com.meditrack.medicine.Medicine;
import com.meditrack.medicine.MedicineRepository;
import com.meditrack.medicine.MedicineSchedule;
import com.meditrack.medicine.MedicineScheduleEvaluator;
import com.meditrack.medicine.MedicineScheduleRepository;
import com.meditrack.tracking.MedicineIntakeLog;
import com.meditrack.tracking.MedicineIntakeLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdherenceCalculationService {

    private final MedicineRepository medicineRepository;
    private final MedicineScheduleRepository scheduleRepository;
    private final MedicineIntakeLogRepository intakeLogRepository;
    private final DailyAdherenceRepository dailyAdherenceRepository;
    private final AdherenceStreakRepository streakRepository;
    private final MedicineScheduleEvaluator scheduleEvaluator;

    /**
     * SINGLE SOURCE OF TRUTH recalculation.
     * Called after every: TAKEN, MISSED, SKIPPED, ARCHIVE, DELETE, UNARCHIVE
     */
    @Transactional
    public void recalculate(String userId, LocalDate date) {
        // Step 1: Get all active medicines for this user
        List<Medicine> activeMedicines = medicineRepository
                .findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(userId)
                .stream()
                .filter(m -> m.getStatus() == MedicineStatus.ACTIVE)
                .filter(m -> m.getStartDate() != null)
.filter(m -> !m.getStartDate().isAfter(date))
                .filter(m -> m.getEndDate() == null || !m.getEndDate().isBefore(date))
                .toList();

        // Step 2: Count total active schedules for today
        int totalSchedules = 0;
        for (Medicine med : activeMedicines) {

    List<MedicineSchedule> schedules =
            scheduleRepository.findByUserMedicineIdAndIsDeletedFalse(
                    med.getId()
            );

    totalSchedules += (int) schedules.stream()
            .filter(s -> Boolean.TRUE.equals(s.getIsActive()))
            .filter(s ->
                    scheduleEvaluator.isDueToday(
                            med,
                            s,
                            date
                    )
            )
            .count();
}

        // Step 3: Get today's intake logs
     Set<String> activeMedicineIds = activeMedicines.stream()
        .map(Medicine::getId)
        .collect(Collectors.toSet());

List<MedicineIntakeLog> logs = intakeLogRepository
        .findByUserIdAndIntakeDate(userId, date)
        .stream()
        .filter(log -> !Boolean.TRUE.equals(log.getIsDeleted()))
        .filter(log -> activeMedicineIds.contains(log.getUserMedicineId()))
        .toList();

        // Step 4: For each schedule slot, determine ONE status
        // Key: medicineId + scheduledTime → last action wins
        Map<String, IntakeAction> slotStatus = new LinkedHashMap<>();
        for (MedicineIntakeLog log : logs) {
            String key = log.getUserMedicineId() + "_" +
                    (log.getScheduledTime() != null ? log.getScheduledTime().toString() : "any");
            slotStatus.put(key, log.getAction());
        }

        // Step 5: Count from slot states
        int taken = 0, missed = 0, skipped = 0;
        for (IntakeAction action : slotStatus.values()) {
            switch (action) {
                case TAKEN -> taken++;
                case MISSED -> missed++;
                case SKIPPED -> skipped++;
                default -> {}
            }
        }

        // Step 6: Total must be max of (schedules, logged actions)
      int total = totalSchedules;
        int pending = Math.max(total - taken - missed - skipped, 0);
        double percentage = total == 0 ? 0.0 :
                Math.min((taken * 100.0) / total, 100.0);

        // Step 7: Save to daily_adherence
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

        // Step 8: Update streak
        updateStreak(userId, date, percentage);
    }

    private void updateStreak(String userId, LocalDate date, double percentage) {
        AdherenceStreak streak = streakRepository.findByUserId(userId)
                .orElseGet(() -> AdherenceStreak.builder().userId(userId).build());

        if (percentage >= 100.0) {
            if (streak.getLastUpdatedDate() != null &&
                    streak.getLastUpdatedDate().equals(date.minusDays(1))) {
                streak.setCurrentStreak(streak.getCurrentStreak() + 1);
            } else if (streak.getLastUpdatedDate() == null ||
                    !streak.getLastUpdatedDate().equals(date)) {
                streak.setCurrentStreak(1);
            }
            if (streak.getCurrentStreak() > streak.getBestStreak()) {
                streak.setBestStreak(streak.getCurrentStreak());
            }
        } else {
            if (streak.getLastUpdatedDate() == null ||
                    !streak.getLastUpdatedDate().equals(date)) {
                streak.setCurrentStreak(0);
            }
        }
        streak.setLastUpdatedDate(date);
        streakRepository.save(streak);
    }
}