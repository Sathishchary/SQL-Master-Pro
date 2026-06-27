package com.sqlmasterpro.service.impl;

import com.sqlmasterpro.exception.BadRequestException;
import com.sqlmasterpro.exception.ResourceNotFoundException;
import com.sqlmasterpro.model.dto.request.AdminCreateUserRequest;
import com.sqlmasterpro.model.dto.request.AdminUpdateUserRequest;
import com.sqlmasterpro.model.entity.*;
import com.sqlmasterpro.model.enums.SubscriptionPlan;
import com.sqlmasterpro.repository.*;
import com.sqlmasterpro.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final CourseRepository courseRepository;
    private final QuizRepository quizRepository;
    private final ChallengeRepository challengeRepository;
    private final PaymentRepository paymentRepository;
    private final CertificateRepository certificateRepository;
    private final BlogRepository blogRepository;
    private final QuestionRepository questionRepository;

    @Override
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("activeUsers", userRepository.countActiveUsers());
        stats.put("totalCourses", courseRepository.count());
        stats.put("totalQuizzes", quizRepository.count());
        stats.put("totalChallenges", challengeRepository.count());
        stats.put("totalQuestions", questionRepository.countByPublishedTrue());
        stats.put("totalCertificates", certificateRepository.count());
        stats.put("totalBlogs", blogRepository.count());
        stats.put("totalRevenue", paymentRepository.sumSuccessfulPayments() != null ?
            paymentRepository.sumSuccessfulPayments() : BigDecimal.ZERO);
        stats.put("totalPayments", paymentRepository.countSuccessfulPayments());
        return stats;
    }

    @Override
    public Page<User> getUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    @Transactional
    public User createUser(AdminCreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }

        Role role = roleRepository.findByName(request.getRole())
            .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + request.getRole()));

        User user = User.builder()
            .username(request.getUsername())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .emailVerified(true)
            .roles(new HashSet<>(Set.of(role)))
            .build();

        return userRepository.save(user);
    }

    @Override
    @Transactional
    public User updateUser(Long id, AdminUpdateUserRequest request) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.getEmail().equalsIgnoreCase(request.getEmail())
                && userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }
        if (!user.getUsername().equalsIgnoreCase(request.getUsername())
                && userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setProfilePicture(request.getProfilePicture());
        return userRepository.save(user);
    }

    @Override
    @Transactional
    public void deactivateUser(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        boolean isAdmin = user.getRoles().stream().anyMatch(role -> "ROLE_ADMIN".equals(role.getName()));
        if (isAdmin) {
            throw new BadRequestException("Admin users cannot be deactivated");
        }
        user.setActive(false);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public User updateUserPlan(Long id, SubscriptionPlan plan) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setSubscriptionPlan(plan);
        return userRepository.save(user);
    }

    @Override
    @Transactional
    public void activateUser(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setActive(true);
        userRepository.save(user);
    }

    @Override
    public Page<Payment> getPayments(Pageable pageable) {
        return paymentRepository.findAll(pageable);
    }

    @Override
    public Map<String, Object> getAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("userGrowth", Map.of("total", userRepository.count()));
        analytics.put("revenue", Map.of(
            "total", paymentRepository.sumSuccessfulPayments() != null ? paymentRepository.sumSuccessfulPayments() : 0,
            "transactions", paymentRepository.countSuccessfulPayments()
        ));
        analytics.put("content", Map.of(
            "courses", courseRepository.count(),
            "challenges", challengeRepository.count(),
            "quizzes", quizRepository.count()
        ));
        return analytics;
    }

    @Override
    @Transactional
    public Question createQuestion(Question question) {
        return questionRepository.save(question);
    }

    @Override
    @Transactional
    public Question updateQuestion(Long id, Question question) {
        questionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Question not found"));
        question.setId(id);
        return questionRepository.save(question);
    }

    @Override
    @Transactional
    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }

    @Override
    @Transactional
    public Challenge createChallenge(Challenge challenge) {
        return challengeRepository.save(challenge);
    }

    @Override
    @Transactional
    public Blog createBlog(Blog blog) {
        return blogRepository.save(blog);
    }
}
