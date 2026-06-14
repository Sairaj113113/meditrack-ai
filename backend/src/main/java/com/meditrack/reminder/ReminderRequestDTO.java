package com.meditrack.reminder;
import jakarta.validation.constraints.Min;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReminderRequestDTO {

    private String skipReason;

    @Min(value = 1, message = "Snooze minutes must be greater than 0")
    private Integer minutes;
}