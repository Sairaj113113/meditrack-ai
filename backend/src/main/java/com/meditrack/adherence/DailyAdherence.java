package com.meditrack.adherence;

import com.meditrack.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "daily_adherence")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyAdherence extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36)
    private String id;

    @Column(nullable = false, length = 36)
    private String userId;

    @Column(nullable = false)
    private LocalDate date;

    @Builder.Default
    @Column(nullable = false)
    private Integer totalMedicines = 0;

    @Builder.Default
    @Column(nullable = false)
    private Integer takenCount = 0;

    @Builder.Default
    @Column(nullable = false)
    private Integer missedCount = 0;

    @Builder.Default
    @Column(nullable = false)
    private Integer skippedCount = 0;

    @Builder.Default
    @Column(nullable = false)
    private Double adherencePercentage = 0.0;
}