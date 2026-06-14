package com.meditrack.reminder;

import java.util.List;

public interface ReminderService {

    List<ReminderResponseDTO> getTodayReminders();

    List<ReminderResponseDTO> getReminderHistory();

    ReminderResponseDTO getReminderSession(String sessionId);

    void markAllTaken(String sessionId);

    void markAllSkipped(String sessionId, String skipReason);

    void snoozeReminder(String sessionId, Integer minutes);

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
}