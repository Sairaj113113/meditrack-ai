package com.meditrack.reminder;

import com.meditrack.enums.ReminderMedicineStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReminderSessionMedicineRepository
        extends JpaRepository<ReminderSessionMedicine, String> {

    List<ReminderSessionMedicine> findByReminderSession_Id(String reminderSessionId);

    List<ReminderSessionMedicine> findByUserMedicine_Id(String userMedicineId);

    List<ReminderSessionMedicine> findByReminderSession_IdAndStatus(
            String reminderSessionId,
            ReminderMedicineStatus status
    );

    long countByReminderSession_Id(String reminderSessionId);

    long countByReminderSession_IdAndStatus(
            String reminderSessionId,
            ReminderMedicineStatus status
    );
}