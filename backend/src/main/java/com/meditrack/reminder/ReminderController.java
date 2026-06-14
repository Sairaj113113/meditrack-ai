package com.meditrack.reminder;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reminders")
@RequiredArgsConstructor
public class ReminderController {

    private final ReminderService reminderService;

    @GetMapping("/today")
    public ResponseEntity<List<ReminderResponseDTO>> getTodayReminders() {

        return ResponseEntity.ok(
                reminderService.getTodayReminders()
        );
    }

    @GetMapping("/history")
    public ResponseEntity<List<ReminderResponseDTO>> getReminderHistory() {

        return ResponseEntity.ok(
                reminderService.getReminderHistory()
        );
    }

    @GetMapping("/session/{id}")
    public ResponseEntity<ReminderResponseDTO> getReminderSession(
            @PathVariable String id
    ) {

        return ResponseEntity.ok(
                reminderService.getReminderSession(id)
        );
    }

    @PostMapping("/session/{id}/taken-all")
    public ResponseEntity<String> markAllTaken(
            @PathVariable String id
    ) {

        reminderService.markAllTaken(id);

        return ResponseEntity.ok("All medicines marked as taken");
    }

    @PostMapping("/session/{id}/skip-all")
    public ResponseEntity<String> markAllSkipped(
            @PathVariable String id,
            @RequestBody ReminderRequestDTO request
    ) {

        reminderService.markAllSkipped(
                id,
                request.getSkipReason()
        );

        return ResponseEntity.ok("All medicines marked as skipped");
    }

    @PostMapping("/session/{id}/snooze")
    public ResponseEntity<String> snoozeReminder(
            @PathVariable String id,
            @RequestBody ReminderRequestDTO request
    ) {

        reminderService.snoozeReminder(
                id,
                request.getMinutes()
        );

        return ResponseEntity.ok("Reminder snoozed successfully");
    }

    @PostMapping("/session/{id}/medicines/{medicineId}/taken")
    public ResponseEntity<UpdateMedicineStatusResponseDTO> markMedicineTaken(
            @PathVariable String id,
            @PathVariable String medicineId
    ) {

        return ResponseEntity.ok(
                reminderService.markMedicineTaken(
                        id,
                        medicineId
                )
        );
    }

    @PostMapping("/session/{id}/medicines/{medicineId}/skip")
    public ResponseEntity<UpdateMedicineStatusResponseDTO> markMedicineSkipped(
            @PathVariable String id,
            @PathVariable String medicineId,
            @RequestBody ReminderRequestDTO request
    ) {

        return ResponseEntity.ok(
                reminderService.markMedicineSkipped(
                        id,
                        medicineId,
                        request.getSkipReason()
                )
        );
    }

    @PostMapping("/session/{id}/medicines/{medicineId}/snooze")
    public ResponseEntity<UpdateMedicineStatusResponseDTO> snoozeMedicine(
            @PathVariable String id,
            @PathVariable String medicineId,
            @RequestBody ReminderRequestDTO request
    ) {

        return ResponseEntity.ok(
                reminderService.snoozeMedicine(
                        id,
                        medicineId,
                        request.getMinutes()
                )
        );
    }

    @PostMapping("/session/{sessionId}/medicines/{medicineId}/status")
    public ResponseEntity<UpdateMedicineStatusResponseDTO> updateMedicineStatus(
            @PathVariable String sessionId,
            @PathVariable String medicineId,
            @Valid @RequestBody UpdateMedicineStatusRequestDTO request
    ) {

        return ResponseEntity.ok(
                reminderService.updateMedicineStatus(
                        sessionId,
                        medicineId,
                        request
                )
        );
    }
}