package com.meditrack.reminder;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class RetryReminderService {

    private final ReminderSessionRepository reminderSessionRepository;

    public void processRetries() {

        log.info("Processing Reminder Retries...");

        // TODO:
        // Find pending reminder sessions

        // Check retry count

        // If retry count < 3
        // Schedule next retry notification

        // Increment retry count

        // Else
        // Mark session as MISSED
    }

    public boolean canRetry(ReminderSession session) {

        return session.getRetryCount() < ReminderConstants.MAX_RETRY_COUNT;
    }

    public void incrementRetryCount(ReminderSession session) {

        session.setRetryCount(
                session.getRetryCount() + 1
        );

        reminderSessionRepository.save(session);
    }

    public void markSessionMissed(ReminderSession session) {

        session.setStatus(
                com.meditrack.enums.ReminderStatus.MISSED
        );

        reminderSessionRepository.save(session);

        log.info(
                "Reminder Session Marked MISSED : {}",
                session.getId()
        );
    }
}