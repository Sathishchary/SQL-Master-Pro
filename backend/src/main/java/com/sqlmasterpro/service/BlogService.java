package com.sqlmasterpro.service;

import com.sqlmasterpro.model.entity.Blog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BlogService {
    Page<Blog> getBlogs(String category, String search, Pageable pageable);
    Blog getBlogBySlug(String slug);
    List<Blog> getFeaturedBlogs();
    Blog createBlog(Blog blog);
    Blog updateBlog(Long id, Blog blog);
}
