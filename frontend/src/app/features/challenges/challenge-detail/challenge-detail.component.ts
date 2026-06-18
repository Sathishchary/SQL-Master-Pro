import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { ApiService } from '../../../core/services/api.service';
import { Challenge, SqlExecutionResponse } from '../../../core/models/models';

@Component({
  selector: 'app-challenge-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule,
    MatTabsModule, MatSnackBarModule, MatProgressSpinnerModule, MatChipsModule],
  template: `
    @if (loading) {
      <div class="loading-wrap">
        <mat-spinner diameter="48"></mat-spinner>
        <p>Loading challenge...</p>
      </div>
    }

    @if (challenge && !loading) {
      <div class="challenge-layout">
        <!-- Left Panel: Problem Description -->
        <div class="problem-panel">
          <div class="problem-header">
            <a routerLink="/challenges" mat-icon-button><mat-icon>arrow_back</mat-icon></a>
            <div class="problem-title-area">
              <span class="diff-badge" [class]="challenge.difficulty.toLowerCase()">{{ challenge.difficulty }}</span>
              <h1>{{ challenge.title }}</h1>
            </div>
            <div class="problem-rewards">
              <span class="pts">{{ challenge.points }} pts</span>
              <span class="xp">+{{ challenge.xpReward }} XP</span>
            </div>
          </div>

          <mat-tab-group>
            <mat-tab label="Problem">
              <div class="problem-content">
                <div class="section">
                  <h3>Problem Statement</h3>
                  <p>{{ challenge.problemStatement || challenge.description }}</p>
                </div>
                <div class="section">
                  <h3>Database</h3>
                  <code>{{ challenge.databaseName }}</code>
                </div>
                @if (showHints && challenge.hints) {
                  <div class="section hint-section">
                    <h3>💡 Hints</h3>
                    <div class="hints">{{ challenge.hints }}</div>
                  </div>
                }
                <button mat-stroked-button (click)="showHints = !showHints">
                  <mat-icon>lightbulb</mat-icon>
                  {{ showHints ? 'Hide Hints' : 'Show Hints' }}
                </button>
              </div>
            </mat-tab>
            <mat-tab label="Expected Output">
              <div class="problem-content">
                <pre class="expected-output">{{ challenge.expectedOutput || 'Run the correct query to see expected output' }}</pre>
              </div>
            </mat-tab>
          </mat-tab-group>
        </div>

        <!-- Right Panel: Editor & Results -->
        <div class="editor-panel">
          <div class="editor-area">
            <div class="editor-header">
              <span>SQL Editor</span>
              <span class="db-label"><mat-icon>storage</mat-icon> {{ challenge.databaseName }}</span>
            </div>
            <textarea class="sql-editor" [(ngModel)]="userQuery" wrap="off"
              placeholder="Write your SQL solution here..."
              (keydown.ctrl.enter)="submitSolution()">
            </textarea>
          </div>

          <div class="editor-actions">
            <button mat-raised-button (click)="runQuery()" [disabled]="isRunning" color="basic">
              <mat-icon>play_arrow</mat-icon> Run
            </button>
            <button mat-raised-button color="primary" (click)="submitSolution()" [disabled]="isSubmitting">
              @if (isSubmitting) {
                <mat-spinner diameter="18"></mat-spinner>
              } @else {
                <mat-icon>check</mat-icon>
              }
              {{ isSubmitting ? 'Submitting...' : 'Submit Solution' }}
            </button>
            <button mat-button (click)="resetQuery()"><mat-icon>refresh</mat-icon> Reset</button>
          </div>

          <!-- Result Panel -->
          <div class="result-panel">
            @if (verdict) {
              <div class="verdict" [class]="verdict.type">
                <mat-icon>{{ verdict.type === 'success' ? 'check_circle' : 'cancel' }}</mat-icon>
                <div>
                  <div class="verdict-title">{{ verdict.title }}</div>
                  <div class="verdict-msg">{{ verdict.message }}</div>
                </div>
                @if (verdict.type === 'success') {
                  <div class="verdict-reward">+{{ challenge.xpReward }} XP</div>
                }
              </div>
            }

            @if (executionResult) {
              <div class="query-result">
                <div class="result-meta">
                  <mat-chip-set>
                    <mat-chip [highlighted]="executionResult.success" [color]="executionResult.success ? 'primary' : 'warn'">
                      {{ executionResult.success ? executionResult.rowCount + ' rows' : 'Error' }}
                    </mat-chip>
                    <mat-chip>{{ executionResult.executionTimeMs }}ms</mat-chip>
                  </mat-chip-set>
                </div>
                @if (!executionResult.success) {
                  <div class="error-msg">
                    <div class="error-friendly">{{ friendlyError(executionResult.error) }}</div>
                    <div class="error-raw">{{ executionResult.error }}</div>
                  </div>
                }
                @if (executionResult.success && executionResult.rows?.length) {
                  <div class="result-table-wrap">
                    <table class="result-table">
                      <thead><tr>
                        @for (col of executionResult.columns; track col) {
                          <th>{{ col }}</th>
                        }
                      </tr></thead>
                      <tbody>
                        @for (row of executionResult.rows?.slice(0, 20); track $index) {
                          <tr>
                            @for (col of executionResult.columns; track col) {
                              <td>{{ row[col] ?? 'NULL' }}</td>
                            }
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .loading-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center;
      height: calc(100vh - 64px); gap: 16px; color: var(--text-secondary); font-size: 14px;
    }
    .challenge-layout { display: grid; grid-template-columns: 1fr 1fr; height: calc(100vh - 64px); overflow: hidden;
      @media (max-width: 968px) { grid-template-columns: 1fr; overflow: auto; }
    }
    .problem-panel { overflow-y: auto; border-right: 1px solid var(--border); padding: 0; background: var(--surface); }
    .problem-header { display: flex; align-items: flex-start; gap: 12px; padding: 20px;
      border-bottom: 1px solid var(--border);
      h1 { font-size: 18px; font-weight: 800; margin: 4px 0 0; color: var(--text-primary); }
    }
    .problem-title-area { flex: 1; }
    .diff-badge { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700;
      &.easy { background: #dcfce7; color: #16a34a; }
      &.medium { background: #fef3c7; color: #d97706; }
      &.advanced { background: #fce7f3; color: #be185d; }
    }
    :host-context(.dark-theme) .diff-badge {
      &.easy { background: rgba(34,197,94,0.15); color: #4ade80; }
      &.medium { background: rgba(245,158,11,0.15); color: #fbbf24; }
      &.advanced { background: rgba(236,72,153,0.15); color: #f472b6; }
    }
    .problem-rewards { display: flex; flex-direction: column; gap: 4px; align-items: flex-end;
      .pts { font-weight: 700; color: #667eea; }
      .xp { font-size: 12px; color: #9f7aea; }
    }
    .problem-content { padding: 16px 20px; }
    .section { margin-bottom: 20px;
      h3 { font-weight: 700; font-size: 14px; margin-bottom: 8px; color: var(--text-primary); }
      p { color: var(--text-secondary); line-height: 1.7; font-size: 14px; }
      code { background: var(--bg-secondary); color: var(--text-primary); padding: 4px 8px; border-radius: 4px; font-family: monospace; }
    }
    .hint-section .hints { background: rgba(245,158,11,0.1); padding: 12px; border-radius: 8px; font-size: 13px; color: var(--text-secondary); border: 1px solid rgba(245,158,11,0.3); }
    .expected-output { background: #1e1e2e; color: #e0e0e0; padding: 16px; border-radius: 8px;
      font-family: monospace; font-size: 12px; overflow-x: auto;
    }
    .editor-panel { display: flex; flex-direction: column; overflow: hidden; }
    .editor-area { flex: 1; display: flex; flex-direction: column; border-bottom: 1px solid var(--border); }
    .editor-header { display: flex; justify-content: space-between; padding: 8px 16px;
      background: #2d2d3f; color: #a0aec0; font-size: 13px;
      .db-label { display: flex; align-items: center; gap: 4px; color: #667eea;
        mat-icon { font-size: 14px; width: 14px; height: 14px; }
      }
    }
    .sql-editor { flex: 1; min-height: 250px; background: #1e1e2e; color: #e0e0e0;
      border: none; outline: none; padding: 16px; font-family: 'JetBrains Mono', monospace;
      font-size: 14px; line-height: 1.7; resize: none; overflow-x: auto; white-space: pre;
    }
    .editor-actions { display: flex; gap: 8px; padding: 12px 16px; border-bottom: 1px solid var(--border); background: var(--surface); }
    .result-panel { flex: 1; overflow-y: auto; padding: 16px; background: var(--bg-secondary); }
    .verdict { display: flex; align-items: center; gap: 12px; padding: 16px; border-radius: 12px;
      margin-bottom: 16px;
      &.success { background: rgba(72,187,120,0.1); border: 1px solid rgba(72,187,120,0.4);
        mat-icon, .verdict-title { color: #48bb78; }
      }
      &.error { background: rgba(245,101,101,0.1); border: 1px solid rgba(245,101,101,0.4);
        mat-icon, .verdict-title { color: #f56565; }
      }
      mat-icon { font-size: 32px; width: 32px; height: 32px; }
      .verdict-title { font-weight: 700; font-size: 16px; }
      .verdict-msg { font-size: 13px; color: var(--text-secondary); }
      .verdict-reward { margin-left: auto; font-size: 20px; font-weight: 900; color: #9f7aea; }
    }
    .error-msg { background: rgba(197,48,48,0.1); border: 1px solid rgba(245,101,101,0.3); padding: 12px 14px; border-radius: 8px; }
    .error-friendly { color: #f56565; font-size: 14px; font-weight: 600; margin-bottom: 6px; }
    .error-raw { color: #c53030; opacity: 0.75; font-family: monospace; font-size: 12px; white-space: pre-wrap; }
    .result-table-wrap { overflow-x: auto; border-radius: 8px; border: 1px solid var(--border); }
    .result-table { width: 100%; border-collapse: collapse; font-size: 12px; background: var(--surface);
      th { background: #667eea; color: white; padding: 8px 12px; text-align: left; }
      td { padding: 6px 12px; border-bottom: 1px solid var(--border); color: var(--text-primary); }
    }
  `]
})
export class ChallengeDetailComponent implements OnInit {
  challenge: Challenge | null = null;
  userQuery = '';
  isRunning = false;
  isSubmitting = false;
  showHints = false;
  loading = true;
  executionResult: SqlExecutionResponse | null = null;
  verdict: { type: string; title: string; message: string } | null = null;

