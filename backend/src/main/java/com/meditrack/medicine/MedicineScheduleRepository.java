package com.meditrack.medicine;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MedicineScheduleRepository extends JpaRepository<MedicineSchedule, String> {

    List<MedicineSchedule> findByUserMedicineIdAndIsDeletedFalse(String userMedicineId);

    void deleteByUserMedicineId(String userMedicineId);
}