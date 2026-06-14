package com.meditrack.settings;

import com.meditrack.common.BaseEntity;
import com.meditrack.enums.ReminderMode;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSettings extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36)
    private String id;

    @Column(nullable = false, unique = true, length = 36)
    private String userId;

    @Builder.Default
    @Column(nullable = false)
    private Boolean notificationsEnabled = true;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReminderMode reminderMode = ReminderMode.NOTIFICATION;

    @Builder.Default
    @Column(nullable = false)
    private Boolean vibrationEnabled = true;

    @Builder.Default
    @Column(nullable = false)
    private Integer alarmVolume = 80;

    @Builder.Default
    @Column(nullable = false)
    private Boolean caregiverAlertsEnabled = true;

    @Builder.Default
    @Column(nullable = false)
    private Boolean sosConfirmationEnabled = true;

    @Builder.Default
    @Column(nullable = false)
    private String language = "ENGLISH";

    @Builder.Default
    @Column(nullable = false)
    private String theme = "SYSTEM";
}