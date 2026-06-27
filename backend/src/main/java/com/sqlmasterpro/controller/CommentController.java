package com.sqlmasterpro.controller;

import com.sqlmasterpro.model.dto.request.CommentCreateRequest;
import com.sqlmasterpro.model.dto.request.CommentReplyRequest;
import com.sqlmasterpro.model.dto.response.ApiResponse;
import com.sqlmasterpro.model.dto.response.CommentResponse;
import com.sqlmasterpro.model.enums.CommentTargetType;
import com.sqlmasterpro.security.UserPrincipal;
import com.sqlmasterpro.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
@Tag(name = "Comments", description = "Blog and course Q&A comment APIs")
public class CommentController {

    private final CommentService commentService;

    @GetMapping
    @Operation(summary = "Get comments for a blog post or course")
    public ResponseEntity<ApiResponse<List<CommentResponse>>> getComments(
            @RequestParam CommentTargetType targetType, @RequestParam Long targetId) {
        return ResponseEntity.ok(ApiResponse.success(commentService.getComments(targetType, targetId)));
    }

    @PostMapping
    @Operation(summary = "Post a question/comment as the current user")
    public ResponseEntity<ApiResponse<CommentResponse>> addComment(
            @Valid @RequestBody CommentCreateRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        CommentResponse response = commentService.addComment(
            request.getTargetType(), request.getTargetId(), request.getContent(), principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Comment posted", response));
    }

    @PostMapping("/{id}/reply")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    @Operation(summary = "Reply to a comment (admin/instructor only)")
    public ResponseEntity<ApiResponse<CommentResponse>> addReply(
            @PathVariable Long id, @Valid @RequestBody CommentReplyRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        CommentResponse response = commentService.addReply(id, request.getContent(), principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Reply posted", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a comment (owner or admin)")
    public ResponseEntity<ApiResponse<Void>> deleteComment(
            @PathVariable Long id, @AuthenticationPrincipal UserPrincipal principal) {
        boolean isAdmin = principal.getAuthorities().stream()
            .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
        commentService.deleteComment(id, principal.getId(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Comment deleted", null));
    }
}
