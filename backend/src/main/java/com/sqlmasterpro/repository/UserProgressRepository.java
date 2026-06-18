package com.sqlmasterpro.repository;

import com.sqlmasterpro.model.entity.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {

    List<UserProgress> findByUserId(Long userId);
    List<UserProgress> findByUserIdAndCourseId(Long userId, Long courseId);
    Optional<UserProgress> findByUserIdAndLessonId(Long userId, Long lessonId);

    @Query("SELECT COUNT(p) FROM UserProgress p WHERE p.user.id = :userId AND p.completed = true")
    long countCompletedLessonsByUserId(Long userId);

    @Query("SELECT COUNT(p) FROM UserProgress p WHERE p.user.id = :userId AND p.course.id = :courseId AND p.completed = true")
    long countCompletedLessonsByCourseId(Long userId, Long courseId);

    @Query("SELECT SUM(p.xpEarned) FROM UserProgress p WHERE p.user.id = :userId")
    Long sumXpByUserId(Long userId);

    boolean existsByUserIdAndLessonIdAndCompleted(Long userId, Long lessonId, boolean completed);
}