  private sampleChallenges: Challenge[] = [
    { id: 1, title: 'Find All Active Users', description: 'Write a query to retrieve all users who have logged in within the last 30 days.', problemStatement: 'The `employees` table has columns: id, first_name, last_name, email, salary, department_id, hire_date.\n\nWrite a SQL query to retrieve the first_name, last_name, and email of all employees hired in the last 365 days, ordered by hire_date descending.', starterQuery: 'SELECT first_name, last_name, email\nFROM employees\nWHERE -- your condition here\nORDER BY hire_date DESC;', hints: 'Use WHERE hire_date >= CURRENT_DATE - INTERVAL \'365 days\'', difficulty: 'EASY', points: 10, xpReward: 50, databaseName: 'employee_db', premium: false, topic: 'SELECT', totalSubmissions: 1240, successfulSubmissions: 1050 },
    { id: 2, title: 'Top 5 Products by Revenue', description: 'Find the top 5 products generating the highest total revenue using GROUP BY and ORDER BY.', problemStatement: 'The `employees` table has columns: id, first_name, last_name, salary, department_id.\n\nWrite a SQL query to find the top 5 highest-paid employees. Return their first_name, last_name, and salary ordered by salary descending.', starterQuery: 'SELECT first_name, last_name, salary\nFROM employees\nORDER BY salary DESC\nLIMIT 5;', hints: 'Use ORDER BY salary DESC and LIMIT 5', difficulty: 'EASY', points: 15, xpReward: 75, databaseName: 'employee_db', premium: false, topic: 'AGGREGATE', totalSubmissions: 980, successfulSubmissions: 780 },
    { id: 3, title: 'Employee Department JOIN', description: 'List all employees with their department name using an INNER JOIN on the departments table.', problemStatement: 'Tables:\n- employees(id, first_name, last_name, salary, department_id)\n- departments(id, department_name)\n\nWrite a query to list all employees with their department name. Return first_name, last_name, and department_name.', starterQuery: 'SELECT e.first_name, e.last_name, d.department_name\nFROM employees e\nINNER JOIN departments d ON e.department_id = d.id;', hints: 'Use INNER JOIN departments ON e.department_id = d.id', difficulty: 'EASY', points: 20, xpReward: 100, databaseName: 'employee_db', premium: false, topic: 'JOIN', totalSubmissions: 1500, successfulSubmissions: 1350 },
    { id: 4, title: 'Second Highest Salary', description: 'Find the second highest salary from the employees table without using LIMIT OFFSET.', problemStatement: 'Table: employees(id, first_name, last_name, salary)\n\nFind the second highest salary value. Return a single row with column "second_highest_salary". If no second value exists, return NULL.', starterQuery: 'SELECT MAX(salary) AS second_highest_salary\nFROM employees\nWHERE salary < (SELECT MAX(salary) FROM employees);', hints: 'Use a subquery: WHERE salary < (SELECT MAX(salary) FROM employees)', difficulty: 'MEDIUM', points: 30, xpReward: 150, databaseName: 'employee_db', premium: false, topic: 'SUBQUERY', totalSubmissions: 2200, successfulSubmissions: 1430 },
    { id: 5, title: 'Average Salary by Department', description: 'Find all customers who have never placed an order using a LEFT JOIN or NOT EXISTS subquery.', problemStatement: 'Tables:\n- employees(id, first_name, last_name, salary, department_id)\n- departments(id, department_name)\n\nWrite a query to calculate the average salary per department. Return department_name and avg_salary, ordered by avg_salary descending.', starterQuery: 'SELECT d.department_name, AVG(e.salary) AS avg_salary\nFROM employees e\nJOIN departments d ON e.department_id = d.id\nGROUP BY d.department_name\nORDER BY avg_salary DESC;', hints: 'Use GROUP BY department and AVG(salary)', difficulty: 'MEDIUM', points: 35, xpReward: 175, databaseName: 'employee_db', premium: false, topic: 'JOIN', totalSubmissions: 1800, successfulSubmissions: 990 },
    { id: 6, title: 'Department Head Count', description: 'Generate a monthly sales report showing total orders, revenue, and average order value per month.', problemStatement: 'Tables:\n- employees(id, first_name, last_name, salary, department_id)\n- departments(id, department_name)\n\nCount the number of employees in each department. Return department_name and employee_count, only for departments with more than 2 employees.', starterQuery: 'SELECT d.department_name, COUNT(e.id) AS employee_count\nFROM departments d\nLEFT JOIN employees e ON d.id = e.department_id\nGROUP BY d.department_name\nHAVING COUNT(e.id) > 2\nORDER BY employee_count DESC;', hints: 'Use HAVING COUNT(*) > 2 to filter after grouping', difficulty: 'MEDIUM', points: 40, xpReward: 200, databaseName: 'employee_db', premium: false, topic: 'AGGREGATE', totalSubmissions: 1100, successfulSubmissions: 550 },
    { id: 7, title: 'Salary Rank with Window Function', description: 'Calculate running total of revenue per month using SUM() OVER() window function with ORDER BY.', problemStatement: 'Table: employees(id, first_name, last_name, salary, department_id)\n\nRank all employees by salary within their department using RANK(). Return first_name, last_name, salary, department_id, and salary_rank.', starterQuery: 'SELECT first_name, last_name, salary, department_id,\n  RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS salary_rank\nFROM employees;', hints: 'Use RANK() OVER (PARTITION BY department_id ORDER BY salary DESC)', difficulty: 'ADVANCED', points: 60, xpReward: 300, databaseName: 'employee_db', premium: false, topic: 'WINDOW', totalSubmissions: 650, successfulSubmissions: 210 },
    { id: 8, title: 'Running Total Salary', description: 'Use a recursive CTE to build an employee management hierarchy from a self-referencing table.', problemStatement: 'Table: employees(id, first_name, last_name, salary, hire_date)\n\nCalculate the cumulative (running) total salary ordered by hire_date. Return first_name, hire_date, salary, and running_total.', starterQuery: 'SELECT first_name, hire_date, salary,\n  SUM(salary) OVER (ORDER BY hire_date) AS running_total\nFROM employees\nORDER BY hire_date;', hints: 'Use SUM(salary) OVER (ORDER BY hire_date) for running total', difficulty: 'ADVANCED', points: 80, xpReward: 400, databaseName: 'employee_db', premium: false, topic: 'WINDOW', totalSubmissions: 420, successfulSubmissions: 98 },
    { id: 9, title: 'Employees Above Dept Average', description: 'Identify and list all duplicate email addresses in the users table, showing count per email.', problemStatement: 'Table: employees(id, first_name, last_name, salary, department_id)\n\nFind all employees who earn more than the average salary of their own department. Return first_name, last_name, salary, and department_id.', starterQuery: 'SELECT e.first_name, e.last_name, e.salary, e.department_id\nFROM employees e\nWHERE e.salary > (\n  SELECT AVG(e2.salary)\n  FROM employees e2\n  WHERE e2.department_id = e.department_id\n);', hints: 'Use a correlated subquery: WHERE salary > (SELECT AVG(salary) FROM employees WHERE department_id = outer.department_id)', difficulty: 'MEDIUM', points: 30, xpReward: 150, databaseName: 'employee_db', premium: false, topic: 'SUBQUERY', totalSubmissions: 1600, successfulSubmissions: 1200 },
    { id: 10, title: 'Top Earner Per Department', description: 'Pivot sales data to show Q1, Q2, Q3, Q4 revenue per product category in a single result set.', problemStatement: 'Table: employees(id, first_name, last_name, salary, department_id)\n\nFind the highest-paid employee in each department. Return department_id, first_name, last_name, and salary.', starterQuery: 'SELECT department_id, first_name, last_name, salary\nFROM employees\nWHERE salary = (\n  SELECT MAX(salary)\n  FROM employees e2\n  WHERE e2.department_id = employees.department_id\n);', hints: 'Correlated subquery: WHERE salary = (SELECT MAX(salary) ... WHERE department_id matches)', difficulty: 'EXPERT', points: 100, xpReward: 500, databaseName: 'employee_db', premium: false, topic: 'SUBQUERY', totalSubmissions: 280, successfulSubmissions: 42 },
    { id: 11, title: 'Salary Bucket Classification', description: 'Rank students by score using DENSE_RANK() and identify students who tie for the same rank.', problemStatement: 'Table: employees(id, first_name, last_name, salary)\n\nClassify each employee into a salary bucket using CASE WHEN. Return first_name, salary, and level where:\n- salary < 40000 → Junior\n- salary < 80000 → Mid-Level\n- salary < 120000 → Senior\n- else → Executive', starterQuery: "SELECT first_name, salary,\n  CASE\n    WHEN salary < 40000 THEN 'Junior'\n    WHEN salary < 80000 THEN 'Mid-Level'\n    WHEN salary < 120000 THEN 'Senior'\n    ELSE 'Executive'\n  END AS level\nFROM employees\nORDER BY salary;", hints: 'Use CASE WHEN salary < X THEN \'label\' ... END', difficulty: 'ADVANCED', points: 65, xpReward: 325, databaseName: 'employee_db', premium: false, topic: 'SELECT', totalSubmissions: 510, successfulSubmissions: 185 },
    { id: 12, title: 'Department Stats Summary', description: 'Calculate the 7-day rolling average of daily active users using window functions.', problemStatement: 'Tables:\n- employees(id, first_name, last_name, salary, department_id)\n- departments(id, department_name)\n\nWrite a query to summarize each department with: department_name, total employees (emp_count), average salary (avg_salary), min salary (min_salary), max salary (max_salary).', starterQuery: 'SELECT d.department_name,\n  COUNT(e.id) AS emp_count,\n  ROUND(AVG(e.salary), 2) AS avg_salary,\n  MIN(e.salary) AS min_salary,\n  MAX(e.salary) AS max_salary\nFROM departments d\nLEFT JOIN employees e ON d.id = e.department_id\nGROUP BY d.department_name\nORDER BY avg_salary DESC;', hints: 'Use COUNT, AVG, MIN, MAX with GROUP BY department', difficulty: 'EXPERT', points: 90, xpReward: 450, databaseName: 'employee_db', premium: false, topic: 'AGGREGATE', totalSubmissions: 190, successfulSubmissions: 28 },
  ];

