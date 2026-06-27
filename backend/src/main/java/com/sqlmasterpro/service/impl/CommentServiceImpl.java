package com.sqlmasterpro.service.impl;

import com.sqlmasterpro.exception.ResourceNotFoundException;
import com.sqlmasterpro.model.dto.response.CommentResponse;
import com.sqlmasterpro.model.entity.Comment;
import com.sqlmasterpro.model.entity.User;
import com.sqlmasterpro.model.enums.CommentTargetType;
import com.sqlmasterpro.repository.CommentRepository;
import com.sqlmasterpro.repository.UserRepository;
import com.sqlmasterpro.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    @Override
    public List<CommentResponse> getComments(CommentTargetType targetType, Long targetId) {
        List<Comment> all = commentRepository.findByTargetOrderByCreatedAtAsc(targetType, targetId);
        Map<Long, List<Comment>> byParent = all.stream()
            .filter(c -> c.getParentId() != null)
            .collect(Collectors.groupingBy(Comment::getParentId));

        return all.stream()
            .filter(c -> c.getParentId() == null)
            .map(c -> toResponse(c, byParent))
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CommentResponse addComment(CommentTargetType targetType, Long targetId, String content, Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Comment comment = Comment.builder()
            .targetType(targetType)
            .targetId(targetId)
            .content(content)
            .user(user)
            .build();
        return toResponse(commentRepository.save(comment), Map.of());
    }

    @Override
    @Transactional
    public CommentResponse addReply(Long parentId, String content, Long userId) {
        Comment parent = commentRepository.findById(parentId)
            .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Comment reply = Comment.builder()
            .targetType(parent.getTargetType())
            .targetId(parent.getTargetId())
            .parentId(parent.getId())
            .content(content)
            .user(user)
            .build();
        return toResponse(commentRepository.save(reply), Map.of());
    }

    @Override
    @Transactional
    public void deleteComment(Long id, Long userId, boolean isAdmin) {
        Comment comment = commentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
        boolean isOwner = comment.getUser() != null && comment.getUser().getId().equals(userId);
        if (!isOwner && !isAdmin) {
            throw new AccessDeniedException("You can only delete your own comments");
        }
        commentRepository.delete(comment);
    }

    private CommentResponse toResponse(Comment c, Map<Long, List<Comment>> byParent) {
        User user = c.getUser();
        boolean staff = user != null && user.getRoles().stream()
            .anyMatch(r -> "ROLE_ADMIN".equals(r.getName()) || "ROLE_INSTRUCTOR".equals(r.getName()));

        List<CommentResponse> replies = byParent.getOrDefault(c.getId(), List.of()).stream()
            .map(child -> toResponse(child, byParent))
            .collect(Collectors.toCollection(ArrayList::new));

        return CommentResponse.builder()
            .id(c.getId())
            .content(c.getContent())
            .parentId(c.getParentId())
            .userId(user != null ? user.getId() : null)
            .userName(user != null ? user.getFullName() : "Deleted User")
            .userAvatar(user != null ? user.getProfilePicture() : null)
            .staff(staff)
            .createdAt(c.getCreatedAt())
            .replies(replies)
            .build();
    }
}
