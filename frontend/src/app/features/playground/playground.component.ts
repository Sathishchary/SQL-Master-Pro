import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { ApiService } from '../../core/services/api.service';
import { SqlExecutionResponse, SqlExecution } from '../../core/models/models';

@Component({
  selector: 'app-playground',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MatSelectModule,
    MatTabsModule, MatCardModule, MatTableModule, MatProgressSpinnerModule, MatTooltipModule,
    MatChipsModule, MatInputModule, MatFormFieldModule, MatSnackBarModule, MatDividerModule],
  template: `
    <div class="playground-container">
      <!-- Header -->
      <div class="playground-header">
        <div class="header-left">
          <h1><mat-icon>code</mat-icon> SQL Playground</h1>
          <p>Write, execute, and learn SQL in real-time</p>
        </div>
        <div class="header-actions">
          <mat-select [(ngModel)]="selectedDatabase" class="db-select" (ngModelChange)="onDatabaseChange()">
            @for (db of databases; track db.id) {
              <mat-option [value]="db.id">
                {{ db.name }}
              </mat-option>
            }
          </mat-select>
          <button mat-icon-button (click)="toggleTheme()" matTooltip="Toggle theme">
            <mat-icon>{{ darkMode ? 'light_mode' : 'dark_mode' }}</mat-icon>
          </button>
        </div>
      </div>

      <div class="playground-layout">
        <!-- Sidebar: Saved Queries & Sample Queries -->
        <div class="sidebar" [class.collapsed]="sidebarCollapsed">
          <div class="sidebar-toggle" (click)="sidebarCollapsed = !sidebarCollapsed">
            <mat-icon>{{ sidebarCollapsed ? 'chevron_right' : 'chevron_left' }}</mat-icon>
          </div>

          @if (!sidebarCollapsed) {
            <mat-tab-group>
              <mat-tab label="Samples">
                <div class="sample-list">
                  @for (sample of sampleQueries; track sample.name) {
                    <div class="sample-item" (click)="loadSample(sample)">
                      <div class="sample-name">{{ sample.name }}</div>
                      <div class="sample-desc">{{ sample.description }}</div>
                    </div>
                  }
                </div>
              </mat-tab>
              <mat-tab label="Saved">
                <div class="saved-list">
                  @if (savedLoading) {
                    <div class="no-data"><mat-spinner diameter="28"></mat-spinner></div>
                  } @else if (!filteredSaved.length) {
                    <div class="no-data">
                      <mat-icon>bookmark_border</mat-icon>
                      <p>No saved queries yet for this database</p>
                    </div>
                  } @else {
                    @for (q of filteredSaved; track q.id) {
                      <div class="sample-item" (click)="loadQuery(q.query)">
                        <div class="sample-name">{{ q.queryName || 'Untitled' }}</div>
                        <div class="sample-desc">{{ q.executedAt | date:'short' }}</div>
                      </div>
                    }
                  }
                </div>
              </mat-tab>
              <mat-tab label="History">
                <div class="history-list">
                  @if (historyLoading) {
                    <div class="no-data"><mat-spinner diameter="28"></mat-spinner></div>
                  } @else if (!filteredHistory.length) {
                    <div class="no-data">
                      <mat-icon>history</mat-icon>
                      <p>No queries executed yet for this database</p>
                    </div>
                  } @else {
                    @for (h of filteredHistory.slice(0, 20); track h.id) {
                      <div class="history-item" (click)="loadQuery(h.query)">
                        <div class="history-query">{{ h.query | slice:0:50 }}...</div>
                        <div class="history-meta">
                          <span [class]="h.success ? 'success' : 'error'">
                            {{ h.success ? '✅' : '❌' }}
                          </span>
                          <span class="time-ms">{{ h.executionTimeMs }}ms</span>
                        </div>
                      </div>
                    }
                  }
                </div>
              </mat-tab>
            </mat-tab-group>
          }
        </div>

        <!-- Main Editor -->
        <div class="editor-section">
          <!-- SQL Editor -->
          <div class="editor-wrapper" [class.dark]="darkMode" [class.fullscreen]="editorFullscreen">
            <div class="editor-header">
              <div class="editor-tabs">
                <button class="editor-tab active">SQL Editor</button>
              </div>
              <div class="editor-actions">
                <button mat-icon-button (click)="formatQuery()" matTooltip="Format SQL">
                  <mat-icon>auto_fix_high</mat-icon>
                </button>
                <button mat-icon-button (click)="clearEditor()" matTooltip="Clear">
                  <mat-icon>clear</mat-icon>
                </button>
                <button mat-icon-button (click)="toggleFullscreen()" [matTooltip]="editorFullscreen ? 'Exit full screen' : 'Expand full screen'">
                  <mat-icon>{{ editorFullscreen ? 'fullscreen_exit' : 'fullscreen' }}</mat-icon>
                </button>
              </div>
            </div>
            <textarea
              class="sql-editor"
              [(ngModel)]="sqlQuery"
              placeholder="-- Write your SQL query here
SELECT * FROM employees LIMIT 10;"
              (keydown.ctrl.enter)="executeQuery()"
              (keydown.meta.enter)="executeQuery()"
              spellcheck="false">
            </textarea>
            <div class="editor-footer">
              <span class="hint">Ctrl+Enter to execute{{ editorFullscreen ? ' · Esc to exit full screen' : '' }}</span>
              <span class="char-count">{{ sqlQuery.length }} chars</span>
            </div>
          </div>

          <!-- Execute Button -->
          <div class="execute-bar">
            <button mat-raised-button color="primary" (click)="executeQuery()"
              [disabled]="isExecuting || !sqlQuery.trim()" class="execute-btn">
              <mat-icon>play_arrow</mat-icon>
              {{ isExecuting ? 'Executing...' : 'Run Query' }}
            </button>
            <button mat-button (click)="saveQuery()" [disabled]="!result">
              <mat-icon>bookmark</mat-icon> Save
            </button>
            <button mat-button (click)="exportCSV()" [disabled]="!result?.rows?.length">
              <mat-icon>download</mat-icon> Export CSV
            </button>
            <button mat-button (click)="toggleResultsFullscreen()" [disabled]="!result?.rows?.length">
              <mat-icon>{{ resultsFullscreen ? 'fullscreen_exit' : 'fullscreen' }}</mat-icon>
              {{ resultsFullscreen ? 'Exit Full View' : 'Full View' }}
            </button>
            <span class="db-indicator">
              <mat-icon>storage</mat-icon> {{ selectedDatabase }}
            </span>
          </div>

          <!-- Results -->
          <div class="results-section" [class.fullscreen]="resultsFullscreen">
            @if (resultsFullscreen) {
              <div class="fullscreen-header">
                <span>Query Results</span>
                <button mat-icon-button (click)="toggleResultsFullscreen()" matTooltip="Exit full view (Esc)">
                  <mat-icon>close</mat-icon>
                </button>
              </div>
            }
            <!-- Loading -->
            @if (isExecuting) {
              <div class="loading-state">
                <mat-spinner diameter="40"></mat-spinner>
                <p>Executing query...</p>
              </div>
            }

            <!-- Error State -->
            @if (result && !result.success && !isExecuting) {
              <div class="error-state">
                <mat-icon class="error-icon">error</mat-icon>
                <div class="error-content">
                  <div class="error-title">Query Error</div>
                  <pre class="error-message">{{ result.error }}</pre>
                </div>
              </div>
            }

            <!-- Success State -->
            @if (result?.success && !isExecuting) {
              <div class="success-state">
                <div class="result-meta">
                  <mat-chip-set>
                    <mat-chip color="primary" highlighted>
                      <mat-icon matChipAvatar>table_rows</mat-icon>
                      {{ result!.rowCount }} rows
                    </mat-chip>
                    <mat-chip>
                      <mat-icon matChipAvatar>timer</mat-icon>
                      {{ result!.executionTimeMs }}ms
                    </mat-chip>
                  </mat-chip-set>
                </div>

                <div class="result-table-wrapper">
                  @if (result!.columns?.length) {
                    <table class="result-table">
                      <thead>
                        <tr>
                          @for (col of result!.columns; track col) {
                            <th (click)="sortBy(col)">
                              {{ col }}
                              @if (sortColumn === col) {
                                <mat-icon class="sort-icon">{{ sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward' }}</mat-icon>
                              }
                            </th>
                          }
                        </tr>
                      </thead>
                      <tbody>
                        @for (row of pagedRows; track $index) {
                          <tr>
                            @for (col of result!.columns; track col) {
                              <td>{{ row[col] ?? 'NULL' }}</td>
                            }
                          </tr>
                        }
                      </tbody>
                    </table>
                    <div class="pagination-bar">
                      <span class="page-info">
                        Showing {{ pageStart + 1 }}-{{ pageEnd }} of {{ sortedRows.length }}
                      </span>
                      <div class="page-size">
                        <span>Rows per page:</span>
                        <mat-select [(ngModel)]="pageSize" (ngModelChange)="onPageSizeChange()">
                          @for (size of pageSizeOptions; track size) {
                            <mat-option [value]="size">{{ size }}</mat-option>
                          }
                        </mat-select>
                      </div>
                      <div class="page-controls">
                        <button mat-icon-button (click)="goToPage(0)" [disabled]="pageIndex === 0">
                          <mat-icon>first_page</mat-icon>
                        </button>
                        <button mat-icon-button (click)="goToPage(pageIndex - 1)" [disabled]="pageIndex === 0">
                          <mat-icon>chevron_left</mat-icon>
                        </button>
                        <span class="page-number">Page {{ pageIndex + 1 }} of {{ totalPages }}</span>
                        <button mat-icon-button (click)="goToPage(pageIndex + 1)" [disabled]="pageIndex >= totalPages - 1">
                          <mat-icon>chevron_right</mat-icon>
                        </button>
                        <button mat-icon-button (click)="goToPage(totalPages - 1)" [disabled]="pageIndex >= totalPages - 1">
                          <mat-icon>last_page</mat-icon>
                        </button>
                      </div>
                    </div>
                  }
                  @if (!result!.columns?.length) {
                    <div class="affected-rows">
                      <mat-icon>check_circle</mat-icon>
                      Query executed successfully. {{ result!.affectedRows }} rows affected.
                    </div>
                  }
                </div>
              </div>
            }

            <!-- Empty State -->
            @if (!result && !isExecuting) {
              <div class="empty-state">
                <h3>Ready to execute SQL</h3>
                <p>Write a query and press Ctrl+Enter or click "Run Query"</p>
                <div class="db-schema">
                  <h4>Available Tables in {{ selectedDatabase }}:</h4>
                  <div class="table-chips">
                    @for (t of currentDbTables; track t) {
                      <span class="table-chip">{{ t }}</span>
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .playground-container { display: flex; flex-direction: column; height: calc(100vh - 64px); overflow: hidden; }
    .playground-header { display: flex; justify-content: space-between; align-items: center;
      padding: 16px 24px; background: white; border-bottom: 1px solid #e5e7eb; flex-shrink: 0;
      h1 { display: flex; align-items: center; gap: 8px; font-size: 22px; font-weight: 800; margin: 0; }
      p { color: #718096; margin: 0; font-size: 13px; }
    }
    .header-actions { display: flex; align-items: center; gap: 12px; }
    .db-select { min-width: 200px; }
    .playground-layout { display: flex; flex: 1; overflow: hidden; min-height: 0; }

    .sidebar { width: 280px; border-right: 1px solid #e5e7eb; display: flex;
      transition: width 0.3s; flex-direction: column; overflow: hidden; min-height: 0;
      &.collapsed { width: 40px; }
    }
    .sidebar-toggle { height: 40px; display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: #718096; border-bottom: 1px solid #e5e7eb; flex-shrink: 0;
      &:hover { background: #f8faff; }
    }
    ::ng-deep mat-tab-group { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-height: 0; }
    ::ng-deep mat-tab-group .mat-mdc-tab-body-wrapper { flex: 1; overflow: hidden; min-height: 0; }
    ::ng-deep mat-tab-group .mat-mdc-tab-body-content { overflow-y: auto; height: 100%; }
    .sample-list, .saved-list, .history-list { height: 100%; }
    .sample-item, .history-item { padding: 12px 16px; border-bottom: 1px solid #f0f0f0;
      cursor: pointer; transition: background 0.2s;
      &:hover { background: #f0f4ff; }
    }
    .sample-name { font-weight: 600; font-size: 13px; margin-bottom: 2px; }
    .sample-desc, .history-query { font-size: 11px; color: #718096; }
    .history-meta { display: flex; gap: 8px; margin-top: 4px; align-items: center;
      .success { color: #48bb78; } .error { color: #f56565; }
      .time-ms { font-size: 11px; color: #a0aec0; }
    }
    .no-data { text-align: center; padding: 32px 16px; color: #718096;
      mat-icon { font-size: 32px; width: 32px; height: 32px; opacity: 0.4; display: block; margin: 0 auto 8px; }
      p { font-size: 13px; }
    }

    .editor-section { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-height: 0; }

    .editor-wrapper.fullscreen { position: fixed; inset: 0;
      z-index: 1000; border-radius: 0;
      display: flex; flex-direction: column; overflow: hidden;
      .sql-editor { flex: 1; height: auto; }
    }

    /* Editor — light theme (default) */
    .editor-wrapper { border-bottom: 1px solid #e5e7eb; background: #ffffff; }
    .editor-header { display: flex; justify-content: space-between; align-items: center;
      padding: 8px 16px; background: #f3f4f6; border-bottom: 1px solid #e5e7eb;
    }
    .editor-tab { background: none; border: none; color: #6b7280; padding: 4px 12px;
      border-radius: 4px; cursor: pointer; font-size: 13px;
      &.active { background: rgba(102,126,234,0.12); color: #667eea; }
    }
    .editor-actions button { color: #6b7280 !important; }
    .sql-editor {
      width: 100%; height: 250px; background: #ffffff; color: #1f2937;
      border: none; outline: none; padding: 16px; font-family: 'JetBrains Mono', monospace;
      font-size: 14px; line-height: 1.8; resize: vertical; box-sizing: border-box;
      &::placeholder { color: #9ca3af; }
    }
    .editor-footer { display: flex; justify-content: space-between; padding: 8px 16px;
      background: #f3f4f6; font-size: 12px; color: #6b7280;
    }

    /* Editor — dark theme */
    .editor-wrapper.dark {
      background: #1e1e2e;
      .editor-header { background: #2d2d3f; border-bottom: 1px solid rgba(255,255,255,0.1); }
      .editor-tab { color: #a0aec0;
        &.active { background: rgba(102,126,234,0.2); color: #667eea; }
      }
      .editor-actions button { color: #a0aec0 !important; }
      .sql-editor {
        background: #1e1e2e; color: #e0e0e0;
        &::placeholder { color: #4a5568; }
      }
      .editor-footer { background: #2d2d3f; color: #718096; }
    }

    .execute-bar { display: flex; align-items: center; gap: 12px; padding: 12px 16px;
      background: white; border-bottom: 1px solid #e5e7eb;
    }
    .execute-btn { border-radius: 8px !important; }
    .db-indicator { margin-left: auto; display: flex; align-items: center; gap: 4px;
      color: #718096; font-size: 13px;
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
    }

    .results-section { flex: 1; overflow: auto; padding: 16px; background: #fafafa;
      display: flex; flex-direction: column; min-height: 0;
      &.fullscreen { position: fixed; inset: 0;
        z-index: 1000; border-radius: 0;
        background: white; padding: 24px;
        .result-table-wrapper { flex: 1; }
      }
    }
    .fullscreen-header { display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 12px; font-weight: 700; font-size: 16px; color: #2d3748;
    }
    .loading-state { display: flex; flex-direction: column; align-items: center;
      justify-content: center; height: 200px; color: #718096;
      p { margin-top: 16px; }
    }
    .error-state { display: flex; gap: 16px; background: #fff5f5; border: 1px solid #fed7d7;
      border-radius: 12px; padding: 16px;
      .error-icon { color: #f56565; font-size: 36px; width: 36px; height: 36px; }
      .error-title { font-weight: 700; color: #c53030; margin-bottom: 8px; }
      .error-message { background: #fed7d7; padding: 8px 12px; border-radius: 6px;
        font-family: monospace; font-size: 13px; margin: 0; color: #742a2a;
      }
    }
    .success-state { .result-meta { margin-bottom: 12px; } }
    .result-table-wrapper { overflow: auto; border-radius: 8px; border: 1px solid #e5e7eb; }
    .result-table { width: 100%; border-collapse: collapse; font-size: 13px; background: white;
      th { background: #667eea; color: white; padding: 10px 14px; text-align: left;
        font-weight: 600; position: sticky; top: 0; cursor: pointer; user-select: none;
        white-space: nowrap;
        &:hover { background: #5a67d8; }
      }
      .sort-icon { font-size: 14px; width: 14px; height: 14px; vertical-align: middle; margin-left: 4px; }
      td { padding: 8px 14px; border-bottom: 1px solid #f0f0f0; }
      tr:hover td { background: #f0f4ff; }
    }
    .pagination-bar { display: flex; align-items: center; justify-content: space-between;
      gap: 16px; padding: 10px 14px; background: white; border-top: 1px solid #e5e7eb;
      flex-wrap: wrap; font-size: 13px; color: #4a5568;
      .page-info { color: #718096; }
      .page-size { display: flex; align-items: center; gap: 8px;
        mat-select { width: 64px; }
      }
      .page-controls { display: flex; align-items: center; gap: 4px;
        .page-number { margin: 0 8px; white-space: nowrap; }
        button mat-icon { font-size: 18px; width: 18px; height: 18px; }
      }
    }
    .affected-rows { display: flex; align-items: center; gap: 8px; padding: 16px;
      color: #48bb78; font-weight: 600;
    }
    .empty-state { text-align: center; padding: 24px; color: #718096;
      margin: auto; max-width: 560px; width: 100%; box-sizing: border-box;
      h3 { font-size: 20px; font-weight: 700; margin-bottom: 8px; color: #4a5568; }
      p { margin-bottom: 16px; }
      .db-schema { text-align: left; max-width: 500px; margin: 0 auto;
        background: white; border-radius: 12px; padding: 16px; border: 1px solid #e5e7eb;
        h4 { font-size: 14px; font-weight: 700; margin-bottom: 12px; }
        .table-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .table-chip { background: #f0f4ff; color: #667eea; padding: 4px 12px;
          border-radius: 20px; font-size: 12px; font-weight: 600; font-family: monospace; }
      }
    }
  `]
})
export class PlaygroundComponent implements OnInit {
  sqlQuery = 'SELECT e.first_name, e.last_name, d.department_name, e.salary\nFROM employees e\nINNER JOIN departments d ON e.department_id = d.id\nWHERE e.salary > 50000\nORDER BY e.salary DESC\nLIMIT 10;';
  selectedDatabase = 'employee_db';
  isExecuting = false;
  darkMode = true;
  sidebarCollapsed = false;
  result: SqlExecutionResponse | null = null;
  savedQueries: SqlExecution[] = [];
  history: SqlExecution[] = [];
  databases: any[] = [];
  savedLoading = false;
  historyLoading = false;
  editorFullscreen = false;
  resultsFullscreen = false;

  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  pageIndex = 0;
  pageSize = 10;
  pageSizeOptions = [10, 25, 50, 100];

