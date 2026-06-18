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
import { SqlExecutionResponse, SqlExecution, SqlDatabase } from '../../core/models/models';

@Component({
  selector: 'app-playground',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MatSelectModule,
    MatTabsModule, MatCardModule, MatTableModule, MatProgressSpinnerModule, MatTooltipModule,
    MatChipsModule, MatInputModule, MatFormFieldModule, MatSnackBarModule, MatDividerModule],
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.css']
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
  databases: SqlDatabase[] = [];
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
