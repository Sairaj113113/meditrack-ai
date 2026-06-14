package com.meditrack.routine;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface MedicineRoutineRepository extends JpaRepository<MedicineRoutine, String> {

    List<MedicineRoutine> findByUserIdAndIsDeletedFalse(String userId);

    Optional<MedicineRoutine> findByIdAndUserIdAndIsDeletedFalse(String id, String userId);
}