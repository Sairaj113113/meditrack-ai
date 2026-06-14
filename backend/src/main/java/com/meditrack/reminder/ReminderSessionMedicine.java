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
    @JoinColumn(name = "reminder_session_id", nullable = false)
    private ReminderSession reminderSession;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_medicine_id", nullable = false)
    private UserMedicine userMedicine;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReminderMedicineStatus status = ReminderMedicineStatus.PENDING;
}