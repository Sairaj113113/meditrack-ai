package com.meditrack.device;

import org.springframework.stereotype.Component;

@Component
public class DeviceMapper {

    public UserDevice toEntity(String userId, UserDeviceDTO dto) {
        return UserDevice.builder()
                .userId(userId)
                .fcmToken(dto.getFcmToken())
                .deviceType(dto.getDeviceType())
                .deviceName(dto.getDeviceName())
                .build();
    }
}