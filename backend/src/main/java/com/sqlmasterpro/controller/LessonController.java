package com.sqlmasterpro.controller;

import com.sqlmasterpro.model.dto.response.ApiResponse;
import com.sqlmasterpro.model.entity.Lesson;
import com.sqlmasterpro.service.LessonService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/lessons")
@RequiredArgsConstructor
@Tag(name = "Lessons", description = "Lesson APIs")
public class LessonController {

    private final LessonService lessonService;

    @GetMapping("/{id}")
    @Operation(summary = "Get lesson by ID")
    public ResponseEntity<ApiResponse<Lesson>> getLesson(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(lessonService.getLesson(id)));
    }
}
