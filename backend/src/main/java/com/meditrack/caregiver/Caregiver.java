package com.meditrack.caregiver;

import com.meditrack.common.BaseEntity;
import com.meditrack.enums.CaregiverPermission;
import com.meditrack.enums.CaregiverRelationType;
import com.meditrack.enums.CaregiverStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "caregivers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Caregiver extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36)
    private String id;

    @Column(nullable = false, length = 36)
    private String userId;

    @Column(length = 36)
    private String caregiverUserId;

    @Column(nullable = false)
    private String caregiverName;

    @Column(nullable = false)
    private String caregiverEmail;

    private String caregiverMobile;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CaregiverRelationType relationType;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CaregiverPermission permission = CaregiverPermission.VIEW_ONLY;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CaregiverStatus status = CaregiverStatus.PENDING;

    @Builder.Default
    @Column(nullable = false)
    private Boolean isPrimary = false;
}