package com.sqlmasterpro.config;

import com.sqlmasterpro.model.entity.Course;
import com.sqlmasterpro.model.entity.Lesson;
import com.sqlmasterpro.model.enums.DifficultyLevel;
import com.sqlmasterpro.repository.CourseRepository;
import com.sqlmasterpro.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;

    @Override
    @Transactional
    public void run(String... args) {
        if (courseRepository.count() > 0) {
            return;
        }
        log.info("No courses found — seeding starter SQL course catalog");

        seedCourse(
            "SQL Fundamentals", "Learn the basics of SQL — SELECT, WHERE, ORDER BY and more.",
            "Start your SQL journey from zero.", DifficultyLevel.BEGINNER, 0, false, 4,
            List.of(
                lesson("Introduction to Databases", "Learn what relational databases are and why SQL matters.", "TEXT", 10, 10),
                lesson("Your First SELECT Statement", "Learn to query data with SELECT and FROM.", "TEXT", 15, 15),
                lesson("Filtering with WHERE", "Filter rows using WHERE, AND, OR and comparison operators.", "INTERACTIVE", 20, 20),
                lesson("Sorting with ORDER BY", "Sort query results ascending or descending.", "INTERACTIVE", 15, 15)
            )
        );

        seedCourse(
            "Joins & Relationships", "Master INNER, LEFT, RIGHT and FULL joins across multiple tables.",
            "Connect data across tables like a pro.", DifficultyLevel.INTERMEDIATE, 1, false, 5,
            List.of(
                lesson("Understanding Table Relationships", "Primary keys, foreign keys, and how tables relate.", "TEXT", 12, 10),
                lesson("INNER JOIN", "Combine rows from two tables that match a condition.", "INTERACTIVE", 20, 20),
                lesson("LEFT and RIGHT JOIN", "Keep unmatched rows from one side of the join.", "INTERACTIVE", 20, 20),
                lesson("FULL OUTER JOIN", "Combine all rows from both tables, matched or not.", "INTERACTIVE", 18, 18),
                lesson("Self Joins", "Join a table to itself to compare rows within it.", "INTERACTIVE", 18, 18)
            )
        );

        seedCourse(
            "Aggregations & Grouping", "GROUP BY, HAVING, and aggregate functions like COUNT, SUM and AVG.",
            "Summarize and analyze your data.", DifficultyLevel.INTERMEDIATE, 2, true, 4,
            List.of(
                lesson("Aggregate Functions", "COUNT, SUM, AVG, MIN and MAX explained.", "TEXT", 15, 15),
                lesson("GROUP BY", "Group rows that share a column value.", "INTERACTIVE", 20, 20),
                lesson("HAVING vs WHERE", "Filter grouped results with HAVING.", "INTERACTIVE", 18, 18),
                lesson("Subqueries in Aggregations", "Combine subqueries with aggregate functions.", "INTERACTIVE", 22, 22)
            )
        );

        seedCourse(
            "Advanced SQL & Window Functions", "CTEs, window functions, and query optimization techniques.",
            "Write production-grade SQL queries.", DifficultyLevel.ADVANCED, 3, true, 4,
            List.of(
                lesson("Common Table Expressions (CTEs)", "Write readable, reusable subqueries with WITH.", "INTERACTIVE", 20, 25),
                lesson("Window Functions", "ROW_NUMBER, RANK and PARTITION BY explained.", "INTERACTIVE", 25, 25),
                lesson("Indexes & Query Performance", "How indexes speed up queries.", "TEXT", 18, 20),
                lesson("Query Optimization Patterns", "Common anti-patterns and how to fix them.", "TEXT", 20, 20)
            )
        );

        log.info("Seeding complete");
    }

    private void seedCourse(String title, String description, String shortDescription,
                             DifficultyLevel difficulty, int orderIndex, boolean premium,
                             int estimatedHours, List<Lesson> lessons) {
        Course course = Course.builder()
            .title(title)
            .description(description)
            .shortDescription(shortDescription)
            .difficulty(difficulty)
            .orderIndex(orderIndex)
            .premium(premium)
            .published(true)
            .estimatedHours(estimatedHours)
            .totalLessons(lessons.size())
            .build();
        Course saved = courseRepository.save(course);

        int idx = 0;
        for (Lesson lesson : lessons) {
            lesson.setOrderIndex(idx++);
            lesson.setPublished(true);
            lesson.setCourse(saved);
            lessonRepository.save(lesson);
        }
    }

    private Lesson lesson(String title, String content, String type, int durationMinutes, int xpReward) {
        return Lesson.builder()
            .title(title)
            .content(content)
            .lessonType(type)
            .durationMinutes(durationMinutes)
            .xpReward(xpReward)
            .build();
    }
}
