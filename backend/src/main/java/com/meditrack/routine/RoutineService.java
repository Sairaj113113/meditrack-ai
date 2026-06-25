package com.meditrack.routine;

import com.meditrack.enums.RoutineStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.meditrack.disease.UserDiseaseRepository;
import com.meditrack.enums.MedicineCategory;
import com.meditrack.enums.MedicineStatus;
import com.meditrack.medicine.MedicineScheduleRepository;
import com.meditrack.medicine.UserMedicine;
import com.meditrack.medicine.UserMedicineRepository;
import com.meditrack.disease.UserDisease;
import com.meditrack.medicine.MedicineSchedule;
import com.meditrack.enums.ScheduleType;


@Service
@RequiredArgsConstructor
@Transactional
public class RoutineService {

    private final RoutineGroupRepository routineGroupRepository;
    private final RoutineGroupDayRepository routineGroupDayRepository;
    private final UserMedicineRepository userMedicineRepository;
    private final UserDiseaseRepository userDiseaseRepository;
    private final MedicineScheduleRepository medicineScheduleRepository;

    public RoutineResponseDTO createRoutine(
            CreateRoutineDTO request,
            String userId
    ) {

        RoutineGroup routine =
                RoutineMapper.toEntity(request, userId);

        routine.setStatus(RoutineStatus.ACTIVE);

        if (routine.getIsReminderEnabled() == null) {
            routine.setIsReminderEnabled(true);
        }

        RoutineGroup savedRoutine =
                routineGroupRepository.save(routine);

        if (request.getDays() != null &&
                !request.getDays().isEmpty()) {

            List<RoutineGroupDay> days =
                    request.getDays()
                            .stream()
                            .map(day ->
                                    RoutineGroupDay.builder()
                                            .routineGroupId(savedRoutine.getId())
                                            .dayOfWeek(day)
                                            .build())
                            .toList();

            routineGroupDayRepository.saveAll(days);
        }
return RoutineMapper.toResponse(
        savedRoutine,
        getDiseaseName(
                savedRoutine.getUserDiseaseId()
        ),
        0
);

        
    }

