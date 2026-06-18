package com.sqlmasterpro.repository;

import com.sqlmasterpro.model.entity.Question;
import com.sqlmasterpro.model.enums.DifficultyLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findByQuizIdAndPublishedTrue(Long quizId);

    @Query("SELECT q FROM Question q WHERE q.published = true AND q.difficulty = :difficulty ORDER BY RANDOM()")
    List<Question> findRandomByDifficulty(DifficultyLevel difficulty, org.springframework.data.domain.Pageable pageable);

    long countByDifficulty(DifficultyLevel difficulty);
    long countByPublishedTrue();
}
