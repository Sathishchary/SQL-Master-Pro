package com.sqlmasterpro.model.entity;

import com.sqlmasterpro.model.enums.DifficultyLevel;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "challenges")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Challenge {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "challenge_seq")
    @SequenceGenerator(name = "challenge_seq", sequenceName = "challenges_seq", allocationSize = 1)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "problem_statement", columnDefinition = "TEXT")
    private String problemStatement;

    @Column(name = "starter_query", columnDefinition = "TEXT")
    private String starterQuery;

    @Column(name = "expected_output", columnDefinition = "TEXT")
    private String expectedOutput;

    @Column(name = "solution_query", columnDefinition = "TEXT")
    private String solutionQuery;

    @Column(name = "hints", columnDefinition = "TEXT")
    private String hints;

    @Column(name = "explanation", columnDefinition = "TEXT")
    private String explanation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private DifficultyLevel difficulty = DifficultyLevel.EASY;

    @Column(name = "points")
    @Builder.Default
    private int points = 10;

    @Column(name = "xp_reward")
    @Builder.Default
    private int xpReward = 20;

    @Column(name = "topic", length = 100)
    private String topic;

    @Column(name = "database_name", length = 50)
    @Builder.Default
    private String databaseName = "employee_db";

    @Column(name = "is_premium", nullable = false)
    @Builder.Default
    private boolean premium = false;

    @Column(name = "is_published", nullable = false)
    @Builder.Default
    private boolean published = true;

    @Column(name = "total_submissions")
    @Builder.Default
    private int totalSubmissions = 0;

    @Column(name = "successful_submissions")
    @Builder.Default
    private int successfulSubmissions = 0;

    @Column(name = "order_index")
    @Builder.Default
    private int orderIndex = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
