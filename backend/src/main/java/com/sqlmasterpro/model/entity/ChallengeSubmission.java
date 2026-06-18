package com.sqlmasterpro.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "challenge_submissions", indexes = {
    @Index(name = "idx_submission_user", columnList = "user_id"),
    @Index(name = "idx_submission_challenge", columnList = "challenge_id")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ChallengeSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "submission_seq")
    @SequenceGenerator(name = "submission_seq", sequenceName = "challenge_submissions_seq", allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "challenge_id", nullable = false)
    private Challenge challenge;

    @Column(name = "submitted_query", nullable = false, columnDefinition = "TEXT")
    private String submittedQuery;

    @Column(nullable = false)
    @Builder.Default
    private boolean correct = false;

    @Column(name = "execution_time_ms")
    @Builder.Default
    private long executionTimeMs = 0;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "points_earned")
    @Builder.Default
    private int pointsEarned = 0;

    @Column(name = "xp_earned")
    @Builder.Default
    private int xpEarned = 0;

    @CreationTimestamp
    @Column(name = "submitted_at", nullable = false, updatable = false)
    private LocalDateTime submittedAt;
}
