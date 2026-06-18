import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { ApiService } from '../../../core/services/api.service';
import { Course } from '../../../core/models/models';
import { FilterOption, JourneyStep, FeatureCard } from '../../../core/models/models';

@Component({
  selector: 'app-module-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule,
    MatProgressBarModule, MatChipsModule, MatTooltipModule, MatRippleModule],
  templateUrl: './module-list.component.html',
  styleUrls: ['./module-list.component.css']
})
export class ModuleListComponent implements OnInit {
  courses: Course[] = [];
  courseProgress: Record<number, number> = {};
  activeFilter = 'all';

  filters: FilterOption[] = [
    { label: 'All Courses', value: 'all', icon: 'grid_view' },
    { label: 'Beginner', value: 'BEGINNER', icon: 'emoji_nature' },
    { label: 'Intermediate', value: 'INTERMEDIATE', icon: 'trending_up' },
    { label: 'Advanced', value: 'ADVANCED', icon: 'local_fire_department' },
    { label: 'Expert', value: 'EXPERT', icon: 'military_tech' },
  ];

  moduleIcons = ['🗄️', '🔍', '🔗', '⚙️', '📦', '🚀', '⚡', '📐', '🔐', '🏗️'];

  courseSkills: string[][] = [
    ['SELECT', 'WHERE', 'ORDER BY'],
    ['JOINs', 'UNION', 'Subqueries'],
    ['GROUP BY', 'HAVING', 'Aggregates'],
    ['CTEs', 'Window Fns', 'RANK'],
    ['Indexes', 'EXPLAIN', 'Tuning'],
    ['Triggers', 'Procedures', 'Functions'],
    ['Transactions', 'ACID', 'Locks'],
    ['Views', 'Materialized', 'ETL'],
    ['Partitions', 'Sharding', 'Scale'],
    ['NoSQL', 'JSON', 'JSONB'],
  ];

  journeySteps: JourneyStep[] = [
    { level: 'Level 1', title: 'SQL Foundations', color: 'green', icon: 'emoji_nature',
      skills: ['SELECT', 'WHERE', 'ORDER BY', 'LIMIT'] },
    { level: 'Level 2', title: 'Data Relationships', color: 'blue', icon: 'hub',
      skills: ['JOINs', 'Foreign Keys', 'UNION'] },
    { level: 'Level 3', title: 'Analytics & Aggregation', color: 'purple', icon: 'insights',
      skills: ['GROUP BY', 'Window Functions', 'CTEs'] },
    { level: 'Level 4', title: 'Expert & Performance', color: 'red', icon: 'military_tech',
      skills: ['Indexing', 'Query Plans', 'Optimization'] },
  ];

