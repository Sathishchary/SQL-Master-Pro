package com.sqlmasterpro.model.dto.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
public class SqlExecutionResponse {
    private Long executionId;
    private boolean success;
    private String query;
    private List<String> columns;
    private List<Map<String, Object>> rows;
    private int rowCount;
    private int affectedRows;
    private long executionTimeMs;
    private String error;
    private String databaseName;
    private LocalDateTime executedAt;
}
