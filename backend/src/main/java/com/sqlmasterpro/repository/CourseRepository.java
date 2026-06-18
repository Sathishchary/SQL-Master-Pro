package com.sqlmasterpro.repository;

import com.sqlmasterpro.model.entity.Course;
import com.sqlmasterpro.model.enums.DifficultyLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByPublishedTrueOrderByOrderIndexAsc();
    List<Course> findByDifficultyAndPublishedTrue(DifficultyLevel difficulty);
    Page<Course> findByPublishedTrue(Pageable pageable);

    @Query("SELECT c FROM Course c WHERE c.published = true AND c.premium = :premium ORDER BY c.orderIndex ASC")
    List<Course> findByPremiumAndPublished(boolean premium);
}
