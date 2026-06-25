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


    // Latest created medicines first
    List<Medicine> findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(
            String userId
    );


    // Category filter + latest first
    List<Medicine> findByUserIdAndMedicineCategoryAndIsDeletedFalseOrderByCreatedAtDesc(
            String userId,
            MedicineCategory category
    );

    // Active category filter + latest first
    List<Medicine> findByUserIdAndMedicineCategoryAndStatusAndIsDeletedFalseOrderByCreatedAtDesc(
            String userId,
            MedicineCategory category,
            MedicineStatus status
    );

    // Archived medicines latest first
    List<Medicine> findByUserIdAndStatusAndIsDeletedFalseOrderByCreatedAtDesc(
            String userId,
            MedicineStatus status
    );


    Optional<Medicine> findByIdAndUserIdAndIsDeletedFalse(
            String id,
            String userId
    );


    @Query("""
        SELECT m FROM Medicine m
        JOIN MedicineSchedule s 
        ON s.userMedicineId = m.id
        WHERE m.userId = :userId
        AND m.medicineCategory = 'ROUTINE'
        AND m.status = com.meditrack.enums.MedicineStatus.ACTIVE
        AND m.isDeleted = false
        AND s.scheduleType = :scheduleType
        AND s.isActive = true
        ORDER BY m.createdAt DESC
    """)
    List<Medicine> findRoutineByPeriod(
            @Param("userId") String userId,
            @Param("scheduleType") ScheduleType scheduleType
    );
}