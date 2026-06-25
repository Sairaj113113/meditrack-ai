package com.meditrack.tracking;

import com.meditrack.enums.IntakeAction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface MedicineIntakeLogRepository extends JpaRepository<MedicineIntakeLog, String> {

    List<MedicineIntakeLog> findByUserIdAndIntakeDate(
            String userId,
            LocalDate date
    );

    long countByUserIdAndIntakeDateAndAction(
            String userId,
            LocalDate date,
            IntakeAction action
    );

    Optional<MedicineIntakeLog>
    findByUserIdAndUserMedicineIdAndIntakeDateAndScheduledTime(
            String userId,
            String userMedicineId,
            LocalDate intakeDate,
            LocalTime scheduledTime
    );

    Optional<MedicineIntakeLog>
findFirstByUserMedicineIdAndIntakeDateAndScheduledTime(
        String userMedicineId,
        LocalDate intakeDate,
        LocalTime scheduledTime
);
List<MedicineIntakeLog> findByUserMedicineIdAndIsDeletedFalse(
        String userMedicineId
);
}