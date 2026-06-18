package com.meditrack.reminder;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
import com.meditrack.enums.ReminderStatus;

public interface ReminderSessionRepository extends JpaRepository<ReminderSession, String> {

    List<ReminderSession> findByUserIdAndScheduledTimeBetween(
            String userId, LocalDateTime start, LocalDateTime end);

    List<ReminderSession> findByUserIdOrderByScheduledTimeDesc(String userId);

    List<ReminderSession> findByStatusAndScheduledTimeBefore(
        ReminderStatus status,
        LocalDateTime time
);
}