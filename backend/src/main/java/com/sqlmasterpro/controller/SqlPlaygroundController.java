package com.sqlmasterpro.controller;

import com.sqlmasterpro.model.dto.response.ApiResponse;
import com.sqlmasterpro.model.dto.response.CustomTableResponse;
import com.sqlmasterpro.model.dto.response.SqlExecutionResponse;
import com.sqlmasterpro.model.entity.SqlExecution;
import com.sqlmasterpro.security.UserPrincipal;
import com.sqlmasterpro.service.CustomTableService;
import com.sqlmasterpro.service.SqlExecutionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sql")
@RequiredArgsConstructor
@Tag(name = "SQL Playground", description = "SQL execution and playground APIs")
public class SqlPlaygroundController {

    private final SqlExecutionService sqlExecutionService;
    private final CustomTableService customTableService;

    @PostMapping("/execute")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Execute a SQL query")
    public ResponseEntity<ApiResponse<SqlExecutionResponse>> executeQuery(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserPrincipal principal) {
        String query = body.get("query");
        String database = body.getOrDefault("database", "employee_db");
        SqlExecutionResponse result = sqlExecutionService.executeQuery(query, database, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/history")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get SQL execution history")
    public ResponseEntity<ApiResponse<Page<SqlExecution>>> getHistory(
            @AuthenticationPrincipal UserPrincipal principal, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(sqlExecutionService.getHistory(principal.getId(), pageable)));
    }

    @GetMapping("/saved")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get saved queries")
    public ResponseEntity<ApiResponse<List<SqlExecution>>> getSavedQueries(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.success(sqlExecutionService.getSavedQueries(principal.getId())));
    }

    @GetMapping("/favorites")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get favorite queries")
    public ResponseEntity<ApiResponse<List<SqlExecution>>> getFavoriteQueries(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.success(sqlExecutionService.getFavoriteQueries(principal.getId())));
    }

    @PatchMapping("/executions/{id}/save")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Save/unsave a query")
    public ResponseEntity<ApiResponse<SqlExecution>> toggleSave(
            @PathVariable Long id, @RequestBody Map<String, Object> body) {
        boolean saved = (Boolean) body.getOrDefault("saved", true);
        String name = (String) body.get("name");
        return ResponseEntity.ok(ApiResponse.success(sqlExecutionService.toggleSave(id, saved, name)));
    }

    @PatchMapping("/executions/{id}/favorite")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Toggle favorite on a query")
    public ResponseEntity<ApiResponse<SqlExecution>> toggleFavorite(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(sqlExecutionService.toggleFavorite(id)));
    }

    @GetMapping("/databases")
    @Operation(summary = "Get available sample databases")
    public ResponseEntity<ApiResponse<List<Map<String, String>>>> getDatabases() {
        List<Map<String, String>> databases = List.of(
            Map.of("id", "employee_db", "name", "Employee Database", "description", "Company HR data with employees, departments, salaries"),
            Map.of("id", "ecommerce_db", "name", "E-Commerce Database", "description", "Online store with products, orders, customers"),
            Map.of("id", "hospital_db", "name", "Hospital Database", "description", "Medical records, patients, doctors, appointments"),
            Map.of("id", "banking_db", "name", "Banking Database", "description", "Accounts, transactions, loans, customers"),
            Map.of("id", "school_db", "name", "School Database", "description", "Students, courses, grades, teachers"),
            Map.of("id", "inventory_db", "name", "Inventory Database", "description", "Products, warehouses, suppliers, stock"),
            Map.of("id", "movies_db", "name", "Movies Database", "description", "Films, actors, directors, genres, ratings")
        );
        return ResponseEntity.ok(ApiResponse.success(databases));
    }

    @PostMapping(value = "/custom-table/upload", consumes = "multipart/form-data")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Upload a custom .sql or .csv file to create a test table")
    public ResponseEntity<ApiResponse<CustomTableResponse>> uploadCustomTable(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserPrincipal principal) {
        CustomTableResponse result = customTableService.uploadCustomTable(principal.getId(), file);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @DeleteMapping("/custom-table")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Remove the current user's custom table")
    public ResponseEntity<ApiResponse<Void>> removeCustomTable(@AuthenticationPrincipal UserPrincipal principal) {
        customTableService.removeCustomTable(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
