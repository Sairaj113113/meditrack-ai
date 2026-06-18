package com.meditrack.reminder;

import com.meditrack.common.BaseEntity;
import com.meditrack.enums.ReminderStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reminder_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReminderSession extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36)
    private String id;

    @Column(nullable = false, length = 36)
    private String userId;

    @Column(nullable = false)
    private LocalDateTime scheduledTime;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReminderStatus status = ReminderStatus.PENDING;

    private LocalDateTime snoozedUntil;

    @Builder.Default
    private int retryCount = 0;
}