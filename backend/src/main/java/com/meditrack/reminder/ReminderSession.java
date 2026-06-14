package com.meditrack.reminder;

import com.meditrack.common.BaseEntity;
import com.meditrack.enums.ReminderNotificationType;
import com.meditrack.enums.ReminderStatus;
import com.meditrack.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "session_time", nullable = false)
    private LocalDateTime sessionTime;

    @Column(name = "medicine_count", nullable = false)
    private Integer medicineCount;

    @Enumerated(EnumType.STRING)
    @Column(name = "notification_type", nullable = false)
    private ReminderNotificationType notificationType;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReminderStatus status = ReminderStatus.PENDING;

    @Builder.Default
    @Column(name = "retry_count", nullable = false)
    private Integer retryCount = 0;

    @Column(name = "snoozed_until")
    private LocalDateTime snoozedUntil;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Builder.Default
    @OneToMany(
            mappedBy = "reminderSession",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<ReminderSessionMedicine> medicines = new ArrayList<>();
}