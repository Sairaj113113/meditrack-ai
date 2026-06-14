package com.meditrack.reminder;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReminderServiceImpl implements ReminderService {

    private final ReminderSessionRepository reminderSessionRepository;
    private final ReminderSessionMedicineRepository reminderSessionMedicineRepository;
    private final ReminderMapper reminderMapper;

    @Override
    public List<ReminderResponseDTO> getTodayReminders() {

        // TODO: Implement Today's Reminders Logic

        return Collections.emptyList();
    }

    @Override
    public List<ReminderResponseDTO> getReminderHistory() {

        // TODO: Implement Reminder History Logic

        return Collections.emptyList();
    }

    @Override
public ReminderResponseDTO getReminderSession(String sessionId) {

    ReminderSession session = reminderSessionRepository
            .findById(sessionId)
            .orElseThrow(() ->
                    new RuntimeException("Reminder session not found")
            );

    return reminderMapper.toResponseDTO(session);
}

    @Override
    public void markAllTaken(String sessionId) {

        // TODO:
        // Update all reminder_session_medicines
        // status = TAKEN

        // Update reminder_session
        // status = COMPLETED
    }

    @Override
    public void markAllSkipped(String sessionId, String skipReason) {

        // TODO:
        // Update all medicines as SKIPPED
        // Save skip reason in intake logs
    }

    @Override
    public void snoozeReminder(String sessionId, Integer minutes) {

        // TODO:
        // Update session status = SNOOZED
        // Update snoozedUntil
    }

    @Override
    public UpdateMedicineStatusResponseDTO markMedicineTaken(
            String sessionId,
            String medicineId
    ) {

        return UpdateMedicineStatusResponseDTO.builder()
                .message("Medicine marked as taken")
                .sessionId(sessionId)
                .medicineId(medicineId)
                .status("TAKEN")
                .build();
    }

    @Override
    public UpdateMedicineStatusResponseDTO markMedicineSkipped(
            String sessionId,
            String medicineId,
            String skipReason
    ) {

        return UpdateMedicineStatusResponseDTO.builder()
                .message("Medicine marked as skipped")
                .sessionId(sessionId)
                .medicineId(medicineId)
                .status("SKIPPED")
                .build();
    }

    @Override
    public UpdateMedicineStatusResponseDTO snoozeMedicine(
            String sessionId,
            String medicineId,
            Integer minutes
    ) {

        return UpdateMedicineStatusResponseDTO.builder()
                .message("Medicine snoozed successfully")
                .sessionId(sessionId)
                .medicineId(medicineId)
                .status("SNOOZED")
                .build();
    }

    @Override
    public UpdateMedicineStatusResponseDTO updateMedicineStatus(
            String sessionId,
            String medicineId,
            UpdateMedicineStatusRequestDTO request
    ) {

        return UpdateMedicineStatusResponseDTO.builder()
                .message("Medicine status updated successfully")
                .sessionId(sessionId)
                .medicineId(medicineId)
                .status(request.getStatus().name())
                .build();
    }
}