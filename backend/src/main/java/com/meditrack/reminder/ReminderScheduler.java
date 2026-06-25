package com.meditrack.reminder;

import com.meditrack.enums.*;
import com.meditrack.medicine.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.util.List;

import com.meditrack.tracking.MedicineIntakeLog;
import com.meditrack.tracking.MedicineIntakeLogRepository;

@Slf4j
@Component
@EnableScheduling
@RequiredArgsConstructor
public class ReminderScheduler {

    private final MedicineRepository medicineRepository;
    private final MedicineScheduleRepository scheduleRepository;
    private final ReminderSessionRepository sessionRepository;
    private final ReminderSessionMedicineRepository sessionMedicineRepository;
    private final ReminderService reminderService;
    private final MedicineScheduleEvaluator scheduleEvaluator;

    private final MedicineIntakeLogRepository intakeLogRepository;

    

    @Scheduled(fixedRate = 60000) // every minute

@Transactional
public void createReminderSessions() {

    LocalDateTime now = LocalDateTime.now();
    LocalTime currentTime = now.toLocalTime().withSecond(0).withNano(0);
    LocalDate today = LocalDate.now();

    List<MedicineSchedule> schedules = scheduleRepository.findAll();

    log.info("Schedules Found = {}", schedules.size());

    for (MedicineSchedule schedule : schedules) {

        log.info(
                "ScheduleId={} UserMedicineId={} ScheduleTime={} CurrentTime={}",
                schedule.getId(),
                schedule.getUserMedicineId(),
                schedule.getScheduleTime(),
                currentTime
        );

        if (!schedule.getIsActive()) {
            log.info("Skipped: Inactive Schedule");
            continue;
        }

        LocalTime scheduleTime = schedule.getScheduleTime();

        Medicine medicine = medicineRepository
                .findById(schedule.getUserMedicineId())
                .orElse(null);

        if (medicine == null) {
            log.info("Skipped: Medicine Not Found");
            continue;
        }

        if (medicine.getStatus() != MedicineStatus.ACTIVE) {
            log.info("Skipped: Medicine Not Active");
            continue;
        }

       if (medicine.getIsDeleted()) {
    log.info("Skipped: Medicine Deleted");
    continue;
}

if (!scheduleEvaluator.isDueToday(
        medicine,
        schedule,
        today
)) {
    log.info("Skipped: Not Due Today");
    continue;
}

// DEV FIX
if (scheduleTime.isAfter(currentTime)) {
    log.info("Skipped: Future Schedule");
    continue;
}

        String userId = medicine.getUserId();

        LocalDateTime sessionStart = today.atTime(scheduleTime);
        LocalDateTime sessionEnd = sessionStart.plusMinutes(1);

        List<ReminderSession> existing =
                sessionRepository.findByUserIdAndScheduledTimeBetween(
                        userId,
                        sessionStart,
                        sessionEnd
                );

        ReminderSession session;
        if (!existing.isEmpty()) {
            session = existing.get(0);
            log.info("Reusing existing session {} for schedule {}", session.getId(), scheduleTime);
        } else {
            session = ReminderSession.builder()
                    .userId(userId)
                    .scheduledTime(sessionStart)
                    .status(ReminderStatus.PENDING)
                    .build();

            try {
                session = sessionRepository.save(session);
                log.info("SESSION SAVED {}", session.getId());
            } catch (Exception e) {
                log.error("SAVE FAILED", e);
                continue;
            }
        }

        boolean alreadyAttached = sessionMedicineRepository
                .findByReminderSessionIdAndUserMedicineId(session.getId(), medicine.getId())
                .isPresent();

        if (alreadyAttached) {
            log.info(
                    "Skipped: Medicine {} already attached to session {}",
                    medicine.getId(),
                    session.getId()
            );
            continue;
        }

        ReminderSessionMedicine sessionMedicine =
                ReminderSessionMedicine.builder()
                        .reminderSessionId(session.getId())
                        .userMedicineId(medicine.getId())
                        .status(ReminderMedicineStatus.PENDING)
                        .build();

        sessionMedicineRepository.save(sessionMedicine);

        log.info(
                "Appended medicine {} to reminder session {}",
                medicine.getMedicineName(),
                session.getId()
        );
    }
}

    @Scheduled(fixedRate = 300000) // every 5 minutes
    public void processMissedReminders() {
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(30);

        List<ReminderSession> pendingSessions = sessionRepository
                .findByStatusAndScheduledTimeBefore(
    ReminderStatus.PENDING,
    cutoff
);

        for (ReminderSession session : pendingSessions) {
            List<ReminderSessionMedicine> medicines = sessionMedicineRepository
                    .findByReminderSessionId(session.getId());

           medicines.stream()
        .filter(m -> m.getStatus() == ReminderMedicineStatus.PENDING)
        .forEach(m -> {

            m.setStatus(ReminderMedicineStatus.MISSED);
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

            log.setAction(IntakeAction.MISSED);
            log.setMarkedBy(MarkedBy.SYSTEM);
            log.setActionTime(LocalDateTime.now());

            intakeLogRepository.save(log);

        });

            session.setStatus(ReminderStatus.MISSED);
            sessionRepository.save(session);

            reminderService.updateDailyAdherence(session.getUserId(), LocalDate.now());
        }
    }
    
}