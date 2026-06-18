package com.sqlmasterpro.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sqlmasterpro.model.enums.DifficultyLevel;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quizzes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "quiz_seq")
    @SequenceGenerator(name = "quiz_seq", sequenceName = "quizzes_seq", allocationSize = 1)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private DifficultyLevel difficulty = DifficultyLevel.BEGINNER;

    @Column(name = "time_limit_minutes")
    @Builder.Default
    private int timeLimitMinutes = 30;

    @Column(name = "pass_score")
    @Builder.Default
    private int passScore = 70;

    @Column(name = "is_published", nullable = false)
    @Builder.Default
    private boolean published = false;

    @Column(name = "is_premium", nullable = false)
    @Builder.Default
    private boolean premium = false;

    @Column(name = "randomize_questions", nullable = false)
    @Builder.Default
    private boolean randomizeQuestions = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    @JsonIgnore
    private Course course;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @Builder.Default
    private List<Question> questions = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
