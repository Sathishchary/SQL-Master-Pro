package com.sqlmasterpro.service.impl;

import com.sqlmasterpro.exception.ResourceNotFoundException;
import com.sqlmasterpro.model.dto.response.SqlExecutionResponse;
import com.sqlmasterpro.model.entity.Challenge;
import com.sqlmasterpro.model.entity.ChallengeSubmission;
import com.sqlmasterpro.model.entity.User;
import com.sqlmasterpro.model.enums.DifficultyLevel;
import com.sqlmasterpro.repository.ChallengeRepository;
import com.sqlmasterpro.repository.ChallengeSubmissionRepository;
import com.sqlmasterpro.repository.UserRepository;
import com.sqlmasterpro.service.ChallengeService;
import com.sqlmasterpro.service.SqlExecutionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChallengeServiceImpl implements ChallengeService {

    private final ChallengeRepository challengeRepository;
    private final ChallengeSubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    private final SqlExecutionService sqlExecutionService;

    @Override
    public Page<Challenge> getAllChallenges(Pageable pageable) {
        return challengeRepository.findByPublishedTrue(pageable);
    }

    @Override
    public Challenge getChallenge(Long id) {
        Challenge challenge = challengeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Challenge not found"));
        challenge.setSolutionQuery(null);
        return challenge;
    }

    @Override
    public Page<Challenge> getByDifficulty(DifficultyLevel level, Pageable pageable) {
        return challengeRepository.findByPublishedTrueAndDifficulty(level, pageable);
    }

    @Override
    @Transactional
    public Map<String, Object> submitChallenge(Long id, String userQuery, Long userId) {
        Challenge challenge = challengeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Challenge not found"));
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        SqlExecutionResponse executionResult = sqlExecutionService.executeQuery(
            userQuery, challenge.getDatabaseName(), userId);

        boolean correct = false;
        int pointsEarned = 0;
        int xpEarned = 0;

        if (executionResult.isSuccess()) {
            SqlExecutionResponse expectedResult = sqlExecutionService.executeQuery(
                challenge.getSolutionQuery(), challenge.getDatabaseName(), null);

            if (expectedResult.isSuccess()) {
                correct = compareResults(executionResult, expectedResult);
            }
        }

        if (correct) {
            pointsEarned = challenge.getPoints();
            xpEarned = challenge.getXpReward();
            user.setTotalXp(user.getTotalXp() + xpEarned);
            userRepository.save(user);
        }

        ChallengeSubmission submission = ChallengeSubmission.builder()
            .user(user)
            .challenge(challenge)
            .submittedQuery(userQuery)
            .correct(correct)
            .executionTimeMs(executionResult.getExecutionTimeMs())
            .errorMessage(executionResult.getError())
            .pointsEarned(pointsEarned)
            .xpEarned(xpEarned)
            .build();

        submissionRepository.save(submission);

        challenge.setTotalSubmissions(challenge.getTotalSubmissions() + 1);
        if (correct) challenge.setSuccessfulSubmissions(challenge.getSuccessfulSubmissions() + 1);
        challengeRepository.save(challenge);

        return Map.of(
            "correct", correct,
            "executionResult", executionResult,
            "pointsEarned", pointsEarned,
            "xpEarned", xpEarned,
            "submissionId", submission.getId()
        );
    }

    private boolean compareResults(SqlExecutionResponse result1, SqlExecutionResponse result2) {
        if (result1.getRows() == null && result2.getRows() == null) return true;
        if (result1.getRows() == null || result2.getRows() == null) return false;
        if (result1.getRowCount() != result2.getRowCount()) return false;
        return result1.getRows().toString().equals(result2.getRows().toString());
    }
}
