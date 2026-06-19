package com.sqlmasterpro.controller;

import com.sqlmasterpro.model.dto.response.ApiResponse;
import com.sqlmasterpro.model.entity.Course;
import com.sqlmasterpro.model.entity.Lesson;
import com.sqlmasterpro.model.enums.DifficultyLevel;
import com.sqlmasterpro.service.CourseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
@Tag(name = "Courses", description = "Course management APIs")
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    @Operation(summary = "Get all published courses")
    public ResponseEntity<ApiResponse<List<Course>>> getAllCourses() {
        return ResponseEntity.ok(ApiResponse.success(courseService.getAllCourses()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get course by ID")
    public ResponseEntity<ApiResponse<Course>> getCourse(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(courseService.getCourse(id)));
    }

    @GetMapping("/difficulty/{level}")
    @Operation(summary = "Get courses by difficulty")
    public ResponseEntity<ApiResponse<List<Course>>> getCoursesByDifficulty(
            @PathVariable DifficultyLevel level) {
        return ResponseEntity.ok(ApiResponse.success(courseService.getCoursesByDifficulty(level)));
    }

    @GetMapping("/{courseId}/lessons")
    @Operation(summary = "Get lessons for a course")
    public ResponseEntity<ApiResponse<List<Lesson>>> getCourseLessons(@PathVariable Long courseId) {
        return ResponseEntity.ok(ApiResponse.success(courseService.getCourseLessons(courseId)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    @Operation(summary = "Create a new course")
    public ResponseEntity<ApiResponse<Course>> createCourse(@RequestBody Course course) {
        return ResponseEntity.ok(ApiResponse.success("Course created", courseService.createCourse(course)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    @Operation(summary = "Update a course")
    public ResponseEntity<ApiResponse<Course>> updateCourse(
            @PathVariable Long id, @RequestBody Course course) {
        return ResponseEntity.ok(ApiResponse.success("Course updated", courseService.updateCourse(id, course)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a course")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok(ApiResponse.success("Course deleted", null));
    }
}
