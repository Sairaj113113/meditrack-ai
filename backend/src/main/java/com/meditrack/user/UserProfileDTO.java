package com.meditrack.user;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
public class UserProfileDTO {

    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String mobile;
    private String timezone;
    private Boolean emailVerified;
    private String accountStatus;
    private LocalDateTime lastLoginAt;
}