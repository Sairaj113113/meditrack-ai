package com.meditrack.caregiver;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CaregiverRepository extends JpaRepository<Caregiver, String> {

    List<Caregiver> findByUserIdAndIsDeletedFalse(String userId);

    Optional<Caregiver> findByIdAndUserIdAndIsDeletedFalse(String id, String userId);

    List<Caregiver> findByCaregiverEmailAndIsDeletedFalse(String email);
}