  constructor(private route: ActivatedRoute, private apiService: ApiService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.apiService.getChallenge(id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.challenge = res.data;
          this.userQuery = res.data.starterQuery || `-- Write your SQL solution\nSELECT `;
        } else {
          this.loadSample(id);
        }
        this.loading = false;
      },
      error: () => {
        this.loadSample(id);
        this.loading = false;
      }
    });
  }

  friendlyError(error: string | undefined | null): string {
    if (!error) return 'Something went wrong running this query.';
    const msg = error.replace(/^ERROR:\s*/i, '');

    const syntaxNear = msg.match(/syntax error at or near "(.+?)"/i);
    if (syntaxNear) {
      return `There's a syntax error near "${syntaxNear[1]}". Check for a missing condition, comma, or keyword right before/after that part of your query.`;
    }
    const columnMissing = msg.match(/column "(.+?)" does not exist/i);
    if (columnMissing) {
      return `Column "${columnMissing[1]}" doesn't exist. Double-check the spelling and make sure it's a real column on this table.`;
    }
    const tableMissing = msg.match(/relation "(.+?)" does not exist/i);
    if (tableMissing) {
      return `Table "${tableMissing[1]}" doesn't exist in this database. Check the table name for typos.`;
    }
    if (/division by zero/i.test(msg)) {
      return 'Division by zero — one of your calculations is dividing by a value that can be 0.';
    }
    if (/permission denied/i.test(msg)) {
      return "You don't have permission to do that in this sandbox database.";
    }
    return msg;
  }

  private loadSample(id: number): void {
    const sample = this.sampleChallenges.find(c => c.id === id) ?? this.sampleChallenges[0];
    this.challenge = sample;
    this.userQuery = sample.starterQuery ?? `-- Write your SQL solution\nSELECT `;
  }

  runQuery(): void {
    if (!this.userQuery.trim()) return;
    this.isRunning = true;
    this.apiService.executeSQL(this.userQuery, this.challenge!.databaseName).subscribe({
      next: (res) => { if (res.success) this.executionResult = res.data; },
      complete: () => this.isRunning = false
    });
  }

  submitSolution(): void {
    this.isSubmitting = true;
    this.verdict = null;
    this.apiService.submitChallenge(this.challenge!.id, this.userQuery).subscribe({
      next: (res) => {
        if (res.success) {
          const correct = res.data.correct;
          this.executionResult = res.data.executionResult;
          this.verdict = correct
            ? { type: 'success', title: 'Correct! 🎉', message: `Great job! You earned +${res.data.xpEarned} XP and ${res.data.pointsEarned} points.` }
            : { type: 'error', title: 'Incorrect', message: 'Your output does not match the expected result. Try again!' };
        }
      },
      error: () => this.snackBar.open('Submission failed', 'Close', { duration: 3000 }),
      complete: () => this.isSubmitting = false
    });
  }

  resetQuery(): void {
    this.userQuery = this.challenge?.starterQuery || '';
    this.executionResult = null;
    this.verdict = null;
  }
}
