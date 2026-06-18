package com.sqlmasterpro.service;

import com.sqlmasterpro.model.dto.response.SqlExecutionResponse;
import com.sqlmasterpro.model.entity.SqlExecution;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface SqlExecutionService {
    SqlExecutionResponse executeQuery(String query, String databaseSchema, Long userId);
    Page<SqlExecution> getHistory(Long userId, Pageable pageable);
    List<SqlExecution> getSavedQueries(Long userId);
    List<SqlExecution> getFavoriteQueries(Long userId);
    SqlExecution toggleSave(Long id, boolean saved, String name);
    SqlExecution toggleFavorite(Long id);
}
