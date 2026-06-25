package com.meditrack.medicine;

import com.meditrack.enums.FrequencyType;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDate;

@Component
public class MedicineScheduleEvaluator {

    public boolean isDueToday(
            Medicine medicine,
            MedicineSchedule schedule,
            LocalDate today
    ) {

        if (medicine == null || schedule == null) {
            return false;
        }

        if (medicine.getStartDate() != null &&
                medicine.getStartDate().isAfter(today)) {
            return false;
        }

        if (medicine.getEndDate() != null &&
                medicine.getEndDate().isBefore(today)) {
            return false;
        }

        FrequencyType frequency = medicine.getFrequencyType();

        switch (frequency) {

            case DAILY:
                return true;

            case WEEKLY:
                if (schedule.getDayOfWeek() == null) {
                    return false;
                }

                return schedule.getDayOfWeek().name()
                        .equals(today.getDayOfWeek().name());

            case CUSTOM:
                if (schedule.getDayOfWeek() == null) {
                    return false;
                }

                return schedule.getDayOfWeek().name()
                        .equals(today.getDayOfWeek().name());

            case INTERVAL:
                // TODO
                return true;

            default:
                return false;
        }
    }
}