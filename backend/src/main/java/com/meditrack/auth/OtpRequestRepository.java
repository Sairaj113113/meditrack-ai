// placeholder 
package com.meditrack.auth;

import com.meditrack.enums.OtpType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface OtpRequestRepository extends JpaRepository<OtpRequest, String> {

    Optional<OtpRequest> findTopByUserIdAndOtpTypeAndIsUsedFalseOrderByCreatedAtDesc(
            String userId, OtpType otpType);

    void deleteByUserId(String userId);
}