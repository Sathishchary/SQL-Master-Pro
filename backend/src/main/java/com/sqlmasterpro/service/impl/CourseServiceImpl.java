package com.sqlmasterpro.service.impl;

import com.sqlmasterpro.exception.ResourceNotFoundException;
import com.sqlmasterpro.model.entity.Course;
import com.sqlmasterpro.model.entity.Lesson;
import com.sqlmasterpro.model.enums.DifficultyLevel;
import com.sqlmasterpro.repository.CourseRepository;
import com.sqlmasterpro.repository.LessonRepository;
import com.sqlmasterpro.repository.QuizRepository;
import com.sqlmasterpro.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final QuizRepository quizRepository;

    @Override
    public List<Course> getAllCourses() {
        return courseRepository.findByPublishedTrueOrderByOrderIndexAsc();
    }

    @Override
    public Course getCourse(Long id) {
        return courseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
    }

    @Override
    public List<Course> getCoursesByDifficulty(DifficultyLevel level) {
        return courseRepository.findByDifficultyAndPublishedTrue(level);
    }

    @Override
    public List<Lesson> getCourseLessons(Long courseId) {
        return lessonRepository.findByCourseIdAndPublishedTrueOrderByOrderIndexAsc(courseId);
    }

    @Override
    @Transactional
    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    @Override
    @Transactional
    public Course updateCourse(Long id, Course course) {
        courseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        course.setId(id);
        return courseRepository.save(course);
    }

    @Override
    @Transactional
    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        quizRepository.deleteAll(quizRepository.findByCourseId(id));
        courseRepository.delete(course);
    }
}
