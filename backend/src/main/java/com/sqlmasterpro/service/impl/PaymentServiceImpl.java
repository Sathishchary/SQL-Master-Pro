package com.sqlmasterpro.service.impl;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.sqlmasterpro.exception.BadRequestException;
import com.sqlmasterpro.exception.ResourceNotFoundException;
import com.sqlmasterpro.model.dto.request.PaymentRequest;
import com.sqlmasterpro.model.dto.response.PaymentOrderResponse;
import com.sqlmasterpro.model.entity.Payment;
import com.sqlmasterpro.model.entity.User;
import com.sqlmasterpro.model.enums.SubscriptionPlan;
import com.sqlmasterpro.repository.PaymentRepository;
import com.sqlmasterpro.repository.UserRepository;
import com.sqlmasterpro.service.EmailService;
import com.sqlmasterpro.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Value("${razorpay.key-id}")
    private String razorpayKeyId;

    @Value("${razorpay.key-secret}")
    private String razorpayKeySecret;

    @Value("${razorpay.webhook-secret:}")
    private String webhookSecret;

    @Value("${app.upi-id:sathishcharykotha@okaxis}")
    private String upiId;

    @Value("${app.upi-name:SQL+Master+Pro}")
    private String upiName;

    // ── Razorpay order creation ──────────────────────────────────────────────

    @Override
    @Transactional
    public PaymentOrderResponse createOrder(Long userId, PaymentRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        try {
            RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", request.getAmount().multiply(BigDecimal.valueOf(100)).intValue());
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "rcpt_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12));
            orderRequest.put("notes", new JSONObject()
                .put("userId", userId)
                .put("plan", request.getPlan())
                .put("duration", request.getDuration()));

            Order order = client.orders.create(orderRequest);
            String invoiceNumber = "INV-" + System.currentTimeMillis();

            Payment payment = Payment.builder()
                .user(user)
                .razorpayOrderId(order.get("id"))
                .amount(request.getAmount())
                .currency("INR")
                .status("PENDING")
                .subscriptionPlan(SubscriptionPlan.valueOf(request.getPlan()))
                .planDuration(request.getDuration())
                .invoiceNumber(invoiceNumber)
                .couponCode(request.getCouponCode())
                .build();

            paymentRepository.save(payment);

            return PaymentOrderResponse.builder()
                .orderId(order.get("id"))
                .amount(request.getAmount())
                .currency("INR")
                .razorpayKeyId(razorpayKeyId)
                .userName(user.getFullName())
                .userEmail(user.getEmail())
                .invoiceNumber(invoiceNumber)
                .upiId(upiId)
                .upiName(upiName)
                .build();

        } catch (Exception e) {
            log.error("Failed to create Razorpay order: {}", e.getMessage());
            throw new BadRequestException("Payment order creation failed: " + e.getMessage());
        }
    }

    // ── Razorpay payment verification ────────────────────────────────────────

    @Override
    @Transactional
    public User verifyAndCompletePayment(String orderId, String paymentId, String signature) {
        Payment payment = paymentRepository.findByRazorpayOrderId(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order: " + orderId));

        if (!verifyRazorpaySignature(orderId, paymentId, signature)) {
            payment.setStatus("FAILED");
            payment.setUpdatedAt(LocalDateTime.now());
            paymentRepository.save(payment);
            throw new BadRequestException("Payment signature verification failed");
        }

        payment.setRazorpayPaymentId(paymentId);
        payment.setRazorpaySignature(signature);
        payment.setStatus("SUCCESS");
        payment.setUpdatedAt(LocalDateTime.now());

        LocalDateTime start = LocalDateTime.now();
        LocalDateTime end = "YEARLY".equals(payment.getPlanDuration())
            ? start.plusYears(1) : start.plusMonths(1);

        payment.setSubscriptionStart(start);
        payment.setSubscriptionEnd(end);
        paymentRepository.save(payment);

        User user = payment.getUser();
        user.setSubscriptionPlan(payment.getSubscriptionPlan());
        user.setSubscriptionExpiry(end);
        userRepository.save(user);

        emailService.sendPaymentSuccessEmail(
            user.getEmail(), user.getFirstName(),
            payment.getSubscriptionPlan().name(),
            payment.getInvoiceNumber()
        );

        log.info("Razorpay payment verified: {} for user {}", paymentId, user.getEmail());
        return user;
    }

    // ── UPI direct payment (manual verification) ─────────────────────────────

    @Override
    @Transactional
    public void createUpiPayment(Long userId, Map<String, String> body) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String plan     = body.getOrDefault("plan", "PRO");
        String duration = body.getOrDefault("duration", "MONTHLY");
        String utrId    = body.getOrDefault("upiTransactionId", "");
        BigDecimal amount = new BigDecimal(body.getOrDefault("amount", "0"));

        String invoiceNumber = "INV-UPI-" + System.currentTimeMillis();

        Payment payment = Payment.builder()
            .user(user)
            .amount(amount)
            .currency("INR")
            .status("PENDING_VERIFICATION")
            .subscriptionPlan(SubscriptionPlan.valueOf(plan))
            .planDuration(duration)
            .invoiceNumber(invoiceNumber)
            .notes("UPI_UTR:" + utrId)
            .build();

        paymentRepository.save(payment);
        log.info("UPI payment pending verification — user: {}, UTR: {}", user.getEmail(), utrId);
    }

    // ── Razorpay webhook ─────────────────────────────────────────────────────

    @Override
    public void processWebhook(String payload, String signature) {
        if (!webhookSecret.isBlank() && !verifyWebhookSignature(payload, signature)) {
            log.warn("Invalid Razorpay webhook signature — ignoring");
            return;
        }

        try {
            JSONObject event = new JSONObject(payload);
            String eventType = event.getString("event");
            log.info("Razorpay webhook event: {}", eventType);

            switch (eventType) {
                case "payment.captured" -> {
                    JSONObject entity = event.getJSONObject("payload")
                        .getJSONObject("payment").getJSONObject("entity");
                    handlePaymentCaptured(entity.getString("order_id"), entity.getString("id"));
                }
                case "payment.failed" -> {
                    JSONObject entity = event.getJSONObject("payload")
                        .getJSONObject("payment").getJSONObject("entity");
                    handlePaymentFailed(entity.getString("order_id"));
                }
                default -> log.debug("Unhandled webhook event: {}", eventType);
            }
        } catch (Exception e) {
            log.error("Error processing webhook: {}", e.getMessage());
        }
    }

    private void handlePaymentCaptured(String orderId, String paymentId) {
        paymentRepository.findByRazorpayOrderId(orderId).ifPresent(p -> {
            if (!"SUCCESS".equals(p.getStatus())) {
                p.setRazorpayPaymentId(paymentId);
                p.setStatus("SUCCESS");
                p.setUpdatedAt(LocalDateTime.now());
                paymentRepository.save(p);
                log.info("Webhook: captured payment {} for order {}", paymentId, orderId);
            }
        });
    }

    private void handlePaymentFailed(String orderId) {
        paymentRepository.findByRazorpayOrderId(orderId).ifPresent(p -> {
            if ("PENDING".equals(p.getStatus())) {
                p.setStatus("FAILED");
                p.setUpdatedAt(LocalDateTime.now());
                paymentRepository.save(p);
                log.info("Webhook: payment failed for order {}", orderId);
            }
        });
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private boolean verifyRazorpaySignature(String orderId, String paymentId, String signature) {
        try {
            String data = orderId + "|" + paymentId;
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(razorpayKeySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            String computed = HexFormat.of().formatHex(mac.doFinal(data.getBytes(StandardCharsets.UTF_8)));
            return computed.equals(signature);
        } catch (Exception e) {
            log.error("Signature verification error: {}", e.getMessage());
            return false;
        }
    }

    private boolean verifyWebhookSignature(String payload, String signature) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(webhookSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            String computed = HexFormat.of().formatHex(mac.doFinal(payload.getBytes(StandardCharsets.UTF_8)));
            return computed.equals(signature);
        } catch (Exception e) {
            log.error("Webhook signature error: {}", e.getMessage());
            return false;
        }
    }

    @Override
    public List<Payment> getUserPayments(Long userId) {
        return paymentRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
