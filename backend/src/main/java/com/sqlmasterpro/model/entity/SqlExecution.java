package com.sqlmasterpro.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "sql_executions", indexes = {
    @Index(name = "idx_sql_exec_user", columnList = "user_id")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SqlExecution {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sql_exec_seq")
    @SequenceGenerator(name = "sql_exec_seq", sequenceName = "sql_executions_seq", allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String query;

    @Column(name = "result_json", columnDefinition = "TEXT")
    private String resultJson;

    @Column(name = "row_count")
    @Builder.Default
    private int rowCount = 0;

    @Column(name = "execution_time_ms")
    @Builder.Default
    private long executionTimeMs = 0;

    @Column(name = "database_name", length = 50)
    private String databaseName;

    @Column(nullable = false)
    @Builder.Default
    private boolean success = false;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "saved", nullable = false)
    @Builder.Default
    private boolean saved = false;

    @Column(name = "query_name", length = 100)
    private String queryName;

    @Column(name = "is_favorite", nullable = false)
    @Builder.Default
    private boolean favorite = false;

    @CreationTimestamp
    @Column(name = "executed_at", nullable = false, updatable = false)
    private LocalDateTime executedAt;
}
