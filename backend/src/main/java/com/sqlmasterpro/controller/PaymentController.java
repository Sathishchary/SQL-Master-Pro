package com.sqlmasterpro.controller;

import com.sqlmasterpro.model.dto.request.PaymentRequest;
import com.sqlmasterpro.model.dto.response.ApiResponse;
import com.sqlmasterpro.model.dto.response.PaymentOrderResponse;
import com.sqlmasterpro.model.entity.Payment;
import com.sqlmasterpro.model.entity.User;
import com.sqlmasterpro.security.UserPrincipal;
import com.sqlmasterpro.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Payments", description = "Razorpay + UPI payment APIs")
public class PaymentController {

    private final PaymentService paymentService;

    // ── Razorpay ─────────────────────────────────────────────────────────────

    @PostMapping("/create-order")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Create a Razorpay payment order")
    public ResponseEntity<ApiResponse<PaymentOrderResponse>> createOrder(
            @Valid @RequestBody PaymentRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        PaymentOrderResponse response = paymentService.createOrder(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Order created", response));
    }

    @PostMapping("/verify")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Verify Razorpay payment and activate subscription")
    public ResponseEntity<ApiResponse<Map<String, Object>>> verifyPayment(
            @RequestBody Map<String, String> body) {
        // Razorpay handler sends camelCase keys
        User user = paymentService.verifyAndCompletePayment(
            body.get("razorpayOrderId"),
            body.get("razorpayPaymentId"),
            body.get("razorpaySignature")
        );
        return ResponseEntity.ok(ApiResponse.success("Payment verified and subscription activated",
            Map.of("user", user)));
    }

    // ── UPI direct payment ────────────────────────────────────────────────────

    @PostMapping("/verify-upi")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Submit UPI transaction ID for manual verification")
    public ResponseEntity<ApiResponse<Map<String, String>>> verifyUpiPayment(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserPrincipal principal) {
        paymentService.createUpiPayment(principal.getId(), body);
        return ResponseEntity.ok(ApiResponse.success("UPI payment submitted",
            Map.of(
                "status", "PENDING_VERIFICATION",
                "message", "Your payment will be verified within 24 hours and your subscription will be activated."
            )));
    }

    // ── Razorpay webhook ──────────────────────────────────────────────────────

    @PostMapping("/webhook")
    @Operation(summary = "Razorpay webhook endpoint")
    public ResponseEntity<String> handleWebhook(
            @RequestBody String payload,
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String signature) {
        log.info("Received Razorpay webhook");
        try {
            if (signature != null && !signature.isBlank()) {
                paymentService.processWebhook(payload, signature);
            }
        } catch (Exception e) {
            log.error("Webhook handler error: {}", e.getMessage());
        }
        return ResponseEntity.ok("OK"); // Always 200 so Razorpay doesn't retry
    }

    // ── Payment history & plans ───────────────────────────────────────────────

    @GetMapping("/history")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get payment history")
    public ResponseEntity<ApiResponse<List<Payment>>> getHistory(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<Payment> payments = paymentService.getUserPayments(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(payments));
    }

    @GetMapping("/plans")
    @Operation(summary = "Get subscription plans")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getPlans() {
        List<Map<String, Object>> plans = List.of(
            Map.of("id", "FREE", "name", "Free", "price_monthly", 0, "price_yearly", 0,
                "features", List.of("10 Lessons/month", "5 Quiz attempts", "Basic SQL Editor", "Community access")),
            Map.of("id", "BASIC", "name", "Basic", "price_monthly", 499, "price_yearly", 4999,
                "features", List.of("50 Lessons/month", "Unlimited quizzes", "All SQL Editors", "Certificate", "Email support")),
            Map.of("id", "PRO", "name", "Pro", "price_monthly", 999, "price_yearly", 9999,
                "popular", true,
                "features", List.of("Unlimited Lessons", "300+ Challenges", "Mock interviews", "Priority support", "All Certificates", "AI SQL Assistant")),
            Map.of("id", "ENTERPRISE", "name", "Enterprise", "price_monthly", 2999, "price_yearly", 24999,
                "features", List.of("Everything in Pro", "Team management", "Custom learning paths", "Dedicated support", "Analytics dashboard", "API Access"))
        );
        return ResponseEntity.ok(ApiResponse.success(plans));
    }
}
