package com.meditrack.medicine;

import com.meditrack.enums.MedicineCategory;
import com.meditrack.enums.MedicineStatus;
import com.meditrack.enums.ScheduleType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import com.meditrack.disease.DiseaseDTO;
import com.meditrack.disease.DiseaseService;
import java.time.LocalDate;
import java.time.LocalTime;
import com.meditrack.adherence.AdherenceCalculationService;
import com.meditrack.tracking.MedicineIntakeLog;
import com.meditrack.tracking.MedicineIntakeLogRepository;

@Service
@RequiredArgsConstructor
public class MedicineService {

    private final MedicineRepository medicineRepository;
    private final MedicineScheduleRepository scheduleRepository;
    private final MedicineMapper medicineMapper;
    private final DiseaseService diseaseService;
    private final AdherenceCalculationService adherenceCalculationService;
    private final MedicineIntakeLogRepository intakeLogRepository;


    @Transactional
    public MedicineResponseDTO addMedicine(String userId, AddMedicineDTO dto) {

        String diseaseId = dto.getUserDiseaseId();

        if (dto.getDiseaseName() != null &&
                !dto.getDiseaseName().trim().isEmpty()) {

            DiseaseDTO disease = diseaseService.createQuickDisease(
                    userId,
                    dto.getDiseaseName().trim()
            );

            diseaseId = disease.getId();
        }
        LocalDate startDate = dto.getStartDate();

if (startDate != null
        && startDate.equals(LocalDate.now())
        && dto.getSchedules() != null
        && !dto.getSchedules().isEmpty()) {

    boolean allTimesPast = dto.getSchedules()
            .stream()
            .allMatch(s ->
                    s.getScheduleTime().isBefore(LocalTime.now())
            );

    if (allTimesPast) {
        startDate = LocalDate.now().plusDays(1);
    }
}

        Medicine medicine = Medicine.builder()
                .userId(userId)
                .userDiseaseId(diseaseId)
                .medicineName(dto.getMedicineName())
                .medicineCategory(dto.getMedicineCategory())
                .medicineType(dto.getMedicineType())
                .frequencyType(dto.getFrequencyType())
                .intakeInstruction(dto.getIntakeInstruction())
                .startDate(startDate)
                .endDate(dto.getEndDate())
                .notes(dto.getNotes())
                .build();

        medicineRepository.save(medicine);

        List<MedicineSchedule> schedules = dto.getSchedules()
                .stream()
                .map(s -> MedicineSchedule.builder()
                        .userMedicineId(medicine.getId())
                        .scheduleTime(s.getScheduleTime())
                        .scheduleType(s.getScheduleType())
                        .dayOfWeek(s.getDayOfWeek())
                        .intervalHours(s.getIntervalHours())
                        .build())
                .collect(Collectors.toList());

        scheduleRepository.saveAll(schedules);

        return medicineMapper.toResponse(medicine, schedules);
    }


    public List<MedicineResponseDTO> getMedicines(
            String userId,
            MedicineCategory category,
            String period
    ) {

        List<Medicine> medicines;

        if (category == null) {

            medicines =
                    medicineRepository
                            .findByUserIdAndStatusAndIsDeletedFalseOrderByCreatedAtDesc(
                                    userId,
                                    MedicineStatus.ACTIVE
                            );

        } else if (category == MedicineCategory.QUICK) {

            medicines =
                    medicineRepository
                            .findByUserIdAndMedicineCategoryAndStatusAndIsDeletedFalseOrderByCreatedAtDesc(
                                    userId,
                                    category,
                                    MedicineStatus.ACTIVE
                            );

        } else if (period != null) {

            ScheduleType scheduleType =
                    ScheduleType.valueOf(period.toUpperCase());

            medicines =
                    medicineRepository.findRoutineByPeriod(
                            userId,
                            scheduleType
                    );

        } else {

            medicines =
                    medicineRepository
                            .findByUserIdAndMedicineCategoryAndStatusAndIsDeletedFalseOrderByCreatedAtDesc(
                                    userId,
                                    category,
                                    MedicineStatus.ACTIVE
                            );
        }


        return medicines.stream()
                .map(m -> medicineMapper.toResponse(
                        m,
                        scheduleRepository
                                .findByUserMedicineIdAndIsDeletedFalse(
                                        m.getId()
                                )
                ))
                .collect(Collectors.toList());
    }


    public MedicineResponseDTO getMedicineById(
            String userId,
            String medicineId
    ) {

        Medicine medicine =
                medicineRepository
                        .findByIdAndUserIdAndIsDeletedFalse(
                                medicineId,
                                userId
                        )
                        .orElseThrow(() ->
                                new RuntimeException("Medicine not found")
                        );


        List<MedicineSchedule> schedules =
                scheduleRepository
                        .findByUserMedicineIdAndIsDeletedFalse(
                                medicine.getId()
                        );


        return medicineMapper.toResponse(medicine, schedules);
    }


