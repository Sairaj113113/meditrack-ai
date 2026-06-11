package com.meditrack.disease;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserDiseaseRepository extends JpaRepository<UserDisease, String> {

    List<UserDisease> findByUserIdAndIsDeletedFalse(String userId);

    

long countByUserIdAndIsDeletedFalse(String userId);

}