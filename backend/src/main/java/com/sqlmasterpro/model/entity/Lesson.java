package com.sqlmasterpro.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "lessons")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "lesson_seq")
    @SequenceGenerator(name = "lesson_seq", sequenceName = "lessons_seq", allocationSize = 1)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "video_url")
    private String videoUrl;

    @Column(name = "order_index")
    @Builder.Default
    private int orderIndex = 0;

    @Column(name = "duration_minutes")
    @Builder.Default
    private int durationMinutes = 0;

    @Column(name = "is_premium", nullable = false)
    @Builder.Default
    private boolean premium = false;

    @Column(name = "is_published", nullable = false)
    @Builder.Default
    private boolean published = false;

    @Column(name = "lesson_type", length = 50)
    @Builder.Default
    private String lessonType = "TEXT"; // TEXT, VIDEO, INTERACTIVE

    @Column(name = "sql_examples", columnDefinition = "TEXT")
    private String sqlExamples;

    @Column(name = "key_points", columnDefinition = "TEXT")
    private String keyPoints;

    @Column(name = "xp_reward")
    @Builder.Default
    private int xpReward = 10;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    @JsonIgnore
    private Course course;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
