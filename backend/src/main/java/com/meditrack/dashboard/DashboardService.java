package com.meditrack.dashboard;

import com.meditrack.adherence.AdherenceStreak;
import com.meditrack.adherence.AdherenceStreakRepository;
import com.meditrack.adherence.DailyAdherence;
import com.meditrack.adherence.DailyAdherenceRepository;
import com.meditrack.disease.UserDiseaseRepository;
import com.meditrack.enums.DiseaseStatus;
import com.meditrack.enums.MedicineCategory;
import com.meditrack.medicine.Medicine;
import com.meditrack.medicine.MedicineRepository;
import com.meditrack.medicine.MedicineSchedule;
import com.meditrack.medicine.MedicineScheduleRepository;
import com.meditrack.user.User;
import com.meditrack.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final DailyAdherenceRepository dailyAdherenceRepository;
    private final AdherenceStreakRepository streakRepository;
    private final MedicineRepository medicineRepository;
    private final MedicineScheduleRepository scheduleRepository;
    private final UserDiseaseRepository userDiseaseRepository;

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
                .findByUserIdAndIsDeletedFalse(userId);

        List<DashboardDTO.TodayMedicineDTO> todayMedicines = activeMedicines.stream()
                .flatMap(m -> scheduleRepository
                        .findByUserMedicineIdAndIsDeletedFalse(m.getId())
                        .stream()
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

        int pending = adherence.getTotalMedicines()
                - adherence.getTakenCount()
                - adherence.getMissedCount()
                - adherence.getSkippedCount();

        return DashboardDTO.builder()
                .userName(user.getFirstName() + " " + user.getLastName())
                .todayAdherencePercentage(adherence.getAdherencePercentage())
                .takenCount(adherence.getTakenCount())
                .missedCount(adherence.getMissedCount())
                .pendingCount(Math.max(pending, 0))
                .totalMedicines(adherence.getTotalMedicines())
                .currentStreak(streak.getCurrentStreak())
                .bestStreak(streak.getBestStreak())
                .todayMedicines(todayMedicines)
                .activeDiseasesCount((int) activeDiseases)
                .build();
    }
}