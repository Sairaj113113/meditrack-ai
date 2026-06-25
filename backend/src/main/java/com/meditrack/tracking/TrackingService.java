package com.meditrack.tracking;

import com.meditrack.adherence.AdherenceCalculationService;
import com.meditrack.enums.MarkedBy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrackingService {

    private final MedicineIntakeLogRepository intakeLogRepository;
    private final TrackingMapper trackingMapper;
    private final AdherenceCalculationService adherenceCalculationService;

    @Transactional
    public MedicineLogDTO logIntake(String userId, MedicineLogDTO dto) {

        LocalDate intakeDate =
                dto.getIntakeDate() != null
                        ? dto.getIntakeDate()
                        : LocalDate.now();

        System.out.println("=================================");
        System.out.println("MedicineId = " + dto.getUserMedicineId());
        System.out.println("Date = " + intakeDate);
        System.out.println("Time = " + dto.getScheduledTime());
        System.out.println("Action = " + dto.getAction());
        System.out.println("=================================");

        var existing =
                intakeLogRepository
                        .findFirstByUserMedicineIdAndIntakeDateAndScheduledTime(
                                dto.getUserMedicineId(),
                                intakeDate,
                                dto.getScheduledTime()
                        );

        System.out.println("FOUND EXISTING = " + existing.isPresent());

        MedicineIntakeLog log =
                existing.orElse(
                        MedicineIntakeLog.builder()
                                .userId(userId)
                                .userMedicineId(dto.getUserMedicineId())
                                .intakeDate(intakeDate)
                                .scheduledTime(dto.getScheduledTime())
                                .build()
                );

        log.setAction(dto.getAction());
        log.setMarkedBy(
                dto.getMarkedBy() != null
                        ? dto.getMarkedBy()
                        : MarkedBy.USER
        );
        log.setActionTime(LocalDateTime.now());

        intakeLogRepository.save(log);

        adherenceCalculationService.recalculate(
                userId,
                intakeDate
        );

        return trackingMapper.toDTO(log);
    }

    public List<MedicineLogDTO> getLogsForDate(
            String userId,
            LocalDate date
    ) {
        return intakeLogRepository
                .findByUserIdAndIntakeDate(userId, date)
                .stream()
                .map(trackingMapper::toDTO)
                .collect(Collectors.toList());
    }
}