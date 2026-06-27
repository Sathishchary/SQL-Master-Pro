package com.sqlmasterpro.service.impl;

import com.sqlmasterpro.exception.ResourceNotFoundException;
import com.sqlmasterpro.model.entity.Blog;
import com.sqlmasterpro.model.entity.User;
import com.sqlmasterpro.repository.BlogRepository;
import com.sqlmasterpro.repository.UserRepository;
import com.sqlmasterpro.service.BlogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BlogServiceImpl implements BlogService {

    private final BlogRepository blogRepository;
    private final UserRepository userRepository;

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
    public Page<Blog> getAllBlogsForAdmin(Pageable pageable) {
        Pageable sorted = pageable.getSort().isSorted() ? pageable
            : org.springframework.data.domain.PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "createdAt"));
        return blogRepository.findAllWithAuthor(sorted);
    }

    @Override
    @Transactional
    public Blog getBlogBySlug(String slug) {
        Blog blog = blogRepository.findBySlugWithAuthor(slug)
            .orElseThrow(() -> new ResourceNotFoundException("Blog not found"));
        blog.setViews(blog.getViews() + 1);
        blogRepository.save(blog);
        return blog;
    }

    @Override
    public Blog getBlogById(Long id) {
        return blogRepository.findByIdWithAuthor(id)
            .orElseThrow(() -> new ResourceNotFoundException("Blog not found"));
    }

    @Override
    public List<Blog> getFeaturedBlogs() {
        return blogRepository.findByPublishedTrueAndFeaturedTrue();
    }

    @Override
    @Transactional
    public Blog createBlog(Blog blog, Long authorId) {
        User author = userRepository.findById(authorId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        blog.setAuthor(author);
        if (blog.getSlug() == null || blog.getSlug().isBlank()) {
            blog.setSlug(slugify(blog.getTitle()));
        }
        if (blog.isPublished() && blog.getPublishedAt() == null) {
            blog.setPublishedAt(LocalDateTime.now());
        }
        return blogRepository.save(blog);
    }

    @Override
    @Transactional
    public Blog updateBlog(Long id, Blog blog) {
        Blog existing = blogRepository.findByIdWithAuthor(id)
            .orElseThrow(() -> new ResourceNotFoundException("Blog not found"));
        blog.setId(id);
        blog.setAuthor(existing.getAuthor());
        blog.setViews(existing.getViews());
        blog.setLikes(existing.getLikes());
        if (blog.getSlug() == null || blog.getSlug().isBlank()) {
            blog.setSlug(existing.getSlug());
        }
        if (blog.isPublished() && blog.getPublishedAt() == null) {
            blog.setPublishedAt(existing.getPublishedAt() != null ? existing.getPublishedAt() : LocalDateTime.now());
        }
        return blogRepository.save(blog);
    }

    @Override
    @Transactional
    public Blog setPublished(Long id, boolean published) {
        Blog existing = blogRepository.findByIdWithAuthor(id)
            .orElseThrow(() -> new ResourceNotFoundException("Blog not found"));
        existing.setPublished(published);
        if (published && existing.getPublishedAt() == null) {
            existing.setPublishedAt(LocalDateTime.now());
        }
        return blogRepository.save(existing);
    }

    @Override
    @Transactional
    public void deleteBlog(Long id) {
        Blog blog = blogRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Blog not found"));
        blogRepository.delete(blog);
    }

    private String slugify(String title) {
        String base = title == null ? "" : title.toLowerCase(Locale.ROOT)
            .replaceAll("[^a-z0-9\\s-]", "")
            .trim()
            .replaceAll("\\s+", "-");
        String slug = base.isEmpty() ? "post" : base;
        String candidate = slug;
        int suffix = 1;
        while (blogRepository.findBySlug(candidate).isPresent()) {
            candidate = slug + "-" + (++suffix);
        }
        return candidate;
    }
}