  currentDbTables: string[] = ['employees', 'departments', 'salaries', 'jobs', 'locations'];

  dbTableMap: Record<string, string[]> = {
    employee_db: ['employees', 'departments', 'salaries'],
    ecommerce_db: ['customers', 'products', 'orders', 'order_items'],
    hospital_db: ['doctors', 'patients', 'appointments', 'medical_records'],
    banking_db: ['customers', 'accounts', 'transactions', 'loans'],
    school_db: ['teachers', 'courses', 'students', 'enrollments'],
    inventory_db: ['suppliers', 'warehouses', 'products', 'stock'],
    movies_db: ['directors', 'movies', 'actors', 'movie_cast']
  };

  sampleQueriesMap: Record<string, { name: string; description: string; query: string }[]> = {
    employee_db: [
      { name: 'Basic SELECT', description: 'Select all employees', query: 'SELECT * FROM employees LIMIT 10;' },
      { name: 'WHERE Clause', description: 'Filter by salary', query: 'SELECT first_name, last_name, salary\nFROM employees\nWHERE salary > 50000;' },
      { name: 'INNER JOIN', description: 'Join employees and departments', query: 'SELECT e.first_name, e.last_name, d.department_name\nFROM employees e\nINNER JOIN departments d ON e.department_id = d.id;' },
      { name: 'GROUP BY + HAVING', description: 'Average salary by department', query: 'SELECT d.department_name, AVG(e.salary) as avg_salary, COUNT(*) as emp_count\nFROM employees e\nJOIN departments d ON e.department_id = d.id\nGROUP BY d.department_name\nHAVING AVG(e.salary) > 60000\nORDER BY avg_salary DESC;' },
      { name: 'Window Function', description: 'Rank employees by salary', query: 'SELECT first_name, last_name, salary,\n  RANK() OVER (ORDER BY salary DESC) as salary_rank\nFROM employees;' },
      { name: 'CTE', description: 'Common Table Expression', query: 'WITH dept_stats AS (\n  SELECT department_id, AVG(salary) as avg_sal\n  FROM employees\n  GROUP BY department_id\n)\nSELECT e.first_name, e.salary, ds.avg_sal\nFROM employees e\nJOIN dept_stats ds ON e.department_id = ds.department_id\nWHERE e.salary > ds.avg_sal;' },
      { name: 'Subquery', description: 'Top earners per dept', query: 'SELECT first_name, last_name, salary, department_id\nFROM employees\nWHERE salary = (\n  SELECT MAX(salary)\n  FROM employees e2\n  WHERE e2.department_id = employees.department_id\n);' },
      { name: 'CASE WHEN', description: 'Salary classification', query: "SELECT first_name, salary,\n  CASE\n    WHEN salary < 80000 THEN 'Junior'\n    WHEN salary < 120000 THEN 'Mid-Level'\n    ELSE 'Senior'\n  END AS level\nFROM employees\nORDER BY salary;" }
    ],
    ecommerce_db: [
      { name: 'Basic SELECT', description: 'Select all products', query: 'SELECT * FROM products LIMIT 10;' },
      { name: 'WHERE Clause', description: 'Filter by price', query: 'SELECT name, category, price\nFROM products\nWHERE price > 10000;' },
      { name: 'INNER JOIN', description: 'Orders with customer names', query: 'SELECT o.id, c.name, o.total_amount, o.status\nFROM orders o\nINNER JOIN customers c ON o.customer_id = c.id;' },
      { name: 'GROUP BY + HAVING', description: 'Revenue per customer', query: 'SELECT c.name, SUM(o.total_amount) as total_spent\nFROM orders o\nJOIN customers c ON o.customer_id = c.id\nGROUP BY c.name\nHAVING SUM(o.total_amount) > 50000\nORDER BY total_spent DESC;' },
      { name: 'Window Function', description: 'Rank products by price', query: 'SELECT name, category, price,\n  RANK() OVER (PARTITION BY category ORDER BY price DESC) as price_rank\nFROM products;' },
      { name: 'CTE', description: 'High value orders', query: 'WITH big_orders AS (\n  SELECT * FROM orders WHERE total_amount > 50000\n)\nSELECT c.name, b.total_amount\nFROM big_orders b\nJOIN customers c ON b.customer_id = c.id;' },
      { name: 'Subquery', description: 'Most expensive product per order', query: 'SELECT oi.order_id, p.name, oi.price\nFROM order_items oi\nJOIN products p ON oi.product_id = p.id\nWHERE oi.price = (\n  SELECT MAX(price) FROM order_items oi2 WHERE oi2.order_id = oi.order_id\n);' },
      { name: 'CASE WHEN', description: 'Order status grouping', query: "SELECT id, total_amount,\n  CASE\n    WHEN status = 'DELIVERED' THEN 'Done'\n    WHEN status = 'PENDING' THEN 'Awaiting'\n    ELSE 'In Progress'\n  END AS stage\nFROM orders;" }
    ],
    hospital_db: [
      { name: 'Basic SELECT', description: 'Select all patients', query: 'SELECT * FROM patients LIMIT 10;' },
      { name: 'WHERE Clause', description: 'Filter by age', query: 'SELECT name, age, gender, blood_group\nFROM patients\nWHERE age > 50;' },
      { name: 'INNER JOIN', description: 'Appointments with doctor names', query: 'SELECT a.appointment_date, p.name as patient, d.name as doctor\nFROM appointments a\nINNER JOIN patients p ON a.patient_id = p.id\nINNER JOIN doctors d ON a.doctor_id = d.id;' },
      { name: 'GROUP BY + HAVING', description: 'Appointment count per doctor', query: 'SELECT d.name, COUNT(*) as appointment_count\nFROM appointments a\nJOIN doctors d ON a.doctor_id = d.id\nGROUP BY d.name\nHAVING COUNT(*) > 0\nORDER BY appointment_count DESC;' },
      { name: 'Window Function', description: 'Rank doctors by experience', query: 'SELECT name, specialization, years_experience,\n  RANK() OVER (ORDER BY years_experience DESC) as exp_rank\nFROM doctors;' },
      { name: 'CTE', description: 'Completed appointments', query: "WITH completed AS (\n  SELECT * FROM appointments WHERE status = 'COMPLETED'\n)\nSELECT p.name, c.appointment_date\nFROM completed c\nJOIN patients p ON c.patient_id = p.id;" },
      { name: 'Subquery', description: 'Patients with medical records', query: 'SELECT name FROM patients\nWHERE id IN (\n  SELECT patient_id FROM medical_records\n);' },
      { name: 'CASE WHEN', description: 'Age group classification', query: "SELECT name, age,\n  CASE\n    WHEN age < 18 THEN 'Child'\n    WHEN age < 60 THEN 'Adult'\n    ELSE 'Senior'\n  END AS age_group\nFROM patients\nORDER BY age;" }
    ],
    banking_db: [
      { name: 'Basic SELECT', description: 'Select all accounts', query: 'SELECT * FROM accounts LIMIT 10;' },
      { name: 'WHERE Clause', description: 'Filter by balance', query: 'SELECT id, account_type, balance\nFROM accounts\nWHERE balance > 200000;' },
      { name: 'INNER JOIN', description: 'Accounts with customer names', query: 'SELECT c.name, a.account_type, a.balance\nFROM accounts a\nINNER JOIN customers c ON a.customer_id = c.id;' },
      { name: 'GROUP BY + HAVING', description: 'Total balance per customer', query: 'SELECT c.name, SUM(a.balance) as total_balance\nFROM accounts a\nJOIN customers c ON a.customer_id = c.id\nGROUP BY c.name\nHAVING SUM(a.balance) > 100000\nORDER BY total_balance DESC;' },
      { name: 'Window Function', description: 'Rank accounts by balance', query: 'SELECT customer_id, account_type, balance,\n  RANK() OVER (ORDER BY balance DESC) as balance_rank\nFROM accounts;' },
      { name: 'CTE', description: 'Active loans', query: "WITH active_loans AS (\n  SELECT * FROM loans WHERE status = 'ACTIVE'\n)\nSELECT c.name, l.loan_type, l.amount\nFROM active_loans l\nJOIN customers c ON l.customer_id = c.id;" },
      { name: 'Subquery', description: 'Customers with above-average balance', query: 'SELECT c.name, a.balance\nFROM accounts a\nJOIN customers c ON a.customer_id = c.id\nWHERE a.balance > (\n  SELECT AVG(balance) FROM accounts\n);' },
      { name: 'CASE WHEN', description: 'Transaction type grouping', query: "SELECT id, type, amount,\n  CASE\n    WHEN type = 'CREDIT' THEN 'Incoming'\n    ELSE 'Outgoing'\n  END AS flow\nFROM transactions;" }
    ],
    school_db: [
      { name: 'Basic SELECT', description: 'Select all students', query: 'SELECT * FROM students LIMIT 10;' },
      { name: 'WHERE Clause', description: 'Filter by GPA', query: 'SELECT name, gpa\nFROM students\nWHERE gpa > 3.5;' },
      { name: 'INNER JOIN', description: 'Enrollments with course names', query: 'SELECT s.name, c.course_name, e.grade\nFROM enrollments e\nINNER JOIN students s ON e.student_id = s.id\nINNER JOIN courses c ON e.course_id = c.id;' },
      { name: 'GROUP BY + HAVING', description: 'Average GPA-equivalent students per course', query: 'SELECT c.course_name, COUNT(*) as student_count\nFROM enrollments e\nJOIN courses c ON e.course_id = c.id\nGROUP BY c.course_name\nHAVING COUNT(*) > 2\nORDER BY student_count DESC;' },
      { name: 'Window Function', description: 'Rank students by GPA', query: 'SELECT name, gpa,\n  RANK() OVER (ORDER BY gpa DESC) as gpa_rank\nFROM students;' },
      { name: 'CTE', description: 'Top performing students', query: 'WITH top_students AS (\n  SELECT * FROM students WHERE gpa > 3.7\n)\nSELECT name, gpa FROM top_students ORDER BY gpa DESC;' },
      { name: 'Subquery', description: 'Students enrolled in most courses', query: 'SELECT name FROM students\nWHERE id = (\n  SELECT student_id FROM enrollments\n  GROUP BY student_id\n  ORDER BY COUNT(*) DESC\n  LIMIT 1\n);' },
      { name: 'CASE WHEN', description: 'GPA classification', query: "SELECT name, gpa,\n  CASE\n    WHEN gpa >= 3.7 THEN 'Distinction'\n    WHEN gpa >= 3.3 THEN 'Merit'\n    ELSE 'Pass'\n  END AS standing\nFROM students\nORDER BY gpa DESC;" }
    ],
    inventory_db: [
      { name: 'Basic SELECT', description: 'Select all products', query: 'SELECT * FROM products LIMIT 10;' },
      { name: 'WHERE Clause', description: 'Filter by unit price', query: 'SELECT name, category, unit_price\nFROM products\nWHERE unit_price > 5000;' },
      { name: 'INNER JOIN', description: 'Stock with product and warehouse names', query: 'SELECT p.name, w.name as warehouse, s.quantity\nFROM stock s\nINNER JOIN products p ON s.product_id = p.id\nINNER JOIN warehouses w ON s.warehouse_id = w.id;' },
      { name: 'GROUP BY + HAVING', description: 'Total stock per product', query: 'SELECT p.name, SUM(s.quantity) as total_stock\nFROM stock s\nJOIN products p ON s.product_id = p.id\nGROUP BY p.name\nHAVING SUM(s.quantity) > 100\nORDER BY total_stock DESC;' },
      { name: 'Window Function', description: 'Rank products by price', query: 'SELECT name, category, unit_price,\n  RANK() OVER (PARTITION BY category ORDER BY unit_price DESC) as price_rank\nFROM products;' },
      { name: 'CTE', description: 'Low stock products', query: 'WITH low_stock AS (\n  SELECT product_id, SUM(quantity) as qty\n  FROM stock GROUP BY product_id HAVING SUM(quantity) < 100\n)\nSELECT p.name, l.qty FROM low_stock l JOIN products p ON l.product_id = p.id;' },
      { name: 'Subquery', description: 'Products from top-rated suppliers', query: 'SELECT name FROM products\nWHERE supplier_id IN (\n  SELECT id FROM suppliers WHERE rating > 4.5\n);' },
      { name: 'CASE WHEN', description: 'Stock level classification', query: "SELECT p.name, SUM(s.quantity) as qty,\n  CASE\n    WHEN SUM(s.quantity) < 100 THEN 'Low'\n    WHEN SUM(s.quantity) < 300 THEN 'Medium'\n    ELSE 'High'\n  END AS stock_level\nFROM stock s\nJOIN products p ON s.product_id = p.id\nGROUP BY p.name;" }
    ],
    movies_db: [
      { name: 'Basic SELECT', description: 'Select all movies', query: 'SELECT * FROM movies LIMIT 10;' },
      { name: 'WHERE Clause', description: 'Filter by rating', query: 'SELECT title, year, rating\nFROM movies\nWHERE rating > 8.0;' },
      { name: 'INNER JOIN', description: 'Movies with director names', query: 'SELECT m.title, m.year, d.name as director\nFROM movies m\nINNER JOIN directors d ON m.director_id = d.id;' },
      { name: 'GROUP BY + HAVING', description: 'Average rating per director', query: 'SELECT d.name, AVG(m.rating) as avg_rating, COUNT(*) as movie_count\nFROM movies m\nJOIN directors d ON m.director_id = d.id\nGROUP BY d.name\nHAVING COUNT(*) > 1\nORDER BY avg_rating DESC;' },
      { name: 'Window Function', description: 'Rank movies by box office', query: 'SELECT title, year, box_office,\n  RANK() OVER (ORDER BY box_office DESC) as box_office_rank\nFROM movies;' },
      { name: 'CTE', description: 'Blockbuster movies', query: 'WITH blockbusters AS (\n  SELECT * FROM movies WHERE box_office > 500000000\n)\nSELECT title, year, box_office FROM blockbusters ORDER BY box_office DESC;' },
      { name: 'Subquery', description: 'Highest rated movie per director', query: 'SELECT title, director_id, rating\nFROM movies m\nWHERE rating = (\n  SELECT MAX(rating) FROM movies m2 WHERE m2.director_id = m.director_id\n);' },
      { name: 'CASE WHEN', description: 'Rating classification', query: "SELECT title, rating,\n  CASE\n    WHEN rating >= 8.5 THEN 'Masterpiece'\n    WHEN rating >= 7.5 THEN 'Great'\n    ELSE 'Good'\n  END AS verdict\nFROM movies\nORDER BY rating DESC;" }
    ]
  };

