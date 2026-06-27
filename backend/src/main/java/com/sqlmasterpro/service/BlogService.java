package com.sqlmasterpro.service;

import com.sqlmasterpro.model.entity.Blog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BlogService {
    Page<Blog> getBlogs(String category, String search, Pageable pageable);
    Page<Blog> getAllBlogsForAdmin(Pageable pageable);
    Blog getBlogBySlug(String slug);
    Blog getBlogById(Long id);
    List<Blog> getFeaturedBlogs();
    Blog createBlog(Blog blog, Long authorId);
    Blog updateBlog(Long id, Blog blog);
    Blog setPublished(Long id, boolean published);
    void deleteBlog(Long id);
}
