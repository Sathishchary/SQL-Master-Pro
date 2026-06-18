package com.sqlmasterpro.repository;

import com.sqlmasterpro.model.entity.Quiz;
import com.sqlmasterpro.model.enums.DifficultyLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {

    List<Quiz> findByCourseIdAndPublishedTrue(Long courseId);
    Page<Quiz> findByPublishedTrueAndDifficulty(DifficultyLevel difficulty, Pageable pageable);
    Page<Quiz> findByPublishedTrue(Pageable pageable);
}
