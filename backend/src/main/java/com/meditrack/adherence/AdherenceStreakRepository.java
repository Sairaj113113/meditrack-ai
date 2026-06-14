package com.meditrack.adherence;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AdherenceStreakRepository extends JpaRepository<AdherenceStreak, String> {
    Optional<AdherenceStreak> findByUserId(String userId);
}