package com.meditrack.routine;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface RoutineMedicineRepository extends JpaRepository<RoutineMedicine, String> {

    List<RoutineMedicine> findByRoutineIdAndIsDeletedFalse(String routineId);

    Optional<RoutineMedicine> findByRoutineIdAndUserMedicineIdAndIsDeletedFalse(
            String routineId, String userMedicineId);

    void deleteByRoutineIdAndUserMedicineId(String routineId, String userMedicineId);
}