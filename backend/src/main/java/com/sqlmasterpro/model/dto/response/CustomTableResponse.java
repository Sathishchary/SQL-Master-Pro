package com.sqlmasterpro.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomTableResponse {
    private String schemaName;
    private String tableName;
    private List<String> columns;
    private int rowCount;
}
