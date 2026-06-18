package com.sqlmasterpro.service.impl;

import com.sqlmasterpro.exception.ResourceNotFoundException;
import com.sqlmasterpro.model.entity.Lesson;
import com.sqlmasterpro.repository.LessonRepository;
import com.sqlmasterpro.service.LessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LessonServiceImpl implements LessonService {

    private final LessonRepository lessonRepository;

    @Override
    public Lesson getLesson(Long id) {
        return lessonRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));
    }
}
