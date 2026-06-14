package com.meditrack.device;

import com.meditrack.enums.DeviceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserDeviceDTO {

    @NotBlank(message = "FCM token is required")
    private String fcmToken;

    @NotNull(message = "Device type is required")
    private DeviceType deviceType;

    private String deviceName;
}