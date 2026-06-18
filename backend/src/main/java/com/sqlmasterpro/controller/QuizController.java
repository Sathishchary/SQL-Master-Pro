package com.sqlmasterpro.controller;

import com.sqlmasterpro.model.dto.response.ApiResponse;
import com.sqlmasterpro.model.entity.Question;
import com.sqlmasterpro.model.entity.Quiz;
import com.sqlmasterpro.model.entity.QuizAttempt;
import com.sqlmasterpro.model.enums.DifficultyLevel;
import com.sqlmasterpro.security.UserPrincipal;
import com.sqlmasterpro.service.QuizService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
@Tag(name = "Quizzes", description = "Quiz management APIs")
public class QuizController {

    private final QuizService quizService;

    @GetMapping
    @Operation(summary = "Get all published quizzes")
    public ResponseEntity<ApiResponse<Page<Quiz>>> getAllQuizzes(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(quizService.getAllQuizzes(pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Quiz>> getQuiz(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(quizService.getQuiz(id)));
    }

    @GetMapping("/difficulty/{level}")
    public ResponseEntity<ApiResponse<Page<Quiz>>> getByDifficulty(
            @PathVariable DifficultyLevel level, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(quizService.getByDifficulty(level, pageable)));
    }

    @GetMapping("/{quizId}/questions")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get questions for a quiz")
    public ResponseEntity<ApiResponse<List<Question>>> getQuizQuestions(@PathVariable Long quizId) {
        return ResponseEntity.ok(ApiResponse.success(quizService.getQuizQuestions(quizId)));
    }

    @PostMapping("/{quizId}/submit")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Submit quiz attempt")
    public ResponseEntity<ApiResponse<QuizAttempt>> submitQuiz(
            @PathVariable Long quizId,
            @RequestBody Map<Long, String> answers,
            @AuthenticationPrincipal UserPrincipal principal) {
        QuizAttempt attempt = quizService.submitQuiz(quizId, answers, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Quiz submitted", attempt));
    }

    @GetMapping("/my-attempts")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<QuizAttempt>>> getMyAttempts(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.success(quizService.getMyAttempts(principal.getId())));
    }
}
