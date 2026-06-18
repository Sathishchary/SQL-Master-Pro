package com.sqlmasterpro.controller;

import com.sqlmasterpro.model.dto.response.ApiResponse;
import com.sqlmasterpro.model.entity.UserProgress;
import com.sqlmasterpro.security.UserPrincipal;
import com.sqlmasterpro.service.ProgressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
@Tag(name = "Progress", description = "Learning progress tracking APIs")
public class ProgressController {

    private final ProgressService progressService;

    @PostMapping("/complete-lesson/{lessonId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Mark a lesson as completed")
    public ResponseEntity<ApiResponse<UserProgress>> completeLesson(
            @PathVariable Long lessonId,
            @RequestBody(required = false) Map<String, Object> body,
            @AuthenticationPrincipal UserPrincipal principal) {
        UserProgress progress = progressService.completeLesson(lessonId, principal.getId(), body);
        return ResponseEntity.ok(ApiResponse.success("Lesson completed", progress));
    }

    @GetMapping("/my-progress")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get overall learning progress")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMyProgress(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.success(progressService.getMyProgress(principal.getId())));
    }

    @GetMapping("/course/{courseId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get progress for a specific course")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCourseProgress(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.success(progressService.getCourseProgress(courseId, principal.getId())));
    }
}
