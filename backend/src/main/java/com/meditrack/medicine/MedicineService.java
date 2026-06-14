package com.meditrack.medicine;

import com.meditrack.enums.MedicineCategory;
import com.meditrack.enums.MedicineStatus;
import com.meditrack.enums.ScheduleType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicineService {

    private final MedicineRepository medicineRepository;
    private final MedicineScheduleRepository scheduleRepository;
    private final MedicineMapper medicineMapper;

    @Transactional
    public MedicineResponseDTO addMedicine(String userId, AddMedicineDTO dto) {
        Medicine medicine = Medicine.builder()
                .userId(userId)
                .userDiseaseId(dto.getUserDiseaseId())
                .medicineName(dto.getMedicineName())
                .medicineCategory(dto.getMedicineCategory())
                .medicineType(dto.getMedicineType())
                .frequencyType(dto.getFrequencyType())
                .intakeInstruction(dto.getIntakeInstruction())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .notes(dto.getNotes())
                .build();

        medicineRepository.save(medicine);

        List<MedicineSchedule> schedules = dto.getSchedules().stream()
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

    public List<MedicineResponseDTO> getMedicines(String userId,
                                                   MedicineCategory category,
                                                   String period) {
        List<Medicine> medicines;

        if (category == null) {
            medicines = medicineRepository.findByUserIdAndIsDeletedFalse(userId);
        } else if (category == MedicineCategory.QUICK) {
            medicines = medicineRepository
                    .findByUserIdAndMedicineCategoryAndIsDeletedFalse(userId, category);
        } else if (period != null) {
            ScheduleType scheduleType = ScheduleType.valueOf(period.toUpperCase());
            medicines = medicineRepository.findRoutineByPeriod(userId, scheduleType);
        } else {
            medicines = medicineRepository
                    .findByUserIdAndMedicineCategoryAndIsDeletedFalse(userId, category);
        }

        return medicines.stream()
                .map(m -> medicineMapper.toResponse(m,
                        scheduleRepository.findByUserMedicineIdAndIsDeletedFalse(m.getId())))
                .collect(Collectors.toList());
    }

    public MedicineResponseDTO getMedicineById(String userId, String medicineId) {
        Medicine medicine = medicineRepository
                .findByIdAndUserIdAndIsDeletedFalse(medicineId, userId)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        List<MedicineSchedule> schedules =
                scheduleRepository.findByUserMedicineIdAndIsDeletedFalse(medicine.getId());

        return medicineMapper.toResponse(medicine, schedules);
    }

    @Transactional
    public MedicineResponseDTO updateMedicine(String userId, String medicineId,
                                               EditMedicineDTO dto) {
        Medicine medicine = medicineRepository
                .findByIdAndUserIdAndIsDeletedFalse(medicineId, userId)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        medicine.setMedicineName(dto.getMedicineName());
        medicine.setMedicineType(dto.getMedicineType());
        medicine.setFrequencyType(dto.getFrequencyType());
        medicine.setIntakeInstruction(dto.getIntakeInstruction());
        medicine.setStartDate(dto.getStartDate());
        medicine.setEndDate(dto.getEndDate());
        medicine.setNotes(dto.getNotes());
        medicineRepository.save(medicine);

        List<MedicineSchedule> schedules =
                scheduleRepository.findByUserMedicineIdAndIsDeletedFalse(medicine.getId());

        return medicineMapper.toResponse(medicine, schedules);
    }

    public void deleteMedicine(String userId, String medicineId) {
        Medicine medicine = medicineRepository
                .findByIdAndUserIdAndIsDeletedFalse(medicineId, userId)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));
        medicine.setIsDeleted(true);
        medicineRepository.save(medicine);
    }

    public void pauseMedicine(String userId, String medicineId) {
        Medicine medicine = medicineRepository
                .findByIdAndUserIdAndIsDeletedFalse(medicineId, userId)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));
        medicine.setStatus(MedicineStatus.STOPPED);
        medicineRepository.save(medicine);
    }

    public void resumeMedicine(String userId, String medicineId) {
        Medicine medicine = medicineRepository
                .findByIdAndUserIdAndIsDeletedFalse(medicineId, userId)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));
        medicine.setStatus(MedicineStatus.ACTIVE);
        medicineRepository.save(medicine);
    }

    public void archiveMedicine(String userId, String medicineId) {
        Medicine medicine = medicineRepository
                .findByIdAndUserIdAndIsDeletedFalse(medicineId, userId)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));
        medicine.setStatus(MedicineStatus.ARCHIVED);
        medicineRepository.save(medicine);
    }

    public void unarchiveMedicine(String userId, String medicineId) {
        Medicine medicine = medicineRepository
                .findByIdAndUserIdAndIsDeletedFalse(medicineId, userId)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));
        medicine.setStatus(MedicineStatus.ACTIVE);
        medicineRepository.save(medicine);
    }

    public List<MedicineResponseDTO> getArchivedMedicines(String userId) {
        return medicineRepository
                .findByUserIdAndStatusAndIsDeletedFalse(userId, MedicineStatus.ARCHIVED)
                .stream()
                .map(m -> medicineMapper.toResponse(m,
                        scheduleRepository.findByUserMedicineIdAndIsDeletedFalse(m.getId())))
                .collect(Collectors.toList());
    }
}