    @Transactional(readOnly = true)
    public List<RoutineResponseDTO> getAllRoutines(
            String userId
    ) {

        return routineGroupRepository
                .findByUserIdAndStatusInAndIsDeletedFalse(
        userId,
        List.of(
                RoutineStatus.ACTIVE,
                RoutineStatus.PAUSED
        )
)
                .stream()
             .map(routine -> RoutineMapper.toResponse(
        routine,
        getDiseaseName(
                routine.getUserDiseaseId()
        ),
        userMedicineRepository
                .findByRoutineGroupIdAndIsDeletedFalse(
                        routine.getId()
                )
                .size()
))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RoutineDetailsDTO getRoutineById(
            String routineId
    ) {

        RoutineGroup routine =
                routineGroupRepository.findById(routineId)
                        .orElseThrow(() ->
                                new RuntimeException("Routine not found"));

        List<RoutineGroupDay> days =
                routineGroupDayRepository
                        .findByRoutineGroupIdAndIsDeletedFalse(routineId);

        return RoutineMapper.toDetails(routine, days);
    }

    public RoutineResponseDTO updateRoutine(
            String routineId,
            UpdateRoutineDTO request
    ) {

        RoutineGroup routine =
                routineGroupRepository.findById(routineId)
                        .orElseThrow(() ->
                                new RuntimeException("Routine not found"));

        routine.setRoutineName(request.getRoutineName());
        routine.setUserDiseaseId(request.getUserDiseaseId());
        routine.setRoutineTime(request.getRoutineTime());
        routine.setFrequencyType(request.getFrequencyType());
        routine.setStartDate(request.getStartDate());
        routine.setEndDate(request.getEndDate());
        routine.setIsReminderEnabled(
                request.getIsReminderEnabled()
        );

        RoutineGroup updated =
                routineGroupRepository.save(routine);

        return RoutineMapper.toResponse(
        updated,
        getDiseaseName(
                updated.getUserDiseaseId()
        ),
        userMedicineRepository
                .findByRoutineGroupIdAndIsDeletedFalse(
                        updated.getId()
                )
                .size()
);
    }

    public void deleteRoutine(
            String routineId
    ) {

        RoutineGroup routine =
                routineGroupRepository.findById(routineId)
                        .orElseThrow(() ->
                                new RuntimeException("Routine not found"));

        routine.setIsDeleted(true);
        routine.setDeletedAt(LocalDateTime.now());

        routineGroupRepository.save(routine);
    }

    public RoutineMedicineDTO addMedicine(
        String routineId,
        AddRoutineMedicineDTO request
) {

    RoutineGroup routine =
            routineGroupRepository.findById(routineId)
                    .orElseThrow(() ->
                            new RuntimeException("Routine not found"));

   UserMedicine medicine =
        UserMedicine.builder()
                .userId(routine.getUserId())
                .userDiseaseId(routine.getUserDiseaseId())
                .routineGroupId(routineId)

                .medicineName(request.getMedicineName())
                .medicineType(request.getMedicineType())

                .dosage(request.getDosage())
                .notes(request.getNotes())

                .medicineCategory(MedicineCategory.ROUTINE)

                .frequencyType(routine.getFrequencyType())

                .startDate(routine.getStartDate())

                .status(MedicineStatus.ACTIVE)

                .isPaused(false)

                .build();

    UserMedicine saved =
            userMedicineRepository.save(medicine);

            ScheduleType scheduleType;

switch (routine.getFrequencyType()) {

    case DAILY:
        scheduleType = ScheduleType.DAILY;
        break;

    case WEEKLY:
    case CUSTOM:
        scheduleType = ScheduleType.SPECIFIC_DAYS;
        break;

    case INTERVAL:
        scheduleType = ScheduleType.EVERY_X_HOURS;
        break;

    default:
        scheduleType = ScheduleType.DAILY;
}

MedicineSchedule schedule =
        MedicineSchedule.builder()
                .userMedicineId(saved.getId())
                .scheduleTime(routine.getRoutineTime())
                .scheduleType(scheduleType)
                .isActive(true)
                .build();

medicineScheduleRepository.save(schedule);

    return RoutineMedicineDTO.builder()
            .id(saved.getId())
            .medicineName(saved.getMedicineName())
            .medicineType(saved.getMedicineType())
            .dosage(saved.getDosage())
            .notes(saved.getNotes())
            .build();
}


@Transactional(readOnly = true)
public List<RoutineMedicineDTO> getRoutineMedicines(
        String routineId
) {

    return userMedicineRepository
            .findByRoutineGroupIdAndIsDeletedFalse(routineId)
            .stream()
            .map(medicine ->
                    RoutineMedicineDTO.builder()
                            .id(medicine.getId())
                            .medicineName(medicine.getMedicineName())
                            .medicineType(medicine.getMedicineType())
                            .dosage(medicine.getDosage())
                            .notes(medicine.getNotes())
                            .build())
            .toList();
}

public void removeMedicine(
        String routineId,
        String medicineId
) {

    UserMedicine medicine =
            userMedicineRepository
                    .findByIdAndIsDeletedFalse(medicineId)
                    .orElseThrow(() ->
                            new RuntimeException("Medicine not found"));

    if (!routineId.equals(medicine.getRoutineGroupId())) {
        throw new RuntimeException(
                "Medicine does not belong to routine"
        );
    }

    medicine.setIsDeleted(true);
    medicine.setDeletedAt(LocalDateTime.now());

    userMedicineRepository.save(medicine);
}
    @Transactional(readOnly = true)
public List<DiseaseRoutineDTO> getRoutineDiseases(
        String userId
) {

    List<UserDisease> diseases =
            userDiseaseRepository
                    .findByUserIdAndIsDeletedFalse(userId);

   return diseases.stream()
        .map(disease -> {

            int routineCount =
                    routineGroupRepository
                            .findByUserDiseaseIdAndIsDeletedFalse(
                                    disease.getId()
                            )
                            .size();

            return DiseaseRoutineDTO.builder()
                    .diseaseId(disease.getId())
                    .diseaseName(disease.getDiseaseName())
                    .routineCount(routineCount)
                    .build();
        })
        .filter(dto -> dto.getRoutineCount() > 0)
        .toList();
}

@Transactional(readOnly = true)
public List<RoutineByDiseaseDTO> getRoutinesByDisease(
        String diseaseId
) {

    return routineGroupRepository
            .findByUserDiseaseIdAndIsDeletedFalse(
                    diseaseId
            )
            .stream()
            .map(routine -> {

                Integer medicineCount =
                        userMedicineRepository
                                .findByRoutineGroupIdAndIsDeletedFalse(
                                        routine.getId()
                                )
                                .size();

                return RoutineByDiseaseDTO.builder()
                        .routineId(routine.getId())
                        .routineName(routine.getRoutineName())
                        .routineTime(routine.getRoutineTime())
                        .medicineCount(medicineCount)
                        .build();
            })
            .toList();
}

public RoutineMedicineDTO updateMedicine(
        String medicineId,
        UpdateRoutineMedicineDTO request
) {

    UserMedicine medicine =
            userMedicineRepository
                    .findByIdAndIsDeletedFalse(medicineId)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Medicine not found"
                            ));

