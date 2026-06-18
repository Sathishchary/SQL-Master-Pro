package com.sqlmasterpro.service;

import com.sqlmasterpro.model.entity.Blog;
import com.sqlmasterpro.model.entity.Challenge;
import com.sqlmasterpro.model.entity.Payment;
import com.sqlmasterpro.model.entity.Question;
import com.sqlmasterpro.model.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Map;

public interface AdminService {
    Map<String, Object> getDashboardStats();
    Page<User> getUsers(Pageable pageable);
    void deactivateUser(Long id);
    Page<Payment> getPayments(Pageable pageable);
    Map<String, Object> getAnalytics();
    Question createQuestion(Question question);
    Question updateQuestion(Long id, Question question);
    void deleteQuestion(Long id);
    Challenge createChallenge(Challenge challenge);
    Blog createBlog(Blog blog);
}
