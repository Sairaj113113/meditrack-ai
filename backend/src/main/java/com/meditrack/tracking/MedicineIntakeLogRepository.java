package com.meditrack.tracking;

import com.meditrack.enums.IntakeAction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface MedicineIntakeLogRepository extends JpaRepository<MedicineIntakeLog, String> {

    List<MedicineIntakeLog> findByUserIdAndIntakeDate(String userId, LocalDate date);

    long countByUserIdAndIntakeDateAndAction(String userId, LocalDate date, IntakeAction action);
}