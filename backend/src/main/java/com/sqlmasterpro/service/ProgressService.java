package com.sqlmasterpro.service;

import com.sqlmasterpro.model.entity.UserProgress;

import java.util.Map;

public interface ProgressService {
    UserProgress completeLesson(Long lessonId, Long userId, Map<String, Object> body);
    Map<String, Object> getMyProgress(Long userId);
    Map<String, Object> getCourseProgress(Long courseId, Long userId);
}
