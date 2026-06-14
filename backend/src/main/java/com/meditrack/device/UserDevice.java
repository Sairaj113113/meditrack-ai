package com.meditrack.device;

import com.meditrack.common.BaseEntity;
import com.meditrack.enums.DeviceType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_devices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDevice extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36)
    private String id;

    @Column(nullable = false, length = 36)
    private String userId;

    @Column(nullable = false, unique = true)
    private String fcmToken;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DeviceType deviceType;

    private String deviceName;
}