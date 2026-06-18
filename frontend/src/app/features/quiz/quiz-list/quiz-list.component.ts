import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ApiService } from '../../../core/services/api.service';
import { Quiz } from '../../../core/models/models';

@Component({
  selector: 'app-quiz-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatButtonModule, MatIconModule, MatProgressBarModule],
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.css']
})
export class QuizListComponent implements OnInit {
  quizzes: Quiz[] = [];
  displayedQuizzes: Quiz[] = [];
  selectedFilter = 'all';
  readonly String = String;

  filters = [
    { label: 'All',          value: 'all',          icon: 'apps' },
    { label: 'Beginner',     value: 'BEGINNER',     icon: 'eco' },
    { label: 'Intermediate', value: 'INTERMEDIATE', icon: 'bolt' },
    { label: 'Advanced',     value: 'ADVANCED',     icon: 'rocket_launch' },
    { label: 'Expert',       value: 'EXPERT',       icon: 'military_tech' },
  ];

  companies = ['Google', 'Amazon', 'Microsoft', 'Meta', 'Netflix', 'Uber', 'Oracle'];

  sampleQuizzes: Quiz[] = [
    { id: 1,  title: 'SQL Basics: SELECT & WHERE',       description: 'Master SELECT statements, WHERE clauses, LIKE, IN, BETWEEN, and NULL handling', difficulty: 'BEGINNER',     timeLimitMinutes: 15, passScore: 70, published: true, premium: false, randomizeQuestions: true },
    { id: 2,  title: 'Sorting & Limiting Results',        description: 'ORDER BY, LIMIT, OFFSET — control exactly what rows you return and in what order', difficulty: 'BEGINNER',     timeLimitMinutes: 12, passScore: 70, published: true, premium: false, randomizeQuestions: true },
    { id: 3,  title: 'String & Date Functions',           description: 'CONCAT, SUBSTRING, LENGTH, TRIM, DATE_PART, NOW, EXTRACT and 20+ built-in functions', difficulty: 'BEGINNER',     timeLimitMinutes: 20, passScore: 70, published: true, premium: false, randomizeQuestions: true },
    { id: 4,  title: 'SQL Joins Mastery',                 description: 'INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN — all join types with real datasets', difficulty: 'INTERMEDIATE', timeLimitMinutes: 30, passScore: 75, published: true, premium: false, randomizeQuestions: true },
    { id: 5,  title: 'Aggregates & GROUP BY',             description: 'COUNT, SUM, AVG, MIN, MAX with GROUP BY and HAVING clause deep dive', difficulty: 'INTERMEDIATE', timeLimitMinutes: 25, passScore: 70, published: true, premium: false, randomizeQuestions: true },
    { id: 6,  title: 'Subqueries & Correlated Queries',  description: 'Scalar subqueries, IN/EXISTS/ANY/ALL, correlated subqueries in WHERE and SELECT', difficulty: 'INTERMEDIATE', timeLimitMinutes: 35, passScore: 75, published: true, premium: false, randomizeQuestions: true },
    { id: 7,  title: 'UNION, INTERSECT & EXCEPT',        description: 'Set operations — combine, intersect, or subtract result sets with proper column matching', difficulty: 'INTERMEDIATE', timeLimitMinutes: 20, passScore: 70, published: true, premium: false, randomizeQuestions: true },
    { id: 8,  title: 'CASE WHEN & Conditional Logic',    description: 'Inline IF/ELSE using CASE expressions, COALESCE, NULLIF and conditional aggregates', difficulty: 'INTERMEDIATE', timeLimitMinutes: 22, passScore: 70, published: true, premium: false, randomizeQuestions: true },
    { id: 9,  title: 'Window Functions Fundamentals',     description: 'OVER(), PARTITION BY, ORDER BY inside windows — ROW_NUMBER, RANK, DENSE_RANK', difficulty: 'ADVANCED',     timeLimitMinutes: 40, passScore: 78, published: true, premium: true,  randomizeQuestions: true },
    { id: 10, title: 'LAG, LEAD & Running Totals',       description: 'Access previous/next rows with LAG/LEAD; compute running sums and moving averages', difficulty: 'ADVANCED',     timeLimitMinutes: 45, passScore: 78, published: true, premium: true,  randomizeQuestions: true },
    { id: 11, title: 'CTEs & Recursive Queries',         description: 'WITH clause, multiple CTEs, recursive CTEs for hierarchies and graph traversal', difficulty: 'ADVANCED',     timeLimitMinutes: 50, passScore: 80, published: true, premium: true,  randomizeQuestions: true },
    { id: 12, title: 'Indexing & Performance Tuning',    description: 'B-tree vs hash indexes, covering indexes, EXPLAIN ANALYZE output interpretation', difficulty: 'ADVANCED',     timeLimitMinutes: 45, passScore: 80, published: true, premium: true,  randomizeQuestions: true },
    { id: 13, title: 'Transactions & ACID Properties',   description: 'BEGIN/COMMIT/ROLLBACK, isolation levels, deadlocks, and savepoints', difficulty: 'ADVANCED',     timeLimitMinutes: 40, passScore: 78, published: true, premium: true,  randomizeQuestions: true },
    { id: 14, title: 'Database Design & Normalization',  description: '1NF/2NF/3NF/BCNF normal forms, primary keys, foreign keys, ERD reading', difficulty: 'ADVANCED',     timeLimitMinutes: 50, passScore: 80, published: true, premium: true,  randomizeQuestions: true },
    { id: 15, title: 'Expert SQL: Full Interview Drill', description: '60-question timed drill covering all SQL topics — used in FAANG SQL interviews', difficulty: 'EXPERT',       timeLimitMinutes: 90, passScore: 85, published: true, premium: true,  randomizeQuestions: true },
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getQuizzes().subscribe({
      next: (res) => {
        this.quizzes = (res.success && res.data?.content?.length > 0) ? res.data.content : this.sampleQuizzes;
        this.filterQuizzes();
      },
      error: () => { this.quizzes = this.sampleQuizzes; this.filterQuizzes(); }
    });
  }

  selectFilter(val: string): void {
    this.selectedFilter = val;
    this.filterQuizzes();
  }

  filterQuizzes(): void {
    this.displayedQuizzes = this.selectedFilter === 'all'
      ? this.quizzes
      : this.quizzes.filter(q => q.difficulty === this.selectedFilter);
  }

  getCategoryCount(val: string): number {
    return val === 'all' ? this.quizzes.length : this.quizzes.filter(q => q.difficulty === val).length;
  }

  getDiffWidth(diff: string): number {
    return { BEGINNER: 25, INTERMEDIATE: 55, ADVANCED: 80, EXPERT: 100 }[diff] ?? 50;
  }
}
