package com.sqlmasterpro.service;

import com.sqlmasterpro.model.entity.Question;
import com.sqlmasterpro.model.entity.Quiz;
import com.sqlmasterpro.model.entity.QuizAttempt;
import com.sqlmasterpro.model.enums.DifficultyLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface QuizService {
    Page<Quiz> getAllQuizzes(Pageable pageable);
    Quiz getQuiz(Long id);
    Page<Quiz> getByDifficulty(DifficultyLevel level, Pageable pageable);
    List<Question> getQuizQuestions(Long quizId);
    QuizAttempt submitQuiz(Long quizId, Map<Long, String> answers, Long userId);
    List<QuizAttempt> getMyAttempts(Long userId);
}
