package com.sqlmasterpro.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "custom_user_tables")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CustomUserTable {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "schema_name", nullable = false, length = 60)
    private String schemaName;

    @Column(name = "table_name", nullable = false, length = 60)
    private String tableName;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
