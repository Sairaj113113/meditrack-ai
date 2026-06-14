package com.meditrack.settings;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SettingsService {

    private final UserSettingsRepository settingsRepository;
    private final SettingsMapper settingsMapper;

    public UserSettingsDTO getSettings(String userId) {
        UserSettings settings = settingsRepository
                .findByUserId(userId)
                .orElseGet(() -> {
                    UserSettings newSettings = UserSettings.builder()
                            .userId(userId)
                            .build();
                    return settingsRepository.save(newSettings);
                });
        return settingsMapper.toDTO(settings);
    }

    public UserSettingsDTO updateSettings(String userId, UserSettingsDTO dto) {
        UserSettings settings = settingsRepository
                .findByUserId(userId)
                .orElseGet(() -> UserSettings.builder()
                        .userId(userId)
                        .build());

        settingsMapper.updateSettings(settings, dto);
        settingsRepository.save(settings);

        return settingsMapper.toDTO(settings);
    }
}