package com.sqlmasterpro.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CommentReplyRequest {
    @NotBlank(message = "Reply content is required")
    private String content;
}
