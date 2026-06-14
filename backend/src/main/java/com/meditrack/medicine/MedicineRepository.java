package com.meditrack.medicine;

import com.meditrack.enums.MedicineCategory;
import com.meditrack.enums.MedicineStatus;
import com.meditrack.enums.ScheduleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MedicineRepository extends JpaRepository<Medicine, String> {

    List<Medicine> findByUserIdAndIsDeletedFalse(String userId);

    List<Medicine> findByUserIdAndMedicineCategoryAndIsDeletedFalse(
            String userId, MedicineCategory category);

    List<Medicine> findByUserIdAndStatusAndIsDeletedFalse(
            String userId, MedicineStatus status);

    Optional<Medicine> findByIdAndUserIdAndIsDeletedFalse(String id, String userId);

    @Query("""
        SELECT m FROM Medicine m
        JOIN MedicineSchedule s ON s.userMedicineId = m.id
        WHERE m.userId = :userId
        AND m.medicineCategory = 'ROUTINE'
        AND m.isDeleted = false
        AND s.scheduleType = :scheduleType
        AND s.isActive = true
    """)
    List<Medicine> findRoutineByPeriod(
            @Param("userId") String userId,
            @Param("scheduleType") ScheduleType scheduleType);
}