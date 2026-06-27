package com.sqlmasterpro.service;

import com.sqlmasterpro.model.dto.request.AdminCreateUserRequest;
import com.sqlmasterpro.model.dto.request.AdminUpdateUserRequest;
import com.sqlmasterpro.model.entity.Blog;
import com.sqlmasterpro.model.entity.Challenge;
import com.sqlmasterpro.model.entity.Payment;
import com.sqlmasterpro.model.entity.Question;
import com.sqlmasterpro.model.entity.User;
import com.sqlmasterpro.model.enums.SubscriptionPlan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Map;

public interface AdminService {
    Map<String, Object> getDashboardStats();
    Page<User> getUsers(Pageable pageable);
    User getUserById(Long id);
    User createUser(AdminCreateUserRequest request);
    User updateUser(Long id, AdminUpdateUserRequest request);
    void deactivateUser(Long id);
    void activateUser(Long id);
    User updateUserPlan(Long id, SubscriptionPlan plan);
    Page<Payment> getPayments(Pageable pageable);
    Map<String, Object> getAnalytics();
    Question createQuestion(Question question);
    Question updateQuestion(Long id, Question question);
    void deleteQuestion(Long id);
    Challenge createChallenge(Challenge challenge);
    Blog createBlog(Blog blog);
}
