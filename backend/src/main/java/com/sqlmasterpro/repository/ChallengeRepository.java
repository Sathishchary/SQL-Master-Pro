package com.sqlmasterpro.repository;

import com.sqlmasterpro.model.entity.Challenge;
import com.sqlmasterpro.model.enums.DifficultyLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChallengeRepository extends JpaRepository<Challenge, Long> {

    Page<Challenge> findByPublishedTrueAndDifficulty(DifficultyLevel difficulty, Pageable pageable);
    Page<Challenge> findByPublishedTrue(Pageable pageable);
    List<Challenge> findByTopicAndPublishedTrue(String topic);

    @Query("SELECT COUNT(c) FROM Challenge c WHERE c.difficulty = :difficulty AND c.published = true")
    long countByDifficultyAndPublished(DifficultyLevel difficulty);
}
