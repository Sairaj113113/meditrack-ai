package com.meditrack.routine;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoutineGroupDayRepository extends JpaRepository<RoutineGroupDay, String> {

    List<RoutineGroupDay> findByRoutineGroupIdAndIsDeletedFalse(String routineGroupId);

}