package com.meditrack.settings;

import com.meditrack.enums.ReminderMode;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSettingsDTO {

    private String id;
    private Boolean notificationsEnabled;
    private ReminderMode reminderMode;
    private Boolean vibrationEnabled;
    private Integer alarmVolume;
    private Boolean caregiverAlertsEnabled;
    private Boolean sosConfirmationEnabled;
    private String language;
    private String theme;
}