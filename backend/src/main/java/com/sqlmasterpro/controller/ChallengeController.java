package com.sqlmasterpro.controller;

import com.sqlmasterpro.model.dto.response.ApiResponse;
import com.sqlmasterpro.model.entity.Challenge;
import com.sqlmasterpro.model.enums.DifficultyLevel;
import com.sqlmasterpro.security.UserPrincipal;
import com.sqlmasterpro.service.ChallengeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/challenges")
@RequiredArgsConstructor
@Tag(name = "Challenges", description = "SQL Coding Challenges APIs")
public class ChallengeController {

    private final ChallengeService challengeService;

    @GetMapping
    @Operation(summary = "Get all challenges")
    public ResponseEntity<ApiResponse<Page<Challenge>>> getAllChallenges(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(challengeService.getAllChallenges(pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Challenge>> getChallenge(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(challengeService.getChallenge(id)));
    }

    @GetMapping("/difficulty/{level}")
    public ResponseEntity<ApiResponse<Page<Challenge>>> getByDifficulty(
            @PathVariable DifficultyLevel level, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(challengeService.getByDifficulty(level, pageable)));
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Submit a challenge solution")
    public ResponseEntity<ApiResponse<Map<String, Object>>> submitChallenge(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserPrincipal principal) {
        Map<String, Object> result = challengeService.submitChallenge(id, body.get("query"), principal.getId());
        return ResponseEntity.ok(ApiResponse.success(result));
    }
}
