package com.sqlmasterpro.controller;

import com.sqlmasterpro.model.dto.response.ApiResponse;
import com.sqlmasterpro.model.entity.*;
import com.sqlmasterpro.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Admin management APIs")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get admin dashboard stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getDashboardStats()));
    }

    @GetMapping("/users")
    @Operation(summary = "Get all users")
    public ResponseEntity<ApiResponse<Page<User>>> getUsers(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(adminService.getUsers(pageable)));
    }

    @DeleteMapping("/users/{id}")
    @Operation(summary = "Deactivate user")
    public ResponseEntity<ApiResponse<Void>> deactivateUser(@PathVariable Long id) {
        adminService.deactivateUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deactivated", null));
    }

    @GetMapping("/payments")
    @Operation(summary = "Get all payments")
    public ResponseEntity<ApiResponse<Page<Payment>>> getPayments(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(adminService.getPayments(pageable)));
    }

    @GetMapping("/analytics")
    @Operation(summary = "Get platform analytics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalytics() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getAnalytics()));
    }

    @PostMapping("/questions")
    @Operation(summary = "Create a quiz question")
    public ResponseEntity<ApiResponse<Question>> createQuestion(@RequestBody Question question) {
        return ResponseEntity.ok(ApiResponse.success("Question created", adminService.createQuestion(question)));
    }

    @PutMapping("/questions/{id}")
    @Operation(summary = "Update a quiz question")
    public ResponseEntity<ApiResponse<Question>> updateQuestion(
            @PathVariable Long id, @RequestBody Question question) {
        return ResponseEntity.ok(ApiResponse.success("Question updated", adminService.updateQuestion(id, question)));
    }

    @DeleteMapping("/questions/{id}")
    @Operation(summary = "Delete a quiz question")
    public ResponseEntity<ApiResponse<Void>> deleteQuestion(@PathVariable Long id) {
        adminService.deleteQuestion(id);
        return ResponseEntity.ok(ApiResponse.success("Question deleted", null));
    }

    @PostMapping("/challenges")
    @Operation(summary = "Create a challenge")
    public ResponseEntity<ApiResponse<Challenge>> createChallenge(@RequestBody Challenge challenge) {
        return ResponseEntity.ok(ApiResponse.success("Challenge created", adminService.createChallenge(challenge)));
    }

    @PostMapping("/blogs")
    @Operation(summary = "Create a blog")
    public ResponseEntity<ApiResponse<Blog>> createBlog(@RequestBody Blog blog) {
        return ResponseEntity.ok(ApiResponse.success("Blog created", adminService.createBlog(blog)));
    }
}
