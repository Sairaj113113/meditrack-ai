package com.meditrack.medicine;

import com.meditrack.enums.MedicineCategory;
import com.meditrack.enums.MedicineStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserMedicineRepository
        extends JpaRepository<UserMedicine, String> {

    List<UserMedicine> findByUserIdAndIsDeletedFalse(
            String userId
    );

    Optional<UserMedicine> findByIdAndIsDeletedFalse(
            String id
    );

    List<UserMedicine> findByUserIdAndMedicineCategoryAndIsDeletedFalse(
            String userId,
            MedicineCategory medicineCategory
    );

    List<UserMedicine> findByRoutineGroupIdAndIsDeletedFalse(
            String routineGroupId
    );

    List<UserMedicine> findByUserDiseaseIdAndIsDeletedFalse(
            String userDiseaseId
    );

    List<UserMedicine> findByUserIdAndStatusAndIsDeletedFalse(
            String userId,
            MedicineStatus status
    );
}