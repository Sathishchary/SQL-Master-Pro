import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { InterviewStat, FilterOption, InterviewSection, InterviewQuestion } from '../../core/models/models';

@Component({
  selector: 'app-interview-prep',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule, MatExpansionModule],
  templateUrl: './interview-prep.component.html',
  styleUrls: ['./interview-prep.component.css']
})
export class InterviewPrepComponent {
  search = '';
  selectedFilter = 'all';

  companies = ['Google', 'Amazon', 'Microsoft', 'Meta', 'Apple', 'Netflix', 'Uber', 'Airbnb', 'Oracle', 'Stripe'];

  stats: InterviewStat[] = [
    { icon: '❓', val: '200+', label: 'Questions' },
    { icon: '🏢', val: '10+',  label: 'Companies' },
    { icon: '📚', val: '5',    label: 'Categories' },
    { icon: '⭐', val: '4.9',  label: 'Rating' },
  ];

  filters: FilterOption[] = [
    { label: 'All',          value: 'all',       icon: 'apps' },
    { label: 'Easy',         value: 'Easy',      icon: 'eco' },
    { label: 'Medium',       value: 'Medium',    icon: 'bolt' },
    { label: 'Advanced',     value: 'Advanced',  icon: 'rocket_launch' },
  ];

  allSections: InterviewSection[] = [
    {
      icon: '🌱', title: 'SQL Fundamentals', category: 'Easy',
      desc: 'Core SQL concepts every developer must know',
      questions: [
        { question: 'What is SQL and what is it used for?', level: 'Easy', tags: ['Basics', 'Definition'],
          answer: 'SQL (Structured Query Language) is a standard language for managing relational databases. It is used to query, insert, update, and delete data, and to define/modify database schema.' },
        { question: 'What is the difference between DELETE, TRUNCATE, and DROP?', level: 'Easy', tags: ['DDL', 'DML'],
          answer: 'DELETE removes specific rows (can be rolled back, fires triggers). TRUNCATE removes all rows faster without logging each row. DROP removes the entire table and its structure.' },
        { question: 'What is a PRIMARY KEY?', level: 'Easy', tags: ['Constraints'],
          answer: 'A PRIMARY KEY uniquely identifies each row in a table. It cannot be NULL and must be unique. A table can have only one primary key, but it can be composite (multiple columns).' },
        { question: 'What is a FOREIGN KEY and why is it used?', level: 'Easy', tags: ['Constraints', 'Relations'],
          answer: 'A FOREIGN KEY is a column referencing the PRIMARY KEY of another table. It enforces referential integrity — you cannot insert a value that does not exist in the parent table.' },
        { question: 'What does SELECT DISTINCT do?', level: 'Easy', tags: ['SELECT'],
          answer: 'DISTINCT removes duplicate rows from the result set. SELECT DISTINCT col FROM t returns only one row per unique value of col.' },
        { question: 'What is the difference between CHAR and VARCHAR?', level: 'Easy', tags: ['Data Types'],
          answer: 'CHAR(n) is fixed-length — always stores exactly n characters, padding with spaces. VARCHAR(n) is variable-length and only uses the space needed. Use CHAR for fixed-size data like country codes, VARCHAR for variable-length strings.' },
      ]
    },
    {
      icon: '⚡', title: 'Joins & Relationships', category: 'Medium',
      desc: 'Combining data from multiple tables — a must-have skill',
      questions: [
        { question: 'What is the difference between INNER JOIN and LEFT JOIN?', level: 'Medium', tags: ['Joins'],
          answer: 'INNER JOIN returns only rows where the ON condition matches in BOTH tables. LEFT JOIN returns all rows from the left table, with NULLs for unmatched right-table columns.' },
        { question: 'What is a SELF JOIN and when would you use it?', level: 'Medium', tags: ['Joins'],
          answer: 'A SELF JOIN joins a table to itself. Common use case: finding employees and their managers in the same employees table — SELECT e.name, m.name AS manager FROM employees e JOIN employees m ON e.manager_id = m.id.' },
        { question: 'What does a FULL OUTER JOIN return?', level: 'Medium', tags: ['Joins'],
          answer: 'FULL OUTER JOIN returns all rows from both tables. Rows with no match get NULLs in the other table\'s columns. It is the union of LEFT JOIN and RIGHT JOIN.' },
        { question: 'What is a CROSS JOIN?', level: 'Medium', tags: ['Joins'],
          answer: 'CROSS JOIN returns the Cartesian product — every combination of rows from both tables. A table of 5 rows × a table of 4 rows = 20 rows. It has no ON clause.' },
        { question: 'How do you find employees without a matching department?', level: 'Medium', tags: ['Joins', 'NULL'],
          answer: 'Use a LEFT JOIN and filter for NULLs: SELECT e.name FROM employees e LEFT JOIN departments d ON e.dept_id = d.id WHERE d.id IS NULL.' },
      ]
    },
    {
      icon: '📊', title: 'Aggregation & Grouping', category: 'Medium',
      desc: 'COUNT, SUM, GROUP BY, HAVING — analytics essentials',
      questions: [
        { question: 'What is the difference between WHERE and HAVING?', level: 'Medium', tags: ['Aggregation', 'Filtering'],
          answer: 'WHERE filters individual rows BEFORE grouping/aggregation. HAVING filters groups AFTER GROUP BY. WHERE cannot use aggregate functions; HAVING can.' },
        { question: 'How do you find the second highest salary?', level: 'Medium', tags: ['Aggregation', 'Subquery'],
          answer: 'SELECT MAX(salary) FROM employees WHERE salary < (SELECT MAX(salary) FROM employees). Or use: SELECT salary FROM employees ORDER BY salary DESC LIMIT 1 OFFSET 1.' },
        { question: 'What does COUNT(*) vs COUNT(column) do differently?', level: 'Easy', tags: ['Aggregation'],
          answer: 'COUNT(*) counts all rows including those with NULLs. COUNT(column) counts only rows where that column is NOT NULL. Use COUNT(*) for total rows, COUNT(col) to count non-null values.' },
        { question: 'How do you count distinct values per group?', level: 'Medium', tags: ['Aggregation'],
          answer: 'SELECT dept, COUNT(DISTINCT job_title) FROM employees GROUP BY dept — this counts unique job titles per department.' },
      ]
    },
    {
      icon: '🚀', title: 'Window Functions', category: 'Advanced',
      desc: 'ROW_NUMBER, RANK, LAG, LEAD — senior-level questions',
      questions: [
        { question: 'Explain the difference between RANK(), DENSE_RANK(), and ROW_NUMBER()', level: 'Advanced', tags: ['Window Functions'],
          answer: 'ROW_NUMBER() gives unique sequential numbers (1,2,3,4). RANK() gives tied values the same rank but skips (1,1,3,4). DENSE_RANK() gives tied values the same rank without skipping (1,1,2,3).' },
        { question: 'What does PARTITION BY do in a window function?', level: 'Advanced', tags: ['Window Functions'],
          answer: 'PARTITION BY divides the result set into groups (partitions). The window function resets and recalculates for each partition, similar to GROUP BY but without collapsing rows.' },
        { question: 'How would you calculate a running total in SQL?', level: 'Advanced', tags: ['Window Functions', 'Analytics'],
          answer: 'SELECT date, amount, SUM(amount) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total FROM sales.' },
        { question: 'What is the difference between LAG() and LEAD()?', level: 'Advanced', tags: ['Window Functions'],
          answer: 'LAG(col, n) accesses the value n rows BEHIND the current row in the ORDER BY. LEAD(col, n) accesses n rows AHEAD. Both return NULL if the offset goes out of the partition.' },
        { question: 'How do you find the top N records per group?', level: 'Advanced', tags: ['Window Functions', 'Ranking'],
          answer: 'Use ROW_NUMBER(): WITH ranked AS (SELECT *, ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC) AS rn FROM employees) SELECT * FROM ranked WHERE rn <= 3.' },
      ]
    },
    {
      icon: '🏗️', title: 'CTEs, Subqueries & Performance', category: 'Advanced',
      desc: 'Query optimization and advanced SQL patterns',
      questions: [
        { question: 'What is a CTE and when would you use it over a subquery?', level: 'Advanced', tags: ['CTE', 'Readability'],
          answer: 'A CTE (WITH clause) is a named temporary result. Prefer CTEs when the same subquery is referenced multiple times, when using recursive queries, or when readability matters. Subqueries are fine for one-time use.' },
        { question: 'What is a recursive CTE? Give an example use case.', level: 'Advanced', tags: ['CTE', 'Recursive'],
          answer: 'A recursive CTE references itself. Example: traversing an org hierarchy — WITH RECURSIVE org AS (SELECT id, name, manager_id FROM employees WHERE manager_id IS NULL UNION ALL SELECT e.id, e.name, e.manager_id FROM employees e JOIN org ON e.manager_id = org.id) SELECT * FROM org.' },
        { question: 'What is an index and how does it speed up queries?', level: 'Medium', tags: ['Performance', 'Indexing'],
          answer: 'An index is a sorted data structure (usually B-tree) on one or more columns. It lets the database find rows without scanning the full table. Trade-off: faster SELECTs, but slower INSERT/UPDATE/DELETE and more storage.' },
        { question: 'What does EXPLAIN ANALYZE tell you?', level: 'Advanced', tags: ['Performance', 'PostgreSQL'],
          answer: 'EXPLAIN ANALYZE shows the query execution plan AND actually runs the query, reporting actual vs estimated rows, time per node, and whether indexes are used. Look for Seq Scans on large tables as potential optimization targets.' },
        { question: 'What is the N+1 query problem?', level: 'Advanced', tags: ['Performance', 'ORM'],
          answer: 'N+1 occurs when you fetch N records then run 1 query per record to get related data (N+1 total). Fix by using JOIN or eager loading to fetch everything in 1-2 queries.' },
      ]
    },
  ];

  filteredSections: InterviewSection[] = [...this.allSections];
  flatFiltered: InterviewQuestion[] = [];

  get allQuestions() {
    return this.allSections.flatMap(s => s.questions);
  }

  getCount(filter: string): number {
    if (filter === 'all') return this.allQuestions.length;
    return this.allQuestions.filter(q => q.level === filter).length;
  }

  selectFilter(val: string): void {
    this.selectedFilter = val;
    this.applyFilters();
  }

  onSearch(): void { this.applyFilters(); }

  applyFilters(): void {
    const q = this.search.toLowerCase().trim();
    this.filteredSections = this.allSections
      .map(sec => ({
        ...sec,
        questions: sec.questions.filter(item => {
          const matchesFilter = this.selectedFilter === 'all' || item.level === this.selectedFilter;
          const matchesSearch = !q || item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q);
          return matchesFilter && matchesSearch;
        })
      }))
      .filter(sec => sec.questions.length > 0);

    this.flatFiltered = this.filteredSections.flatMap(s => s.questions);
  }
}
