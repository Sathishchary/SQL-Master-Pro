package com.sqlmasterpro.controller;

import com.sqlmasterpro.model.dto.response.ApiResponse;
import com.sqlmasterpro.model.entity.Blog;
import com.sqlmasterpro.security.UserPrincipal;
import com.sqlmasterpro.service.BlogService;
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

@RestController
@RequestMapping("/api/blogs")
@RequiredArgsConstructor
@Tag(name = "Blog", description = "Blog management APIs")
public class BlogController {

    private final BlogService blogService;

    @GetMapping
    @Operation(summary = "Get published blogs")
    public ResponseEntity<ApiResponse<Page<Blog>>> getBlogs(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(blogService.getBlogs(category, search, pageable)));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get blog by slug")
    public ResponseEntity<ApiResponse<Blog>> getBlogBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(blogService.getBlogBySlug(slug)));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured blogs")
    public ResponseEntity<ApiResponse<List<Blog>>> getFeaturedBlogs() {
        return ResponseEntity.ok(ApiResponse.success(blogService.getFeaturedBlogs()));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    @Operation(summary = "Get all blogs for admin management, including drafts")
    public ResponseEntity<ApiResponse<Page<Blog>>> getAllBlogsForAdmin(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(blogService.getAllBlogsForAdmin(pageable)));
    }

    @GetMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    @Operation(summary = "Get a single blog by id for admin editing, including drafts")
    public ResponseEntity<ApiResponse<Blog>> getBlogById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(blogService.getBlogById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    @Operation(summary = "Create blog post")
    public ResponseEntity<ApiResponse<Blog>> createBlog(@RequestBody Blog blog,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.success("Blog created", blogService.createBlog(blog, principal.getId())));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    @Operation(summary = "Update blog post")
    public ResponseEntity<ApiResponse<Blog>> updateBlog(@PathVariable Long id, @RequestBody Blog blog) {
        return ResponseEntity.ok(ApiResponse.success("Blog updated", blogService.updateBlog(id, blog)));
    }

    @PutMapping("/{id}/publish")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    @Operation(summary = "Publish a blog post so it appears publicly")
    public ResponseEntity<ApiResponse<Blog>> publishBlog(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Blog published", blogService.setPublished(id, true)));
    }

    @PutMapping("/{id}/unpublish")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    @Operation(summary = "Unpublish a blog post, reverting it to a draft")
    public ResponseEntity<ApiResponse<Blog>> unpublishBlog(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Blog unpublished", blogService.setPublished(id, false)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    @Operation(summary = "Delete blog post")
    public ResponseEntity<ApiResponse<Void>> deleteBlog(@PathVariable Long id) {
        blogService.deleteBlog(id);
        return ResponseEntity.ok(ApiResponse.success("Blog deleted", null));
    }
}
