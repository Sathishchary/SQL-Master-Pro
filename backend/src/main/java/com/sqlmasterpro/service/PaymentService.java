package com.sqlmasterpro.service;

import com.sqlmasterpro.model.dto.request.PaymentRequest;
import com.sqlmasterpro.model.dto.response.PaymentOrderResponse;
import com.sqlmasterpro.model.entity.Payment;
import com.sqlmasterpro.model.entity.User;

import java.util.List;
import java.util.Map;

public interface PaymentService {
    PaymentOrderResponse createOrder(Long userId, PaymentRequest request);
    User verifyAndCompletePayment(String orderId, String paymentId, String signature);
    void createUpiPayment(Long userId, Map<String, String> body);
    void processWebhook(String payload, String signature);
    List<Payment> getUserPayments(Long userId);
}
