
package com.meditrack.auth;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ResetPasswordDTO {

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "OTP is required")
    private String otp;

    @NotBlank(message = "New password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String newPassword;
}