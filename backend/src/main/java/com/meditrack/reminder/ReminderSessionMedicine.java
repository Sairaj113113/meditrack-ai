package com.meditrack.reminder;

import com.meditrack.common.BaseEntity;
import com.meditrack.enums.ReminderMedicineStatus;
import com.meditrack.medicine.UserMedicine;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "reminder_session_medicines")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReminderSessionMedicine extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reminder_session_id", insertable = false, updatable = false)
    private ReminderSession reminderSession;

    @Column(name = "reminder_session_id", nullable = false, length = 36)
    private String reminderSessionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_medicine_id", insertable = false, updatable = false)
    private UserMedicine userMedicine;

    @Column(name = "user_medicine_id", nullable = false, length = 36)
    private String userMedicineId;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReminderMedicineStatus status = ReminderMedicineStatus.PENDING;
}