package com.meditrack.user;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserMedicalProfileRepository extends JpaRepository<UserMedicalProfile, String> {

    Optional<UserMedicalProfile> findByUserId(String userId);
}