package com.sqlmasterpro.model.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class PaymentOrderResponse {
    private String orderId;
    private BigDecimal amount;
    private String currency;
    private String razorpayKeyId;
    private String userName;
    private String userEmail;
    private String invoiceNumber;
    private String upiId;
    private String upiName;
}