  get sampleQueries() {
    return this.sampleQueriesMap[this.selectedDatabase] || [];
  }

  get filteredSaved(): SqlExecution[] {
    return this.savedQueries.filter(q => q.databaseName === this.selectedDatabase);
  }

  get filteredHistory(): SqlExecution[] {
    return this.history.filter(h => h.databaseName === this.selectedDatabase);
  }

  get sortedRows(): Record<string, unknown>[] {
    const rows = this.result?.rows || [];
    if (!this.sortColumn) return rows;
    const col = this.sortColumn;
    const dir = this.sortDirection === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const av = a[col];
      const bv = b[col];
      if (av == null && bv == null) return 0;
      if (av == null) return -1 * dir;
      if (bv == null) return 1 * dir;
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.sortedRows.length / this.pageSize));
  }

  get pageStart(): number {
    return this.pageIndex * this.pageSize;
  }

  get pageEnd(): number {
    return Math.min(this.pageStart + this.pageSize, this.sortedRows.length);
  }

  get pagedRows(): Record<string, unknown>[] {
    return this.sortedRows.slice(this.pageStart, this.pageEnd);
  }

  sortBy(col: string): void {
    if (this.sortColumn === col) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = col;
      this.sortDirection = 'asc';
    }
    this.pageIndex = 0;
  }

  onPageSizeChange(): void {
    this.pageIndex = 0;
  }

  goToPage(index: number): void {
    if (index < 0 || index >= this.totalPages) return;
    this.pageIndex = index;
  }

  constructor(private apiService: ApiService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadDatabases();
    this.loadHistory();
    this.loadSavedQueries();
  }

  executeQuery(): void {
    if (!this.sqlQuery.trim() || this.isExecuting) return;
    this.isExecuting = true;
    this.result = null;
    this.sortColumn = null;
    this.pageIndex = 0;

    this.apiService.executeSQL(this.sqlQuery, this.selectedDatabase).subscribe({
      next: (res) => {
        this.result = res.data;
        this.loadHistory();
      },
      error: () => {
        this.isExecuting = false;
        this.snackBar.open('Execution failed', 'Close', { duration: 3000 });
      },
      complete: () => this.isExecuting = false
    });
  }

  loadSample(sample: { query: string }): void { this.sqlQuery = sample.query; }
  loadQuery(query: string): void { this.sqlQuery = query; }

  onDatabaseChange(): void {
    this.currentDbTables = this.dbTableMap[this.selectedDatabase] || [];
    this.result = null;
    const samples = this.sampleQueriesMap[this.selectedDatabase];
    this.sqlQuery = samples?.[0]?.query || '';
  }

  formatQuery(): void {
    // Basic SQL formatter
    this.sqlQuery = this.sqlQuery
      .replace(/\b(SELECT|FROM|WHERE|JOIN|ON|ORDER BY|GROUP BY|HAVING|LIMIT|INNER|LEFT|RIGHT|FULL|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|UNION|WITH|AS)\b/gi,
        (match) => `\n${match.toUpperCase()}`)
      .trim();
  }

  clearEditor(): void { this.sqlQuery = ''; this.result = null; }
  toggleTheme(): void { this.darkMode = !this.darkMode; }
  toggleFullscreen(): void { this.editorFullscreen = !this.editorFullscreen; }
  toggleResultsFullscreen(): void { this.resultsFullscreen = !this.resultsFullscreen; }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.editorFullscreen) this.editorFullscreen = false;
    if (this.resultsFullscreen) this.resultsFullscreen = false;
  }

  saveQuery(): void {
    if (!this.result?.executionId) {
      this.snackBar.open('Run the query first before saving', 'Close', { duration: 2000 });
      return;
    }
    const name = `Query ${this.savedQueries.length + 1}`;
    this.apiService.saveExecution(this.result.executionId, name).subscribe({
      next: () => {
        this.snackBar.open('Query saved!', 'Close', { duration: 2000 });
        this.loadSavedQueries();
      },
      error: () => this.snackBar.open('Failed to save query', 'Close', { duration: 2000 })
    });
  }

  exportCSV(): void {
    if (!this.result?.rows?.length || !this.result.columns) return;
    const headers = this.result.columns.join(',');
    const rows = this.result.rows.map(r => this.result!.columns!.map(c => `"${r[c] ?? ''}"`).join(','));
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'query_result.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  private loadDatabases(): void {
    this.apiService.getDatabases().subscribe({
      next: (res) => { if (res.success) this.databases = res.data; }
    });
  }
  private loadHistory(): void {
    this.historyLoading = true;
    this.apiService.getSQLHistory().subscribe({
      next: (res) => { if (res.success) this.history = res.data.content; this.historyLoading = false; },
      error: () => {
        this.historyLoading = false;
        this.snackBar.open('Failed to load query history', 'Close', { duration: 3000 });
      }
    });
  }
  private loadSavedQueries(): void {
    this.savedLoading = true;
    this.apiService.getSavedQueries().subscribe({
      next: (res) => { if (res.success) this.savedQueries = res.data; this.savedLoading = false; },
      error: () => {
        this.savedLoading = false;
        this.snackBar.open('Failed to load saved queries', 'Close', { duration: 3000 });
      }
    });
  }
}
