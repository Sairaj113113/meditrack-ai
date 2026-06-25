package com.meditrack.reminder;

import com.meditrack.adherence.*;
import com.meditrack.enums.*;
import com.meditrack.medicine.*;
import com.meditrack.tracking.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

import com.meditrack.tracking.MedicineIntakeLog;
import com.meditrack.tracking.MedicineIntakeLogRepository;

@Service
@RequiredArgsConstructor
public class ReminderServiceImpl implements ReminderService {

    private final ReminderSessionRepository sessionRepository;
    private final ReminderSessionMedicineRepository sessionMedicineRepository;
    private final MedicineRepository medicineRepository;
    private final MedicineIntakeLogRepository intakeLogRepository;
    private final DailyAdherenceRepository dailyAdherenceRepository;
    private final AdherenceStreakRepository streakRepository;

    private final AdherenceCalculationService adherenceCalculationService;

    @Override
    public List<ReminderResponseDTO> getTodayReminders(String userId) {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.atTime(LocalTime.MAX);

        List<ReminderSession> sessions = sessionRepository
                .findByUserIdAndScheduledTimeBetween(userId, start, end);

        return sessions.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReminderResponseDTO> getReminderHistory(String userId) {
        List<ReminderSession> sessions = sessionRepository
                .findByUserIdOrderByScheduledTimeDesc(userId);
        return sessions.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ReminderResponseDTO getReminderSession(String sessionId) {
        ReminderSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        return toResponseDTO(session);
    }

    @Override
    @Transactional
    public void markAllTaken(String sessionId) {
        ReminderSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        List<ReminderSessionMedicine> medicines = sessionMedicineRepository
                .findByReminderSessionId(sessionId);

        medicines.forEach(m -> {
            m.setStatus(ReminderMedicineStatus.TAKEN);
            sessionMedicineRepository.save(m);

           MedicineIntakeLog log =
        intakeLogRepository
                .findFirstByUserMedicineIdAndIntakeDateAndScheduledTime(
                        m.getUserMedicineId(),
                        LocalDate.now(),
                        session.getScheduledTime().toLocalTime()
                )
                .orElse(
                        MedicineIntakeLog.builder()
                                .userId(session.getUserId())
                                .userMedicineId(m.getUserMedicineId())
                                .intakeDate(LocalDate.now())
                                .scheduledTime(session.getScheduledTime().toLocalTime())
                                .build()
                );

log.setAction(IntakeAction.TAKEN); // SKIPPED in markAllSkipped
log.setMarkedBy(MarkedBy.USER);
log.setActionTime(LocalDateTime.now());

intakeLogRepository.save(log);
        });

        session.setStatus(ReminderStatus.COMPLETED);
        sessionRepository.save(session);

        updateDailyAdherence(session.getUserId(), LocalDate.now());
    }

    @Override
    @Transactional
    public void markAllSkipped(String sessionId) {
        ReminderSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        List<ReminderSessionMedicine> medicines = sessionMedicineRepository
                .findByReminderSessionId(sessionId);

        medicines.forEach(m -> {
            m.setStatus(ReminderMedicineStatus.SKIPPED);
            sessionMedicineRepository.save(m);

           MedicineIntakeLog log =
        intakeLogRepository
                .findFirstByUserMedicineIdAndIntakeDateAndScheduledTime(
                        m.getUserMedicineId(),
                        LocalDate.now(),
                        session.getScheduledTime().toLocalTime()
                )
                .orElse(
                        MedicineIntakeLog.builder()
                                .userId(session.getUserId())
                                .userMedicineId(m.getUserMedicineId())
                                .intakeDate(LocalDate.now())
                                .scheduledTime(session.getScheduledTime().toLocalTime())
                                .build()
                );

log.setAction(IntakeAction.SKIPPED);
log.setMarkedBy(MarkedBy.USER);
log.setActionTime(LocalDateTime.now());

intakeLogRepository.save(log);
        });

        session.setStatus(ReminderStatus.COMPLETED);
        sessionRepository.save(session);

        updateDailyAdherence(session.getUserId(), LocalDate.now());
    }

    @Override
    @Transactional
    public void snoozeSession(String sessionId, int minutes) {
        ReminderSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        session.setStatus(ReminderStatus.SNOOZED);
        session.setSnoozedUntil(LocalDateTime.now().plusMinutes(minutes));
        sessionRepository.save(session);
    }

    @Override
    @Transactional
    public UpdateMedicineStatusResponseDTO markMedicineTaken(String sessionId, String medicineId) {
        UpdateMedicineStatusRequestDTO request = new UpdateMedicineStatusRequestDTO();
        request.setStatus(ReminderMedicineStatus.TAKEN);
        return updateMedicineStatus(sessionId, medicineId, request);
    }

    @Override
    @Transactional
    public UpdateMedicineStatusResponseDTO markMedicineSkipped(String sessionId, String medicineId, String skipReason) {
        UpdateMedicineStatusRequestDTO request = new UpdateMedicineStatusRequestDTO();
        request.setStatus(ReminderMedicineStatus.SKIPPED);
        return updateMedicineStatus(sessionId, medicineId, request);
    }

    @Override
    @Transactional
    public UpdateMedicineStatusResponseDTO snoozeMedicine(String sessionId, String medicineId, Integer minutes) {
        ReminderSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        
        session.setStatus(ReminderStatus.SNOOZED);
        session.setSnoozedUntil(LocalDateTime.now().plusMinutes(minutes));
        sessionRepository.save(session);

        return UpdateMedicineStatusResponseDTO.builder()
                .message("Medicine and session snoozed successfully")
                .sessionId(sessionId)
                .medicineId(medicineId)
                .status("SNOOZED")
                .build();
    }

    @Override
    @Transactional
    public UpdateMedicineStatusResponseDTO updateMedicineStatus(
            String sessionId,
            String medicineId,
            UpdateMedicineStatusRequestDTO request) {
        
        ReminderSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        ReminderSessionMedicine sessionMedicine = sessionMedicineRepository
                .findByReminderSessionIdAndUserMedicineId(sessionId, medicineId)
                .orElseThrow(() -> new RuntimeException("Medicine not found in session"));

        ReminderMedicineStatus newStatus = request.getStatus();
        sessionMedicine.setStatus(newStatus);
        sessionMedicineRepository.save(sessionMedicine);

        IntakeAction action = switch (newStatus) {
            case TAKEN -> IntakeAction.TAKEN;
            case SKIPPED -> IntakeAction.SKIPPED;
            case MISSED -> IntakeAction.MISSED;
            case SNOOZED -> IntakeAction.SNOOZED;
            default -> IntakeAction.MISSED;
        };

        MedicineIntakeLog log =
        intakeLogRepository
                .findFirstByUserMedicineIdAndIntakeDateAndScheduledTime(
                        medicineId,
                        LocalDate.now(),
                        session.getScheduledTime().toLocalTime()
                )
                .orElse(
                        MedicineIntakeLog.builder()
                                .userId(session.getUserId())
                                .userMedicineId(medicineId)
                                .intakeDate(LocalDate.now())
                                .scheduledTime(session.getScheduledTime().toLocalTime())
                                .build()
                );

log.setAction(action);
log.setMarkedBy(MarkedBy.USER);
log.setActionTime(LocalDateTime.now());

intakeLogRepository.save(log);

        updateSessionStatus(session);
        updateDailyAdherence(session.getUserId(), LocalDate.now());

        return UpdateMedicineStatusResponseDTO.builder()
                .message("Medicine status updated successfully")
                .sessionId(sessionId)
                .medicineId(medicineId)
                .status(request.getStatus() != null ? request.getStatus().name() : "PENDING")
                .build();
    }

    private void updateSessionStatus(ReminderSession session) {
        List<ReminderSessionMedicine> medicines = sessionMedicineRepository
                .findByReminderSessionId(session.getId());

        boolean allDone = medicines.stream()
                .allMatch(m -> m.getStatus() != ReminderMedicineStatus.PENDING);

        if (allDone) {
            session.setStatus(ReminderStatus.COMPLETED);
            sessionRepository.save(session);
        }
    }

    @Override
    @Transactional
    public void updateDailyAdherence(String userId, LocalDate date) {
        adherenceCalculationService.recalculate(userId, date);
    }

    private void updateStreak(String userId, LocalDate date, double percentage) {
        AdherenceStreak streak = streakRepository.findByUserId(userId)
                .orElseGet(() -> AdherenceStreak.builder().userId(userId).build());

        if (percentage >= 100) {
            if (streak.getLastUpdatedDate() != null &&
                    streak.getLastUpdatedDate().equals(date.minusDays(1))) {
                streak.setCurrentStreak(streak.getCurrentStreak() + 1);
            } else if (!date.equals(streak.getLastUpdatedDate())) {
                streak.setCurrentStreak(1);
            }
            if (streak.getCurrentStreak() > streak.getBestStreak()) {
                streak.setBestStreak(streak.getCurrentStreak());
            }
        } else {
            streak.setCurrentStreak(0);
        }
        streak.setLastUpdatedDate(date);
        streakRepository.save(streak);
    }

    private ReminderResponseDTO toResponseDTO(ReminderSession session) {
        List<ReminderSessionMedicine> medicines = sessionMedicineRepository
                .findByReminderSessionId(session.getId());

        List<ReminderResponseDTO.MedicineItem> items = medicines.stream()
                .map(m -> {
                    String name = medicineRepository.findById(m.getUserMedicineId())
                            .map(Medicine::getMedicineName)
                            .orElse("Unknown");
                    
                    ReminderResponseDTO.MedicineItem item = ReminderResponseDTO.MedicineItem.builder()
                            .userMedicineId(m.getUserMedicineId())
                            .medicineName(name)
                            .status(m.getStatus().name())
                            .build();
                    return item;
                })
                .collect(Collectors.toList());

        return ReminderResponseDTO.builder()
                .sessionId(session.getId())
                .sessionTime(session.getScheduledTime().toLocalTime().toString())
                .status(session.getStatus().name())
                .medicineCount(medicines.size())
                .medicines(items)
                .build();
    }
}