package com.sqlmasterpro.service;

import com.sqlmasterpro.model.dto.response.CommentResponse;
import com.sqlmasterpro.model.enums.CommentTargetType;

import java.util.List;

public interface CommentService {
    List<CommentResponse> getComments(CommentTargetType targetType, Long targetId);
    CommentResponse addComment(CommentTargetType targetType, Long targetId, String content, Long userId);
    CommentResponse addReply(Long parentId, String content, Long userId);
    void deleteComment(Long id, Long userId, boolean isAdmin);
}
