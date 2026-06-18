package com.sqlmasterpro.repository;

import com.sqlmasterpro.model.entity.Blog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {

    Page<Blog> findByPublishedTrue(Pageable pageable);
    Page<Blog> findByPublishedTrueAndCategory(String category, Pageable pageable);
    Optional<Blog> findBySlug(String slug);
    List<Blog> findByPublishedTrueAndFeaturedTrue();

    Page<Blog> findByPublishedTrueAndTitleContainingIgnoreCase(String keyword, Pageable pageable);
}
