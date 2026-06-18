package com.meditrack.reminder;

import java.time.LocalDate;
import java.util.List;

public interface ReminderService {

    List<ReminderResponseDTO> getTodayReminders(String userId);

    List<ReminderResponseDTO> getReminderHistory(String userId);

    ReminderResponseDTO getReminderSession(String sessionId);

    void markAllTaken(String sessionId);

    void markAllSkipped(String sessionId);

    void snoozeSession(String sessionId, int minutes);

    UpdateMedicineStatusResponseDTO markMedicineTaken(
            String sessionId,
            String medicineId
    );

    UpdateMedicineStatusResponseDTO markMedicineSkipped(
            String sessionId,
            String medicineId,
            String skipReason
    );

    UpdateMedicineStatusResponseDTO snoozeMedicine(
            String sessionId,
            String medicineId,
            Integer minutes
    );

    UpdateMedicineStatusResponseDTO updateMedicineStatus(
            String sessionId,
            String medicineId,
            UpdateMedicineStatusRequestDTO request
    );

    void updateDailyAdherence(String userId, LocalDate date);
}