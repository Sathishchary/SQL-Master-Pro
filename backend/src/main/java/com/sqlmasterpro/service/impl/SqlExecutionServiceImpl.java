package com.sqlmasterpro.service.impl;

import com.sqlmasterpro.exception.BadRequestException;
import com.sqlmasterpro.exception.ResourceNotFoundException;
import com.sqlmasterpro.model.dto.response.SqlExecutionResponse;
import com.sqlmasterpro.model.entity.SqlExecution;
import com.sqlmasterpro.model.entity.User;
import com.sqlmasterpro.repository.SqlExecutionRepository;
import com.sqlmasterpro.repository.UserRepository;
import com.sqlmasterpro.service.SqlExecutionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;
import java.sql.*;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class SqlExecutionServiceImpl implements SqlExecutionService {

    private final SqlExecutionRepository executionRepository;
    private final UserRepository userRepository;
    private final DataSource dataSource;

    @Value("${app.sql-execution.max-query-length}")
    private int maxQueryLength;

    @Value("${app.sql-execution.timeout-seconds}")
    private int timeoutSeconds;

    @Value("${app.sql-execution.max-rows}")
    private int maxRows;

    private static final Set<String> FORBIDDEN_KEYWORDS = Set.of(
        "DROP", "TRUNCATE", "DELETE", "UPDATE", "INSERT", "ALTER", "CREATE",
        "GRANT", "REVOKE", "EXEC", "EXECUTE", "xp_", "sp_", "BULK"
    );

    @Transactional
    @Override
    public SqlExecutionResponse executeQuery(String query, String databaseSchema, Long userId) {
        validateQuery(query);
        validateSchemaOwnership(databaseSchema, userId);

        long startTime = System.currentTimeMillis();
        SqlExecutionResponse response = new SqlExecutionResponse();
        response.setQuery(query);
        response.setExecutedAt(LocalDateTime.now());

        User user = userId != null ? userRepository.findById(userId).orElse(null) : null;

        try (Connection conn = dataSource.getConnection()) {
            // Set schema/search path for sandboxed execution
            if (databaseSchema != null && !databaseSchema.isEmpty()) {
                try (Statement schemaStmt = conn.createStatement()) {
                    schemaStmt.execute("SET search_path TO " + sanitizeSchemaName(databaseSchema) + ", public");
                }
            }

            try (Statement stmt = conn.createStatement()) {
                stmt.setQueryTimeout(timeoutSeconds);
                stmt.setMaxRows(maxRows);

                boolean hasResultSet = stmt.execute(query);

                if (hasResultSet) {
                    try (ResultSet rs = stmt.getResultSet()) {
                        ResultSetMetaData meta = rs.getMetaData();
                        int colCount = meta.getColumnCount();

                        List<String> columns = new ArrayList<>();
                        for (int i = 1; i <= colCount; i++) {
                            columns.add(meta.getColumnLabel(i));
                        }

                        List<Map<String, Object>> rows = new ArrayList<>();
                        while (rs.next()) {
                            Map<String, Object> row = new LinkedHashMap<>();
                            for (int i = 1; i <= colCount; i++) {
                                row.put(columns.get(i - 1), rs.getObject(i));
                            }
                            rows.add(row);
                        }

                        response.setColumns(columns);
                        response.setRows(rows);
                        response.setRowCount(rows.size());
                    }
                } else {
                    response.setAffectedRows(stmt.getUpdateCount());
                    response.setRowCount(0);
                }

                long executionTime = System.currentTimeMillis() - startTime;
                response.setExecutionTimeMs(executionTime);
                response.setSuccess(true);
            }
        } catch (SQLTimeoutException e) {
            response.setSuccess(false);
            response.setError("Query exceeded the " + timeoutSeconds + " second time limit");
            response.setExecutionTimeMs(System.currentTimeMillis() - startTime);
        } catch (Exception e) {
            response.setSuccess(false);
            response.setError(e.getMessage());
            response.setExecutionTimeMs(System.currentTimeMillis() - startTime);
            log.warn("SQL execution error: {}", e.getMessage());
        }

        // Persist execution history
        if (user != null) {
            SqlExecution exec = SqlExecution.builder()
                .user(user)
                .query(query)
                .databaseName(databaseSchema)
                .success(response.isSuccess())
                .rowCount(response.getRowCount())
                .executionTimeMs(response.getExecutionTimeMs())
                .errorMessage(response.getError())
                .build();
            SqlExecution saved = executionRepository.save(exec);
            response.setExecutionId(saved.getId());
        }

        return response;
    }

    private void validateQuery(String query) {
        if (query == null || query.trim().isEmpty()) {
            throw new BadRequestException("Query cannot be empty");
        }
        if (query.length() > maxQueryLength) {
            throw new BadRequestException("Query exceeds maximum length of " + maxQueryLength + " characters");
        }

        String upperQuery = query.toUpperCase().trim();
        for (String keyword : FORBIDDEN_KEYWORDS) {
            if (upperQuery.startsWith(keyword) || upperQuery.contains(" " + keyword + " ")) {
                throw new BadRequestException("Operation not allowed: " + keyword);
            }
        }
    }

    private void validateSchemaOwnership(String databaseSchema, Long userId) {
        if (databaseSchema != null && databaseSchema.startsWith("custom_user_")) {
            String ownerId = databaseSchema.substring("custom_user_".length());
            if (userId == null || !ownerId.equals(String.valueOf(userId))) {
                throw new BadRequestException("You do not have access to this custom table");
            }
        }
    }

    private String sanitizeSchemaName(String name) {
        // Only allow alphanumeric and underscore
        return name.replaceAll("[^a-zA-Z0-9_]", "");
    }

    @Override
    public Page<SqlExecution> getHistory(Long userId, Pageable pageable) {
        return executionRepository.findByUserIdOrderByExecutedAtDesc(userId, pageable);
    }

    @Override
    public List<SqlExecution> getSavedQueries(Long userId) {
        return executionRepository.findByUserIdAndSavedTrue(userId);
    }

    @Override
    public List<SqlExecution> getFavoriteQueries(Long userId) {
        return executionRepository.findByUserIdAndFavoriteTrue(userId);
    }

    @Override
    @Transactional
    public SqlExecution toggleSave(Long id, boolean saved, String name) {
        SqlExecution exec = executionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Execution not found"));
        exec.setSaved(saved);
        if (saved) {
            exec.setQueryName((name == null || name.isBlank()) ? "Query " + id : name);
        } else {
            exec.setQueryName(name);
        }
        return executionRepository.save(exec);
    }

    @Override
    @Transactional
    public SqlExecution toggleFavorite(Long id) {
        SqlExecution exec = executionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Execution not found"));
        exec.setFavorite(!exec.isFavorite());
        return executionRepository.save(exec);
    }
}
