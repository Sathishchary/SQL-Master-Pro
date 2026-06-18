package com.sqlmasterpro.repository;

import com.sqlmasterpro.model.entity.SqlExecution;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SqlExecutionRepository extends JpaRepository<SqlExecution, Long> {

    Page<SqlExecution> findByUserIdOrderByExecutedAtDesc(Long userId, Pageable pageable);
    List<SqlExecution> findByUserIdAndSavedTrue(Long userId);
    List<SqlExecution> findByUserIdAndFavoriteTrue(Long userId);

    long countByUserIdAndSuccess(Long userId, boolean success);
    long countByUserId(Long userId);
}
