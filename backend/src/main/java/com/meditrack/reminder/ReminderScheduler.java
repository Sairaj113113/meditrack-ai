package com.meditrack.reminder;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class ReminderScheduler {

    private final ReminderService reminderService;
    private final RetryReminderService retryReminderService;

    /**
     * Runs every minute
     */
    @Scheduled(fixedRate = 60000)
    public void processReminders() {

        log.info("Reminder Scheduler Running...");

        try {

            createReminderSessions();

            processSnoozedReminders();

            retryReminderService.processRetries();

            triggerNotifications();

        } catch (Exception e) {

            log.error("Error while processing reminders", e);

        }
    }

    private void createReminderSessions() {

        log.info("Creating reminder sessions...");

        // TODO:
        // Read medicine_schedules
        // Create reminder_sessions
        // Create reminder_session_medicines
    }

    private void processSnoozedReminders() {

        log.info("Processing snoozed reminders...");

        // TODO:
        // Find sessions with status = SNOOZED
        // If snoozed_until <= now
        // Trigger notification again
    }

    private void triggerNotifications() {

        log.info("Triggering notifications...");

        // TODO:
        // Create notification_queue entries
        // Send FCM notification
    }
}