package com.sqlmasterpro.model.dto.request;

import com.sqlmasterpro.model.enums.CommentTargetType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CommentCreateRequest {
    @NotNull(message = "Target type is required")
    private CommentTargetType targetType;

    @NotNull(message = "Target id is required")
    private Long targetId;

    @NotBlank(message = "Comment content is required")
    private String content;
}
