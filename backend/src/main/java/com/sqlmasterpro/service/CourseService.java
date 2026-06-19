package com.sqlmasterpro.service;

import com.sqlmasterpro.model.entity.Course;
import com.sqlmasterpro.model.entity.Lesson;
import com.sqlmasterpro.model.enums.DifficultyLevel;

import java.util.List;

public interface CourseService {
    List<Course> getAllCourses();
    Course getCourse(Long id);
    List<Course> getCoursesByDifficulty(DifficultyLevel level);
    List<Lesson> getCourseLessons(Long courseId);
    Course createCourse(Course course);
    Course updateCourse(Long id, Course course);
    void deleteCourse(Long id);
}
