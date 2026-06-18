package com.sqlmasterpro.service.impl;

import com.sqlmasterpro.exception.ResourceNotFoundException;
import com.sqlmasterpro.model.entity.Question;
import com.sqlmasterpro.model.entity.Quiz;
import com.sqlmasterpro.model.entity.QuizAttempt;
import com.sqlmasterpro.model.entity.User;
import com.sqlmasterpro.model.enums.DifficultyLevel;
import com.sqlmasterpro.repository.QuestionRepository;
import com.sqlmasterpro.repository.QuizAttemptRepository;
import com.sqlmasterpro.repository.QuizRepository;
import com.sqlmasterpro.repository.UserRepository;
import com.sqlmasterpro.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class QuizServiceImpl implements QuizService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final QuizAttemptRepository attemptRepository;
    private final UserRepository userRepository;

    @Override
    public Page<Quiz> getAllQuizzes(Pageable pageable) {
        return quizRepository.findByPublishedTrue(pageable);
    }

    @Override
    public Quiz getQuiz(Long id) {
        return quizRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));
    }

    @Override
    public Page<Quiz> getByDifficulty(DifficultyLevel level, Pageable pageable) {
        return quizRepository.findByPublishedTrueAndDifficulty(level, pageable);
    }

    @Override
    public List<Question> getQuizQuestions(Long quizId) {
        List<Question> questions = questionRepository.findByQuizIdAndPublishedTrue(quizId);
        questions.forEach(q -> q.setCorrectAnswer(null));
        return questions;
    }

    @Override
    @Transactional
    public QuizAttempt submitQuiz(Long quizId, Map<Long, String> answers, Long userId) {
        Quiz quiz = quizRepository.findById(quizId)
            .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Question> questions = questionRepository.findByQuizIdAndPublishedTrue(quizId);

        int correct = 0;
        for (Question q : questions) {
            String userAnswer = answers.get(q.getId());
            if (q.getCorrectAnswer().equalsIgnoreCase(userAnswer != null ? userAnswer.trim() : "")) {
                correct++;
            }
        }

        int score = questions.isEmpty() ? 0 : (correct * 100) / questions.size();
        boolean passed = score >= quiz.getPassScore();
        int xpEarned = passed ? 50 : 10;

        QuizAttempt attempt = QuizAttempt.builder()
            .user(user)
            .quiz(quiz)
            .score(score)
            .totalQuestions(questions.size())
            .correctAnswers(correct)
            .passed(passed)
            .xpEarned(xpEarned)
            .build();

        attemptRepository.save(attempt);

        user.setTotalXp(user.getTotalXp() + xpEarned);
        userRepository.save(user);

        return attempt;
    }

    @Override
    public List<QuizAttempt> getMyAttempts(Long userId) {
        return attemptRepository.findByUserIdOrderByAttemptedAtDesc(userId);
    }
}
