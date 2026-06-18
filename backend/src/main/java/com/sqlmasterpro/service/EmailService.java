package com.sqlmasterpro.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendVerificationEmail(String to, String name, String token) {
        String subject = "Verify Your SQL Master Pro Account";
        String verifyUrl = frontendUrl + "/auth/verify-email?token=" + token;
        String html = buildVerificationEmail(name, verifyUrl);
        sendHtmlEmail(to, subject, html);
    }

    @Async
    public void sendPasswordResetEmail(String to, String name, String token) {
        String subject = "Reset Your SQL Master Pro Password";
        String resetUrl = frontendUrl + "/auth/reset-password?token=" + token;
        String html = buildPasswordResetEmail(name, resetUrl);
        sendHtmlEmail(to, subject, html);
    }

    @Async
    public void sendCertificateEmail(String to, String name, String courseName, String certificateUrl) {
        String subject = "Congratulations! Your SQL Master Pro Certificate is Ready";
        String html = buildCertificateEmail(name, courseName, certificateUrl);
        sendHtmlEmail(to, subject, html);
    }

    @Async
    public void sendPaymentSuccessEmail(String to, String name, String plan, String invoiceNumber) {
        String subject = "Payment Confirmed - SQL Master Pro " + plan + " Plan";
        String html = buildPaymentEmail(name, plan, invoiceNumber);
        sendHtmlEmail(to, subject, html);
    }

    private void sendHtmlEmail(String to, String subject, String html) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail, "SQL Master Pro");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);
            mailSender.send(message);
            log.info("Email sent to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }

    private String buildVerificationEmail(String name, String url) {
        return """
            <!DOCTYPE html>
            <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); padding: 30px; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0;">SQL Master Pro</h1>
              </div>
              <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
                <h2>Welcome, %s!</h2>
                <p>Thank you for joining SQL Master Pro. Please verify your email to get started.</p>
                <a href="%s" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">
                  Verify Email
                </a>
                <p style="color: #666; font-size: 14px;">This link expires in 24 hours. If you didn't register, please ignore this email.</p>
              </div>
            </body>
            </html>
            """.formatted(name, url);
    }

    private String buildPasswordResetEmail(String name, String url) {
        return """
            <!DOCTYPE html>
            <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); padding: 30px; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0;">SQL Master Pro</h1>
              </div>
              <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
                <h2>Password Reset Request</h2>
                <p>Hi %s, we received a request to reset your password.</p>
                <a href="%s" style="background: #e53e3e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">
                  Reset Password
                </a>
                <p style="color: #666; font-size: 14px;">This link expires in 1 hour. If you didn't request this, please ignore this email.</p>
              </div>
            </body>
            </html>
            """.formatted(name, url);
    }

    private String buildCertificateEmail(String name, String course, String url) {
        return """
            <!DOCTYPE html>
            <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #48bb78 0%%, #38a169 100%%); padding: 30px; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0;">Congratulations!</h1>
              </div>
              <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
                <h2>%s, you earned a certificate!</h2>
                <p>You have successfully completed <strong>%s</strong> on SQL Master Pro.</p>
                <a href="%s" style="background: #48bb78; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">
                  Download Certificate
                </a>
              </div>
            </body>
            </html>
            """.formatted(name, course, url);
    }

    private String buildPaymentEmail(String name, String plan, String invoice) {
        return """
            <!DOCTYPE html>
            <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); padding: 30px; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0;">Payment Confirmed</h1>
              </div>
              <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
                <h2>Thank you, %s!</h2>
                <p>Your payment for <strong>%s Plan</strong> has been confirmed.</p>
                <p>Invoice Number: <strong>%s</strong></p>
                <p>Start learning SQL at the professional level today!</p>
              </div>
            </body>
            </html>
            """.formatted(name, plan, invoice);
    }
}
