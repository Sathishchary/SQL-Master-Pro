package com.sqlmasterpro.repository;

import com.sqlmasterpro.model.entity.CustomUserTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CustomUserTableRepository extends JpaRepository<CustomUserTable, Long> {
    List<CustomUserTable> findByCreatedAtBefore(LocalDateTime cutoff);
}
