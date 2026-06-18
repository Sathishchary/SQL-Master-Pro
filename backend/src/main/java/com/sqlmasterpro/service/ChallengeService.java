package com.sqlmasterpro.service;

import com.sqlmasterpro.model.entity.Challenge;
import com.sqlmasterpro.model.enums.DifficultyLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Map;

public interface ChallengeService {
    Page<Challenge> getAllChallenges(Pageable pageable);
    Challenge getChallenge(Long id);
    Page<Challenge> getByDifficulty(DifficultyLevel level, Pageable pageable);
    Map<String, Object> submitChallenge(Long id, String userQuery, Long userId);
}
