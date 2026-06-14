package com.meditrack.routine;

import com.meditrack.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "routine_medicines")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoutineMedicine extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36)
    private String id;

    @Column(nullable = false, length = 36)
    private String routineId;

    @Column(nullable = false, length = 36)
    private String userMedicineId;

    private String dosage;
}