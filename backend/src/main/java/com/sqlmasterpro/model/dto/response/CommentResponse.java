package com.sqlmasterpro.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponse {
    private Long id;
    private String content;
    private Long parentId;
    private Long userId;
    private String userName;
    private String userAvatar;
    private boolean staff;
    private LocalDateTime createdAt;
    private List<CommentResponse> replies;
}
