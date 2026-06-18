package com.sqlmasterpro.repository;

import com.sqlmasterpro.model.entity.ChallengeSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChallengeSubmissionRepository extends JpaRepository<ChallengeSubmission, Long> {
    List<ChallengeSubmission> findByUserIdOrderBySubmittedAtDesc(Long userId);
    List<ChallengeSubmission> findByUserIdAndChallengeId(Long userId, Long challengeId);
    boolean existsByUserIdAndChallengeIdAndCorrect(Long userId, Long challengeId, boolean correct);
    long countByUserIdAndCorrect(Long userId, boolean correct);
}
