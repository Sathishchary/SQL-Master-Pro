package com.sqlmasterpro.repository;

import com.sqlmasterpro.model.entity.Comment;
import com.sqlmasterpro.model.enums.CommentTargetType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query("SELECT c FROM Comment c LEFT JOIN FETCH c.user WHERE c.targetType = :targetType AND c.targetId = :targetId ORDER BY c.createdAt ASC")
    List<Comment> findByTargetOrderByCreatedAtAsc(CommentTargetType targetType, Long targetId);
}
