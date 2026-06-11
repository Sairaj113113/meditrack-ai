package com.meditrack.disease;

import com.meditrack.common.BaseEntity;
import com.meditrack.enums.DiseaseSeverity;
import com.meditrack.enums.DiseaseStatus;
import com.meditrack.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "user_diseases")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDisease extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "disease_name", nullable = false, length = 255)
    private String diseaseName;

    private LocalDate diagnosisDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private DiseaseSeverity severity = DiseaseSeverity.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private DiseaseStatus status = DiseaseStatus.ACTIVE;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(columnDefinition = "TEXT")
    private String doctorRecommendations;
}