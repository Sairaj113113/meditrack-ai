package com.meditrack.device;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DeviceService {

    private final UserDeviceRepository deviceRepository;
    private final DeviceMapper deviceMapper;

    public void registerDevice(String userId, UserDeviceDTO dto) {
        // If this FCM token already exists, update it instead of duplicating
        deviceRepository.findByFcmToken(dto.getFcmToken())
                .ifPresentOrElse(existing -> {
                    existing.setUserId(userId);
                    existing.setDeviceType(dto.getDeviceType());
                    existing.setDeviceName(dto.getDeviceName());
                    existing.setIsDeleted(false);
                    deviceRepository.save(existing);
                }, () -> {
                    UserDevice device = deviceMapper.toEntity(userId, dto);
                    deviceRepository.save(device);
                });
    }

    public void unregisterDevice(String userId, String deviceId) {
        UserDevice device = deviceRepository
                .findByIdAndUserIdAndIsDeletedFalse(deviceId, userId)
                .orElseThrow(() -> new RuntimeException("Device not found"));
        device.setIsDeleted(true);
        deviceRepository.save(device);
    }
}