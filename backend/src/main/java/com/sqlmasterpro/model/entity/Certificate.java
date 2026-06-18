package com.sqlmasterpro.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "certificates", indexes = {
    @Index(name = "idx_cert_user", columnList = "user_id"),
    @Index(name = "idx_cert_number", columnList = "certificate_number", unique = true)
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "cert_seq")
    @SequenceGenerator(name = "cert_seq", sequenceName = "certificates_seq", allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(name = "certificate_number", unique = true, nullable = false, length = 50)
    private String certificateNumber;

    @Column(name = "qr_code_data", columnDefinition = "TEXT")
    private String qrCodeData;

    @Column(name = "pdf_url")
    private String pdfUrl;

    @Column(name = "completion_score")
    @Builder.Default
    private int completionScore = 0;

    @Column(name = "grade", length = 10)
    private String grade;

    @Column(name = "valid", nullable = false)
    @Builder.Default
    private boolean valid = true;

    @CreationTimestamp
    @Column(name = "issued_at", nullable = false, updatable = false)
    private LocalDateTime issuedAt;
}