  features: FeatureCard[] = [
    { icon: 'terminal', title: 'Real SQL Execution', desc: 'Run queries against live PostgreSQL in the browser', bg: 'rgba(16,185,129,0.15)', color: '#10b981' },
    { icon: 'emoji_events', title: 'Gamified XP System', desc: 'Earn points, badges, and climb leaderboards', bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
    { icon: 'smart_toy', title: 'AI-Powered Hints', desc: 'Get intelligent feedback and query optimizations', bg: 'rgba(99,102,241,0.15)', color: '#818cf8' },
    { icon: 'workspace_premium', title: 'Certificates', desc: 'Earn verified certificates to share on LinkedIn', bg: 'rgba(236,72,153,0.15)', color: '#ec4899' },
  ];

  sampleCourses: Course[] = [
    { id: 1, title: 'SQL Foundations', shortDescription: 'Start from zero — SELECT, WHERE, ORDER BY, LIMIT and your first real queries.',
      description: 'The perfect starting point for anyone new to SQL. You will write your first queries against a real PostgreSQL database within minutes.',
      difficulty: 'BEGINNER', totalLessons: 12, estimatedHours: 4, premium: false, published: true, orderIndex: 1, createdAt: '' },
    { id: 2, title: 'Filtering & Sorting Mastery', shortDescription: 'WHERE clauses, LIKE, IN, BETWEEN, NULL handling, and multi-column ORDER BY.',
      description: 'Deep dive into filtering data with precision. Learn compound conditions, pattern matching, and how to handle NULLs correctly.',
      difficulty: 'BEGINNER', totalLessons: 10, estimatedHours: 3, premium: false, published: true, orderIndex: 2, createdAt: '' },
    { id: 3, title: 'SQL JOINs Explained', shortDescription: 'INNER, LEFT, RIGHT, FULL OUTER, CROSS, and SELF JOINs with real datasets.',
      description: 'Master every type of JOIN with visual diagrams and hands-on exercises against a real e-commerce database.',
      difficulty: 'BEGINNER', totalLessons: 14, estimatedHours: 5, premium: false, published: true, orderIndex: 3, createdAt: '' },
    { id: 4, title: 'Aggregates & GROUP BY', shortDescription: 'COUNT, SUM, AVG, MIN, MAX — plus GROUP BY and HAVING for data analysis.',
      description: 'Transform raw rows into meaningful summaries. Build reports, dashboards, and analytics queries from scratch.',
      difficulty: 'INTERMEDIATE', totalLessons: 11, estimatedHours: 4, premium: false, published: true, orderIndex: 4, createdAt: '' },
    { id: 5, title: 'Subqueries & CTEs', shortDescription: 'Correlated subqueries, EXISTS, WITH clauses, and multi-step query logic.',
      description: 'Write complex, layered queries using subqueries and Common Table Expressions. Break big problems into simple steps.',
      difficulty: 'INTERMEDIATE', totalLessons: 13, estimatedHours: 5, premium: false, published: true, orderIndex: 5, createdAt: '' },
    { id: 6, title: 'String, Date & Math Functions', shortDescription: 'CONCAT, SUBSTRING, DATE_TRUNC, EXTRACT, ROUND, CAST and 30+ built-in functions.',
      description: 'Manipulate and transform data directly in SQL. Clean messy strings, compute date ranges, and format numbers.',
      difficulty: 'INTERMEDIATE', totalLessons: 10, estimatedHours: 4, premium: false, published: true, orderIndex: 6, createdAt: '' },
    { id: 7, title: 'Window Functions', shortDescription: 'RANK, ROW_NUMBER, LAG, LEAD, NTILE, running totals and moving averages.',
      description: 'The most powerful feature in modern SQL. Do analytics that used to require Python or Excel — all inside a single query.',
      difficulty: 'ADVANCED', totalLessons: 16, estimatedHours: 7, premium: true, published: true, orderIndex: 7, createdAt: '' },
    { id: 8, title: 'Database Design & Normalization', shortDescription: 'ERD, 1NF–3NF, primary keys, foreign keys, and schema design best practices.',
      description: 'Design databases that scale. Learn normalization theory, avoid common pitfalls, and read real-world schema diagrams.',
      difficulty: 'INTERMEDIATE', totalLessons: 12, estimatedHours: 5, premium: false, published: true, orderIndex: 8, createdAt: '' },
    { id: 9, title: 'Query Performance & Indexing', shortDescription: 'EXPLAIN ANALYZE, B-tree & GIN indexes, covering indexes, and query tuning.',
      description: 'Make slow queries fast. Understand how PostgreSQL plans queries, when to add indexes, and how to read execution plans.',
      difficulty: 'ADVANCED', totalLessons: 14, estimatedHours: 6, premium: true, published: true, orderIndex: 9, createdAt: '' },
    { id: 10, title: 'Transactions & Concurrency', shortDescription: 'ACID, isolation levels, deadlocks, row-level locking, and savepoints.',
      description: 'Write safe concurrent SQL. Understand transactions deeply enough to avoid race conditions and data corruption in production.',
      difficulty: 'ADVANCED', totalLessons: 10, estimatedHours: 5, premium: true, published: true, orderIndex: 10, createdAt: '' },
    { id: 11, title: 'PostgreSQL JSON & JSONB', shortDescription: 'Store, query, and index semi-structured data with JSONB operators and GIN indexes.',
      description: 'Bridge the gap between relational and document databases. Query JSON fields with the same power as regular columns.',
      difficulty: 'ADVANCED', totalLessons: 11, estimatedHours: 5, premium: true, published: true, orderIndex: 11, createdAt: '' },
    { id: 12, title: 'Expert SQL: Recursive Queries', shortDescription: 'Recursive CTEs for hierarchies, graphs, and sequences — the hardest SQL patterns.',
      description: 'Write recursive queries to traverse trees, org charts, and graph data structures. Topics that separate SQL experts from everyone else.',
      difficulty: 'EXPERT', totalLessons: 9, estimatedHours: 6, premium: true, published: true, orderIndex: 12, createdAt: '' },
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getCourses().subscribe({
      next: (res) => {
        if (res.success && res.data?.length > 0) {
          this.courses = res.data;
        } else {
          this.courses = this.sampleCourses;
        }
      },
      error: () => { this.courses = this.sampleCourses; }
    });
  }

  get filteredCourses(): Course[] {
    if (this.activeFilter === 'all') return this.courses;
    return this.courses.filter(c => c.difficulty === this.activeFilter);
  }

  setFilter(value: string): void { this.activeFilter = value; }

  getCount(filter: string): number {
    if (filter === 'all') return this.courses.length;
    return this.courses.filter(c => c.difficulty === filter).length;
  }

  displayIndex(course: Course): number {
    return this.courses.indexOf(course);
  }

  getModuleIcon(index: number): string { return this.moduleIcons[index % this.moduleIcons.length]; }
  getCourseSkills(index: number): string[] { return this.courseSkills[index % this.courseSkills.length]; }
  getCourseProgress(courseId: number): number { return this.courseProgress[courseId] || 0; }
  padNum(n: number): string { return n < 10 ? `0${n}` : `${n}`; }
}
