package com.meditrack.dashboard;

import com.meditrack.adherence.AdherenceStreak;
import com.meditrack.adherence.AdherenceStreakRepository;
import com.meditrack.adherence.DailyAdherence;
import com.meditrack.adherence.DailyAdherenceRepository;
import com.meditrack.disease.UserDiseaseRepository;
import com.meditrack.enums.DiseaseStatus;
import com.meditrack.enums.MedicineStatus;
import com.meditrack.medicine.Medicine;
import com.meditrack.medicine.MedicineRepository;
import com.meditrack.medicine.MedicineScheduleRepository;
import com.meditrack.user.User;
import com.meditrack.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import com.meditrack.medicine.MedicineScheduleEvaluator;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final DailyAdherenceRepository dailyAdherenceRepository;
    private final AdherenceStreakRepository streakRepository;
    private final MedicineRepository medicineRepository;
    private final MedicineScheduleRepository scheduleRepository;
    private final UserDiseaseRepository userDiseaseRepository;
    private final MedicineScheduleEvaluator scheduleEvaluator;

    public DashboardDTO getDashboard(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate today = LocalDate.now();

        DailyAdherence adherence = dailyAdherenceRepository
                .findByUserIdAndDate(userId, today)
                .orElseGet(() -> DailyAdherence.builder()
                        .userId(userId)
                        .date(today)
                        .build());

        AdherenceStreak streak = streakRepository.findByUserId(userId)
                .orElseGet(() -> AdherenceStreak.builder()
                        .userId(userId)
                        .build());

      List<Medicine> activeMedicines = medicineRepository
        .findByUserIdAndStatusAndIsDeletedFalseOrderByCreatedAtDesc(
                userId,
                MedicineStatus.ACTIVE
        )
        .stream()
        .filter(m ->
                m.getStartDate() != null &&
                !m.getStartDate().isAfter(today) &&
                (
                        m.getEndDate() == null ||
                        !m.getEndDate().isBefore(today)
                )
        )
        .toList();
      List<DashboardDTO.TodayMedicineDTO> todayMedicines = activeMedicines.stream()
        .flatMap(m -> scheduleRepository
                .findByUserMedicineIdAndIsDeletedFalse(m.getId())
                .stream()
                .filter(s ->
                        scheduleEvaluator.isDueToday(
                                m,
                                s,
                                today
                        )
                )
                .map(s -> DashboardDTO.TodayMedicineDTO.builder()
                        .medicineId(m.getId())
                        .medicineName(m.getMedicineName())
                        .scheduledTime(s.getScheduleTime().toString())
                        .status("PENDING")
                        .build()))
        .collect(Collectors.toList());

        long activeDiseases = userDiseaseRepository
                .findByUserIdAndIsDeletedFalse(userId)
                .stream()
                .filter(d -> d.getStatus() == DiseaseStatus.ACTIVE)
                .count();

        int totalMedicines = todayMedicines.size();

int pending = totalMedicines
        - adherence.getTakenCount()
        - adherence.getMissedCount()
        - adherence.getSkippedCount();

        return DashboardDTO.builder()
                .userName(user.getFirstName() + " " + user.getLastName())
               .todayAdherencePercentage(
        totalMedicines == 0
                ? 0.0
                : ((double) adherence.getTakenCount() / totalMedicines) * 100
)
                .takenCount(adherence.getTakenCount())
                .missedCount(adherence.getMissedCount())
                .pendingCount(Math.max(pending, 0))
                .skippedCount(adherence.getSkippedCount())
                
                .currentStreak(streak.getCurrentStreak())
                .bestStreak(streak.getBestStreak())
                .totalMedicines(totalMedicines)
                .activeDiseasesCount((int) activeDiseases)
                .build();
    }
}