import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-interview-prep',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule, MatExpansionModule],
  template: `
    <!-- ── HERO ── -->
    <div class="hero">
      <div class="orb o1"></div><div class="orb o2"></div>
      <div class="hero-inner">
        <div class="hero-badge"><mat-icon>work</mat-icon> Interview Preparation</div>
        <h1>Crack Your SQL Interview</h1>
        <p>200+ real questions asked at top tech companies — with detailed answers and explanations.</p>
        <div class="company-row">
          @for (c of companies; track c) {
            <span class="co">{{ c }}</span>
          }
        </div>
        <!-- Search -->
        <div class="search-wrap">
          <mat-icon>search</mat-icon>
          <input [(ngModel)]="search" (input)="onSearch()" placeholder="Search questions…">
          @if (search) {
            <button (click)="search=''; onSearch()" class="clear-btn">
              <mat-icon>close</mat-icon>
            </button>
          }
        </div>
      </div>
    </div>

    <div class="page">

      <!-- ── STATS ── -->
      <div class="stats-row">
        @for (s of stats; track s.label) {
          <div class="stat-card">
            <div class="sc-icon">{{ s.icon }}</div>
            <div class="sc-val">{{ s.val }}</div>
            <div class="sc-lbl">{{ s.label }}</div>
          </div>
        }
      </div>

      <!-- ── FILTERS ── -->
      <div class="filter-bar">
        @for (f of filters; track f.value) {
          <button class="f-btn"
            [class.active]="selectedFilter === f.value"
            (click)="selectFilter(f.value)">
            <mat-icon>{{ f.icon }}</mat-icon> {{ f.label }}
            <span class="fc">{{ getCount(f.value) }}</span>
          </button>
        }
      </div>

      <!-- ── RESULTS INFO ── -->
      @if (search) {
        <div class="results-info">
          <mat-icon>search</mat-icon>
          {{ flatFiltered.length }} result{{ flatFiltered.length !== 1 ? 's' : '' }} for "<strong>{{ search }}</strong>"
          <button (click)="search=''; onSearch()">Clear</button>
        </div>
      }

      <!-- ── SECTIONS ── -->
      @for (sec of filteredSections; track sec.title) {
        <div>
          <div class="sec-header">
            <span class="sec-icon">{{ sec.icon }}</span>
            <div>
              <h2>{{ sec.title }}</h2>
              <p>{{ sec.desc }}</p>
            </div>
            <span class="sec-count">{{ sec.questions.length }} questions</span>
          </div>

          <mat-accordion class="q-accordion">
            @for (q of sec.questions; track q.question; let i = $index) {
              <mat-expansion-panel class="q-panel">
                <mat-expansion-panel-header>
                  <mat-panel-title class="panel-title">
                    <span class="q-idx">Q{{ i + 1 }}</span>
                    <span class="q-text">{{ q.question }}</span>
                    <span class="level-badge" [class]="q.level.toLowerCase()">{{ q.level }}</span>
                  </mat-panel-title>
                </mat-expansion-panel-header>
                <div class="q-answer">
                  <div class="answer-label"><mat-icon>lightbulb</mat-icon> Answer</div>
                  <p>{{ q.answer }}</p>
                  @if (q.tags) {
                    <div class="q-tags">
                      @for (t of q.tags; track t) {
                        <span class="tag">{{ t }}</span>
                      }
                    </div>
                  }
                </div>
              </mat-expansion-panel>
            }
          </mat-accordion>
        </div>
      }

      <!-- ── EMPTY ── -->
      @if (filteredSections.length === 0) {
        <div class="empty">
          <mat-icon>search_off</mat-icon>
          <h3>No questions found</h3>
          <p>Try a different search term or filter</p>
          <button (click)="search=''; selectFilter('all')">Clear Filters</button>
        </div>
      }

      <!-- ── CTA ── -->
      <div class="cta-banner">
        <div class="cta-left">
          <h2>Ready to Practice with Real Queries?</h2>
          <p>Test your skills with interactive SQL challenges and quizzes.</p>
        </div>
        <div class="cta-btns">
          <a routerLink="/challenges" class="cta-btn primary">
            <mat-icon>code</mat-icon> SQL Challenges
          </a>
          <a routerLink="/quiz" class="cta-btn outline">
            <mat-icon>quiz</mat-icon> Take a Quiz
          </a>
        </div>
      </div>

    </div>
  `,
  styles: [`
    /* ── HERO ── */
    .hero {
      background: linear-gradient(145deg, #0d0221 0%, #1a0533 50%, #0f2744 100%);
      padding: 72px 32px 60px; text-align: center; position: relative; overflow: hidden;
    }
    .orb { position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.2; pointer-events: none; }
    .o1 { width: 500px; height: 500px; background: #7c3aed; top: -150px; left: -100px; }
    .o2 { width: 350px; height: 350px; background: #2563eb; bottom: -80px; right: -50px; }
    .hero-inner { position: relative; z-index: 2; max-width: 720px; margin: 0 auto; }
    .hero-badge {
      display: inline-flex; align-items: center; gap: 8px;
      background: rgba(124,58,237,0.2); border: 1px solid rgba(124,58,237,0.4);
      color: #c4b5fd; padding: 6px 18px; border-radius: 50px; font-size: 13px; font-weight: 600; margin-bottom: 20px;
      mat-icon { font-size: 16px; width: 16px; height: 16px; }
    }
    .hero h1 { font-size: clamp(28px,5vw,48px); font-weight: 900; color: white !important; margin: 0 0 14px; }
    .hero p  { font-size: 16px; color: rgba(255,255,255,0.6) !important; margin: 0 0 24px; line-height: 1.7; }
    .company-row { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-bottom: 28px;
      .co { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
        color: rgba(255,255,255,0.8); padding: 4px 14px; border-radius: 30px; font-size: 12px; font-weight: 700; }
    }
    .search-wrap {
      display: flex; align-items: center; gap: 10px;
      background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);
      border-radius: 50px; padding: 12px 20px; max-width: 520px; margin: 0 auto;
      mat-icon { color: rgba(255,255,255,0.4); font-size: 20px; width: 20px; height: 20px; }
      input { flex: 1; background: none; border: none; outline: none; color: white; font-size: 15px; font-family: inherit;
        &::placeholder { color: rgba(255,255,255,0.35); }
      }
      .clear-btn { background: none; border: none; cursor: pointer; padding: 0; display: flex; align-items: center;
        mat-icon { color: rgba(255,255,255,0.4); font-size: 18px; width: 18px; height: 18px; }
        &:hover mat-icon { color: white; }
      }
    }

    /* ── PAGE ── */
    .page { max-width: 960px; margin: 0 auto; padding: 40px 24px 80px; }

    /* ── STATS ── */
    .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 40px;
      @media (max-width: 640px) { grid-template-columns: repeat(2, 1fr); }
    }
    .stat-card { background: var(--surface); border-radius: 16px; padding: 20px; text-align: center;
      border: 1.5px solid var(--border); box-shadow: var(--shadow-sm);
      .sc-icon { font-size: 28px; margin-bottom: 8px; }
      .sc-val  { font-size: 26px; font-weight: 900; color: var(--text-primary); }
      .sc-lbl  { font-size: 12px; color: var(--text-muted); margin-top: 2px; font-weight: 600; }
    }

    /* ── FILTERS ── */
    .filter-bar { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px; }
    .f-btn {
      display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px;
      border: 1.5px solid var(--border); border-radius: 50px; background: var(--surface);
      font-size: 13px; font-weight: 600; color: var(--text-secondary); cursor: pointer; transition: all 0.2s; font-family: inherit;
      mat-icon { font-size: 16px; width: 16px; height: 16px; }
      .fc { background: var(--bg-secondary); color: var(--text-primary); border-radius: 20px; padding: 1px 7px; font-size: 11px; font-weight: 700; }
      &:hover { border-color: #667eea; color: #667eea; }
      &.active { background: #667eea; border-color: #667eea; color: white;
        .fc { background: rgba(255,255,255,0.25); color: white; }
      }
    }

    /* ── RESULTS INFO ── */
    .results-info { display: flex; align-items: center; gap: 8px; font-size: 14px; color: var(--text-secondary); margin-bottom: 20px;
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
      strong { color: var(--text-primary); }
      button { background: none; border: none; color: #667eea; font-weight: 600; cursor: pointer; font-size: 13px; }
    }

    /* ── SECTION HEADER ── */
    .sec-header { display: flex; align-items: flex-start; gap: 16px; margin: 40px 0 16px;
      .sec-icon { font-size: 36px; flex-shrink: 0; }
      h2 { font-size: 22px; font-weight: 900; margin: 0 0 4px; color: var(--text-primary); }
      p  { font-size: 13px; color: var(--text-secondary); margin: 0; }
      .sec-count { margin-left: auto; background: rgba(102,126,234,0.12); color: #667eea;
        padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; white-space: nowrap; flex-shrink: 0;
      }
    }

    /* ── ACCORDION ── */
    .q-accordion { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
    .q-panel {
      border-radius: 14px !important; border: 1.5px solid var(--border)!important;
      box-shadow: var(--shadow-sm) !important; background: var(--surface) !important;
      &.mat-expanded { border-color: #667eea !important; box-shadow: 0 4px 16px rgba(102,126,234,0.1) !important; }
    }
    .panel-title { display: flex; align-items: center; gap: 10px; width: 100%; }
    .q-idx { font-size: 12px; font-weight: 800; color: #667eea; background: rgba(102,126,234,0.12);
      padding: 2px 8px; border-radius: 6px; flex-shrink: 0;
    }
    .q-text { flex: 1; font-size: 14px; font-weight: 600; color: var(--text-primary); line-height: 1.4; }
    .level-badge { padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; flex-shrink: 0;
      &.easy   { background: #dcfce7; color: #16a34a; }
      &.medium { background: #fef3c7; color: #d97706; }
      &.hard,&.advanced { background: #fce7f3; color: #be185d; }
    }
    .q-answer { padding: 8px 0 4px;
      .answer-label { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 800;
        text-transform: uppercase; letter-spacing: 1px; color: #667eea; margin-bottom: 10px;
        mat-icon { font-size: 15px; width: 15px; height: 15px; }
      }
      p { font-size: 14px; color: var(--text-secondary); line-height: 1.85; margin: 0 0 12px; }
    }
    .q-tags { display: flex; flex-wrap: wrap; gap: 6px;
      .tag { background: var(--bg-secondary); color: var(--text-secondary); padding: 2px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; }
    }

    /* ── EMPTY ── */
    .empty { text-align: center; padding: 80px 20px; color: var(--text-muted);
      mat-icon { font-size: 56px; width: 56px; height: 56px; opacity: 0.4; margin-bottom: 16px; }
      h3 { font-size: 20px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px; }
      p  { margin-bottom: 20px; }
      button { background: #667eea; color: white; border: none; border-radius: 10px; padding: 10px 24px;
        font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; }
    }

    :host-context(.dark-theme) .level-badge {
      &.easy   { background: rgba(34,197,94,0.15); color: #4ade80; }
      &.medium { background: rgba(245,158,11,0.15); color: #fbbf24; }
      &.hard,&.advanced { background: rgba(236,72,153,0.15); color: #f472b6; }
    }

    /* ── CTA ── */
    .cta-banner {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 60%, #f093fb 100%);
      border-radius: 24px; padding: 44px 48px; display: flex; align-items: center;
      justify-content: space-between; gap: 32px; margin-top: 60px;
      box-shadow: 0 20px 60px rgba(102,126,234,0.35);
      @media (max-width: 700px) { flex-direction: column; padding: 32px 28px; }
      .cta-left {
        h2 { font-size: 24px; font-weight: 900; color: white !important; margin: 0 0 8px; }
        p  { color: rgba(255,255,255,0.75) !important; margin: 0; font-size: 14px; }
      }
    }
    .cta-btns { display: flex; gap: 12px; flex-shrink: 0; flex-wrap: wrap; }
    .cta-btn {
      display: flex; align-items: center; gap: 8px; padding: 12px 24px; border-radius: 12px;
      font-size: 14px; font-weight: 700; cursor: pointer; text-decoration: none; transition: all 0.2s;
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
      &.primary { background: white; color: #667eea; border: none;
        &:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.2); }
      }
      &.outline { background: rgba(255,255,255,0.15); color: white; border: 1.5px solid rgba(255,255,255,0.4);
        &:hover { background: rgba(255,255,255,0.25); }
      }
    }
  `]
})
export class InterviewPrepComponent {
  search = '';
  selectedFilter = 'all';

  companies = ['Google', 'Amazon', 'Microsoft', 'Meta', 'Apple', 'Netflix', 'Uber', 'Airbnb', 'Oracle', 'Stripe'];

  stats = [
    { icon: '❓', val: '200+', label: 'Questions' },
    { icon: '🏢', val: '10+',  label: 'Companies' },
    { icon: '📚', val: '5',    label: 'Categories' },
    { icon: '⭐', val: '4.9',  label: 'Rating' },
  ];

  filters = [
    { label: 'All',          value: 'all',       icon: 'apps' },
    { label: 'Easy',         value: 'Easy',      icon: 'eco' },
    { label: 'Medium',       value: 'Medium',    icon: 'bolt' },
    { label: 'Advanced',     value: 'Advanced',  icon: 'rocket_launch' },
  ];

  allSections = [
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

  filteredSections = [...this.allSections];
  flatFiltered: any[] = [];

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
