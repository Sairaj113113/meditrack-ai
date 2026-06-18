package com.meditrack.reminder;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ReminderSessionMedicineRepository extends JpaRepository<ReminderSessionMedicine, String> {

    List<ReminderSessionMedicine> findByReminderSessionId(String sessionId);

    Optional<ReminderSessionMedicine> findByReminderSessionIdAndUserMedicineId(
            String sessionId, String userMedicineId);
}