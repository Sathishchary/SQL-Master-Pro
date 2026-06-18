package com.sqlmasterpro.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "quiz_attempts", indexes = {
    @Index(name = "idx_attempt_user", columnList = "user_id"),
    @Index(name = "idx_attempt_quiz", columnList = "quiz_id")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class QuizAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "attempt_seq")
    @SequenceGenerator(name = "attempt_seq", sequenceName = "quiz_attempts_seq", allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @Column(nullable = false)
    @Builder.Default
    private int score = 0;

    @Column(name = "total_questions", nullable = false)
    @Builder.Default
    private int totalQuestions = 0;

    @Column(name = "correct_answers")
    @Builder.Default
    private int correctAnswers = 0;

    @Column(name = "time_taken_seconds")
    @Builder.Default
    private int timeTakenSeconds = 0;

    @Column(nullable = false)
    @Builder.Default
    private boolean passed = false;

    @Column(name = "xp_earned")
    @Builder.Default
    private int xpEarned = 0;

    @Column(name = "answers_json", columnDefinition = "TEXT")
    private String answersJson;

    @CreationTimestamp
    @Column(name = "attempted_at", nullable = false, updatable = false)
    private LocalDateTime attemptedAt;
}
