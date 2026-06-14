package com.meditrack.reminder;

import com.meditrack.enums.ReminderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReminderSessionRepository
        extends JpaRepository<ReminderSession, String> {

    List<ReminderSession> findByUser_IdOrderBySessionTimeDesc(String userId);

    List<ReminderSession> findByUser_IdAndStatus(
            String userId,
            ReminderStatus status
    );

    List<ReminderSession> findBySessionTimeBetween(
            LocalDateTime start,
            LocalDateTime end
    );

    List<ReminderSession> findByStatus(ReminderStatus status);

    List<ReminderSession> findByStatusAndSessionTimeLessThanEqual(
            ReminderStatus status,
            LocalDateTime sessionTime
    );
}