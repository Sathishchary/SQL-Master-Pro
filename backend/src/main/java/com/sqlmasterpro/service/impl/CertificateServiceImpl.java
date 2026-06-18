package com.sqlmasterpro.service.impl;

import com.sqlmasterpro.exception.ResourceNotFoundException;
import com.sqlmasterpro.model.entity.Certificate;
import com.sqlmasterpro.model.entity.Course;
import com.sqlmasterpro.model.entity.User;
import com.sqlmasterpro.repository.CertificateRepository;
import com.sqlmasterpro.repository.CourseRepository;
import com.sqlmasterpro.repository.UserRepository;
import com.sqlmasterpro.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CertificateServiceImpl implements CertificateService {

    private final CertificateRepository certificateRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    @Override
    public List<Certificate> getMyCertificates(Long userId) {
        return certificateRepository.findByUserId(userId);
    }

    @Override
    @Transactional
    public Certificate issueCertificate(Long courseId, Long userId) {
        if (certificateRepository.existsByUserIdAndCourseId(userId, courseId)) {
            return certificateRepository.findByUserIdAndCourseId(userId, courseId).get();
        }

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        String certNumber = "SMP-" + LocalDate.now().getYear() + "-" + String.format("%06d", user.getId()) + "-" + courseId;

        Certificate cert = Certificate.builder()
            .user(user)
            .course(course)
            .certificateNumber(certNumber)
            .completionScore(100)
            .grade("A")
            .build();

        certificateRepository.save(cert);
        return cert;
    }

    @Override
    public Certificate verifyCertificate(String certNumber) {
        return certificateRepository.findByCertificateNumber(certNumber)
            .orElseThrow(() -> new ResourceNotFoundException("Certificate not found"));
    }
}
