package com.sqlmasterpro.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PaymentRequest {
    @NotNull
    private BigDecimal amount;

    @NotBlank
    private String plan; // BASIC, PRO, ENTERPRISE

    @NotBlank
    private String duration; // MONTHLY, YEARLY

    private String couponCode;
}
