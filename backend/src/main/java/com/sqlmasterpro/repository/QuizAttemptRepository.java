package com.sqlmasterpro.repository;

import com.sqlmasterpro.model.entity.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {

    List<QuizAttempt> findByUserIdOrderByAttemptedAtDesc(Long userId);
    List<QuizAttempt> findByUserIdAndQuizId(Long userId, Long quizId);

    @Query("SELECT AVG(a.score) FROM QuizAttempt a WHERE a.user.id = :userId")
    Double findAvgScoreByUserId(Long userId);

    @Query("SELECT COUNT(a) FROM QuizAttempt a WHERE a.user.id = :userId AND a.passed = true")
    long countPassedByUserId(Long userId);

    @Query("SELECT a FROM QuizAttempt a WHERE a.quiz.id = :quizId ORDER BY a.score DESC")
    List<QuizAttempt> findTopByQuizId(Long quizId, org.springframework.data.domain.Pageable pageable);
}
