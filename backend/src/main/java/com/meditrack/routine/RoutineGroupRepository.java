package com.meditrack.routine;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.meditrack.enums.RoutineStatus;

import java.util.List;

@Repository
public interface RoutineGroupRepository
        extends JpaRepository<RoutineGroup, String> {

    List<RoutineGroup> findByUserIdAndIsDeletedFalse(
            String userId
    );

    List<RoutineGroup> findByUserDiseaseIdAndIsDeletedFalse(
        String userDiseaseId
);

List<RoutineGroup> findByUserIdAndStatusAndIsDeletedFalse(
        String userId,
        RoutineStatus status
);

List<RoutineGroup> findByUserIdAndStatusInAndIsDeletedFalse(
        String userId,
        List<RoutineStatus> statuses
);
}