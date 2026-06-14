package com.meditrack.settings;

import org.springframework.stereotype.Component;

@Component
public class SettingsMapper {

    public UserSettingsDTO toDTO(UserSettings settings) {
        return UserSettingsDTO.builder()
                .id(settings.getId())
                .notificationsEnabled(settings.getNotificationsEnabled())
                .reminderMode(settings.getReminderMode())
                .vibrationEnabled(settings.getVibrationEnabled())
                .alarmVolume(settings.getAlarmVolume())
                .caregiverAlertsEnabled(settings.getCaregiverAlertsEnabled())
                .sosConfirmationEnabled(settings.getSosConfirmationEnabled())
                .language(settings.getLanguage())
                .theme(settings.getTheme())
                .build();
    }

    public void updateSettings(UserSettings settings, UserSettingsDTO dto) {
        if (dto.getNotificationsEnabled() != null)
            settings.setNotificationsEnabled(dto.getNotificationsEnabled());
        if (dto.getReminderMode() != null)
            settings.setReminderMode(dto.getReminderMode());
        if (dto.getVibrationEnabled() != null)
            settings.setVibrationEnabled(dto.getVibrationEnabled());
        if (dto.getAlarmVolume() != null)
            settings.setAlarmVolume(dto.getAlarmVolume());
        if (dto.getCaregiverAlertsEnabled() != null)
            settings.setCaregiverAlertsEnabled(dto.getCaregiverAlertsEnabled());
        if (dto.getSosConfirmationEnabled() != null)
            settings.setSosConfirmationEnabled(dto.getSosConfirmationEnabled());
        if (dto.getLanguage() != null)
            settings.setLanguage(dto.getLanguage());
        if (dto.getTheme() != null)
            settings.setTheme(dto.getTheme());
    }
}