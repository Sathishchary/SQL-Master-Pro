package com.sqlmasterpro.service.impl;

import com.sqlmasterpro.exception.ResourceNotFoundException;
import com.sqlmasterpro.model.entity.Lesson;
import com.sqlmasterpro.model.entity.User;
import com.sqlmasterpro.model.entity.UserProgress;
import com.sqlmasterpro.repository.*;
import com.sqlmasterpro.service.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProgressServiceImpl implements ProgressService {

    private final UserProgressRepository progressRepository;
    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final ChallengeSubmissionRepository submissionRepository;

    @Override
    @Transactional
    public UserProgress completeLesson(Long lessonId, Long userId, Map<String, Object> body) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Lesson lesson = lessonRepository.findById(lessonId)
            .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));

        UserProgress progress = progressRepository.findByUserIdAndLessonId(userId, lessonId)
            .orElse(UserProgress.builder()
                .user(user)
                .lesson(lesson)
                .course(lesson.getCourse())
                .build());

        if (!progress.isCompleted()) {
            progress.setCompleted(true);
            progress.setCompletedAt(LocalDateTime.now());
            progress.setXpEarned(lesson.getXpReward());

            if (body != null && body.containsKey("timeSpent")) {
                progress.setTimeSpentSeconds((Integer) body.get("timeSpent"));
            }

            progressRepository.save(progress);

            user.setTotalXp(user.getTotalXp() + lesson.getXpReward());
            userRepository.save(user);
        }

        return progress;
    }

    @Override
    public Map<String, Object> getMyProgress(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        long completedLessons = progressRepository.countCompletedLessonsByUserId(userId);
        long totalLessons = lessonRepository.count();
        double avgQuizScore = quizAttemptRepository.findAvgScoreByUserId(userId) != null ?
            quizAttemptRepository.findAvgScoreByUserId(userId) : 0;
        long passedQuizzes = quizAttemptRepository.countPassedByUserId(userId);
        long solvedChallenges = submissionRepository.countByUserIdAndCorrect(userId, true);

        Map<String, Object> stats = new HashMap<>();
        stats.put("completedLessons", completedLessons);
        stats.put("totalLessons", totalLessons);
        stats.put("completionPercent", totalLessons > 0 ? (completedLessons * 100) / totalLessons : 0);
        stats.put("avgQuizScore", Math.round(avgQuizScore));
        stats.put("passedQuizzes", passedQuizzes);
        stats.put("solvedChallenges", solvedChallenges);
        stats.put("totalXp", user.getTotalXp());
        stats.put("learningStreak", user.getLearningStreak());
        stats.put("subscriptionPlan", user.getSubscriptionPlan().name());

        return stats;
    }

    @Override
    public Map<String, Object> getCourseProgress(Long courseId, Long userId) {
        List<UserProgress> progress = progressRepository.findByUserIdAndCourseId(userId, courseId);
        long completed = progressRepository.countCompletedLessonsByCourseId(userId, courseId);
        long total = lessonRepository.countByCourseId(courseId);

        return Map.of(
            "progress", progress,
            "completedLessons", completed,
            "totalLessons", total,
            "percentComplete", total > 0 ? (completed * 100) / total : 0
        );
    }
}