    @Transactional
    public MedicineResponseDTO updateMedicine(
            String userId,
            String medicineId,
            EditMedicineDTO dto
    ) {

        Medicine medicine =
                medicineRepository
                        .findByIdAndUserIdAndIsDeletedFalse(
                                medicineId,
                                userId
                        )
                        .orElseThrow(() ->
                                new RuntimeException("Medicine not found")
                        );


        medicine.setMedicineName(dto.getMedicineName());
        medicine.setMedicineType(dto.getMedicineType());
        medicine.setFrequencyType(dto.getFrequencyType());
        medicine.setIntakeInstruction(dto.getIntakeInstruction());
        medicine.setStartDate(dto.getStartDate());
        medicine.setEndDate(dto.getEndDate());
        medicine.setNotes(dto.getNotes());

        medicineRepository.save(medicine);


        List<MedicineSchedule> schedules =
                scheduleRepository
                        .findByUserMedicineIdAndIsDeletedFalse(
                                medicine.getId()
                        );


        return medicineMapper.toResponse(medicine, schedules);
    }


    @Transactional
    public MedicineResponseDTO updateSchedule(
            String userId,
            String scheduleId,
            UpdateScheduleDTO dto
    ) {

        MedicineSchedule schedule =
                scheduleRepository.findById(scheduleId)
                        .orElseThrow(() ->
                                new RuntimeException("Schedule not found")
                        );


        Medicine medicine =
                medicineRepository
                        .findByIdAndUserIdAndIsDeletedFalse(
                                schedule.getUserMedicineId(),
                                userId
                        )
                        .orElseThrow(() ->
                                new RuntimeException("Medicine not found")
                        );


        schedule.setScheduleTime(dto.getScheduleTime());
        schedule.setScheduleType(dto.getScheduleType());
        schedule.setDayOfWeek(dto.getDayOfWeek());
        schedule.setIntervalHours(dto.getIntervalHours());

        scheduleRepository.save(schedule);


        return medicineMapper.toResponse(
                medicine,
                scheduleRepository
                        .findByUserMedicineIdAndIsDeletedFalse(
                                medicine.getId()
                        )
        );
    }


    public void deleteMedicine(String userId, String medicineId) {

        Medicine medicine =
                medicineRepository
                        .findByIdAndUserIdAndIsDeletedFalse(
                                medicineId,
                                userId
                        )
                        .orElseThrow(() ->
                                new RuntimeException("Medicine not found")
                        );

     medicine.setIsDeleted(true);

medicineRepository.save(medicine);

List<MedicineIntakeLog> logs =
        intakeLogRepository
                .findByUserMedicineIdAndIsDeletedFalse(
                        medicine.getId()
                );

logs.forEach(log -> {
    log.setIsDeleted(true);
});

intakeLogRepository.saveAll(logs);

adherenceCalculationService.recalculate(
        userId,
        LocalDate.now()
);
    }


    public void pauseMedicine(String userId, String medicineId) {

        Medicine medicine =
                medicineRepository
                        .findByIdAndUserIdAndIsDeletedFalse(
                                medicineId,
                                userId
                        )
                        .orElseThrow();

        medicine.setStatus(MedicineStatus.STOPPED);

        medicineRepository.save(medicine);
    }


    public void resumeMedicine(String userId, String medicineId) {

        Medicine medicine =
                medicineRepository
                        .findByIdAndUserIdAndIsDeletedFalse(
                                medicineId,
                                userId
                        )
                        .orElseThrow();

        medicine.setStatus(MedicineStatus.ACTIVE);

        medicineRepository.save(medicine);
    }


    public void archiveMedicine(String userId, String medicineId) {

        Medicine medicine =
                medicineRepository
                        .findByIdAndUserIdAndIsDeletedFalse(
                                medicineId,
                                userId
                        )
                        .orElseThrow();

        medicine.setStatus(MedicineStatus.ARCHIVED);

        medicineRepository.save(medicine);

adherenceCalculationService.recalculate(
        userId,
        LocalDate.now()
);
    }


    public void unarchiveMedicine(String userId, String medicineId) {

        Medicine medicine =
                medicineRepository
                        .findByIdAndUserIdAndIsDeletedFalse(
                                medicineId,
                                userId
                        )
                        .orElseThrow();

        medicine.setStatus(MedicineStatus.ACTIVE);

       medicineRepository.save(medicine);

adherenceCalculationService.recalculate(
        userId,
        LocalDate.now()
);
    }


    public List<MedicineResponseDTO> getArchivedMedicines(String userId) {

        return medicineRepository
                .findByUserIdAndStatusAndIsDeletedFalseOrderByCreatedAtDesc(
                        userId,
                        MedicineStatus.ARCHIVED
                )
                .stream()
                .map(m -> medicineMapper.toResponse(
                        m,
                        scheduleRepository
                                .findByUserMedicineIdAndIsDeletedFalse(
                                        m.getId()
                                )
                ))
                .collect(Collectors.toList());
    }
}