package com.sqlmasterpro.repository;

import com.sqlmasterpro.model.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<Payment> findByRazorpayOrderId(String orderId);
    Optional<Payment> findByRazorpayPaymentId(String paymentId);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'SUCCESS'")
    BigDecimal sumSuccessfulPayments();

    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = 'SUCCESS'")
    long countSuccessfulPayments();
}
