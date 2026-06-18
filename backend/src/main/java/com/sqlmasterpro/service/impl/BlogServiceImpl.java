package com.sqlmasterpro.service.impl;

import com.sqlmasterpro.exception.ResourceNotFoundException;
import com.sqlmasterpro.model.entity.Blog;
import com.sqlmasterpro.repository.BlogRepository;
import com.sqlmasterpro.service.BlogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BlogServiceImpl implements BlogService {

    private final BlogRepository blogRepository;

    @Override
    public Page<Blog> getBlogs(String category, String search, Pageable pageable) {
        if (search != null && !search.isEmpty()) {
            return blogRepository.findByPublishedTrueAndTitleContainingIgnoreCase(search, pageable);
        } else if (category != null && !category.isEmpty()) {
            return blogRepository.findByPublishedTrueAndCategory(category, pageable);
        }
        return blogRepository.findByPublishedTrue(pageable);
    }

    @Override
    @Transactional
    public Blog getBlogBySlug(String slug) {
        Blog blog = blogRepository.findBySlug(slug)
            .orElseThrow(() -> new ResourceNotFoundException("Blog not found"));
        blog.setViews(blog.getViews() + 1);
        blogRepository.save(blog);
        return blog;
    }

    @Override
    public List<Blog> getFeaturedBlogs() {
        return blogRepository.findByPublishedTrueAndFeaturedTrue();
    }

    @Override
    @Transactional
    public Blog createBlog(Blog blog) {
        return blogRepository.save(blog);
    }

    @Override
    @Transactional
    public Blog updateBlog(Long id, Blog blog) {
        blogRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Blog not found"));
        blog.setId(id);
        return blogRepository.save(blog);
    }
}