    medicine.setMedicineName(
            request.getMedicineName()
    );

    medicine.setMedicineType(
            request.getMedicineType()
    );

    medicine.setDosage(
            request.getDosage()
    );

    medicine.setNotes(
            request.getNotes()
    );

    UserMedicine updated =
            userMedicineRepository.save(medicine);

    return RoutineMedicineDTO.builder()
            .id(updated.getId())
            .medicineName(updated.getMedicineName())
            .medicineType(updated.getMedicineType())
            .dosage(updated.getDosage())
            .notes(updated.getNotes())
            .build();
}

public void archiveRoutine(String routineId) {

    RoutineGroup routine =
            routineGroupRepository.findById(routineId)
                    .orElseThrow(() ->
                            new RuntimeException("Routine not found"));

    routine.setStatus(RoutineStatus.ARCHIVED);

    routineGroupRepository.save(routine);
}

public void unarchiveRoutine(String routineId) {

    RoutineGroup routine =
            routineGroupRepository.findById(routineId)
                    .orElseThrow(() ->
                            new RuntimeException("Routine not found"));

    routine.setStatus(RoutineStatus.ACTIVE);

    routineGroupRepository.save(routine);
}
public void pauseRoutine(String routineId) {

    RoutineGroup routine =
            routineGroupRepository.findById(routineId)
                    .orElseThrow(() ->
                            new RuntimeException("Routine not found"));

    routine.setStatus(RoutineStatus.PAUSED);

    routineGroupRepository.save(routine);
}
public void resumeRoutine(String routineId) {

    RoutineGroup routine =
            routineGroupRepository.findById(routineId)
                    .orElseThrow(() ->
                            new RuntimeException("Routine not found"));

    routine.setStatus(RoutineStatus.ACTIVE);

    routineGroupRepository.save(routine);
}

@Transactional(readOnly = true)
public List<RoutineResponseDTO> getArchivedRoutines(
        String userId
) {

    return routineGroupRepository
            .findByUserIdAndStatusAndIsDeletedFalse(
                    userId,
                    RoutineStatus.ARCHIVED
            )
            .stream()
            .map(routine -> RoutineMapper.toResponse(
                    routine,
                    getDiseaseName(routine.getUserDiseaseId()),
                    userMedicineRepository
                            .findByRoutineGroupIdAndIsDeletedFalse(
                                    routine.getId()
                            )
                            .size()
            ))
            .toList();
}

private String getDiseaseName(
        String diseaseId
) {

    if (diseaseId == null) {
        return null;
    }

    return userDiseaseRepository
            .findById(diseaseId)
            .map(UserDisease::getDiseaseName)
            .orElse(null);
}
}