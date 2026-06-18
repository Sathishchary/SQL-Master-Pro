-- ============================================================
-- SQL Master Pro - Seed Data
-- ============================================================

-- ─── ROLES ───────────────────────────────────────────────────
INSERT INTO roles (name, description) VALUES
  ('ROLE_STUDENT',    'Standard student access'),
  ('ROLE_INSTRUCTOR', 'Instructor — can create content'),
  ('ROLE_ADMIN',      'Full administrative access')
ON CONFLICT (name) DO NOTHING;

-- ─── ADMIN USER ──────────────────────────────────────────────
-- password: Admin@123 (bcrypt strength 12)
INSERT INTO users (username, email, password, first_name, last_name, email_verified, active, subscription_plan)
VALUES ('admin', 'admin@sqlmasterpro.com',
        '$2a$12$LXy8BCPIm1N7UhbEkuq6Mev5H7U3e7Xo0Rrn5Qb5ySf2aDEV6PFm',
        'Admin', 'User', TRUE, TRUE, 'ENTERPRISE')
ON CONFLICT (username) DO NOTHING;

-- Assign ROLE_ADMIN to admin
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.username = 'admin' AND r.name IN ('ROLE_ADMIN', 'ROLE_INSTRUCTOR', 'ROLE_STUDENT')
ON CONFLICT DO NOTHING;

-- ─── COURSES ─────────────────────────────────────────────────
INSERT INTO courses (title, short_description, description, difficulty, order_index, total_lessons, estimated_hours, icon_class, color_code, is_published, is_premium) VALUES
('Introduction to SQL',
 'Start your SQL journey from zero — no experience needed',
 'Learn what databases are, how SQL works, and write your first queries. Covers SELECT, FROM, WHERE basics with hands-on exercises.',
 'BEGINNER', 1, 12, 3.5, 'school', '#667eea', TRUE, FALSE),

('SQL Fundamentals',
 'Master SELECT, filtering, sorting and aggregation',
 'Deep dive into SELECT statements, WHERE clauses, ORDER BY, GROUP BY, HAVING, and aggregate functions (COUNT, SUM, AVG, MIN, MAX).',
 'BEGINNER', 2, 18, 5.0, 'table_chart', '#48bb78', TRUE, FALSE),

('SQL Joins & Relationships',
 'Combine data from multiple tables with every JOIN type',
 'Master INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL JOIN, CROSS JOIN, and SELF JOIN. Understand primary and foreign keys.',
 'INTERMEDIATE', 3, 15, 4.5, 'merge_type', '#ed8936', TRUE, FALSE),

('SQL Functions & Expressions',
 'String, numeric, date functions and CASE expressions',
 'Complete coverage of built-in SQL functions: string manipulation, date/time, numeric, NULL handling, and CASE WHEN expressions.',
 'INTERMEDIATE', 4, 14, 4.0, 'functions', '#9f7aea', TRUE, FALSE),

('Subqueries & CTEs',
 'Write complex queries with subqueries and WITH clause',
 'Correlated subqueries, scalar subqueries, IN/EXISTS operators, and Common Table Expressions (CTEs) with recursive queries.',
 'INTERMEDIATE', 5, 12, 3.5, 'account_tree', '#f56565', TRUE, FALSE),

('Advanced SQL',
 'Window functions, pivot tables and analytical queries',
 'Window functions (ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, PARTITION BY), analytical queries, and performance optimization.',
 'ADVANCED', 6, 16, 5.5, 'insights', '#667eea', TRUE, FALSE),

('Stored Procedures & Triggers',
 'Automate database logic with procedures and triggers',
 'Create stored procedures, user-defined functions, triggers, and understand PL/pgSQL for complex server-side logic.',
 'ADVANCED', 7, 10, 4.0, 'settings', '#764ba2', TRUE, FALSE),

('Database Normalization',
 'Design efficient schemas with normalization rules',
 'First, Second, Third Normal Form, BCNF, denormalization trade-offs, and practical schema design patterns.',
 'ADVANCED', 8, 8, 3.0, 'grid_on', '#48bb78', TRUE, FALSE),

('Transactions & Concurrency',
 'ACID properties, locks, and isolation levels',
 'Transaction management, COMMIT, ROLLBACK, SAVEPOINT, isolation levels (READ COMMITTED, SERIALIZABLE), deadlock prevention.',
 'ADVANCED', 9, 10, 3.5, 'sync', '#ed8936', TRUE, FALSE),

('Database Design & Architecture',
 'Build production-grade database systems',
 'ER diagrams, schema design patterns, indexing strategies, query optimization, partitioning, and scaling databases.',
 'EXPERT', 10, 14, 5.0, 'architecture', '#e53e3e', TRUE, FALSE)
ON CONFLICT DO NOTHING;

-- ─── LESSONS for Course 1 (Introduction) ─────────────────────
INSERT INTO lessons (title, content, order_index, duration_minutes, xp_reward, lesson_type, key_points, course_id, is_published, is_premium)
SELECT v.title, v.content, v.order_index, v.duration_minutes, v.xp_reward, v.lesson_type, v.key_points, c.id, TRUE, FALSE
FROM (VALUES
('What is a Database?',
 '<h2>Understanding Databases</h2><p>A <strong>database</strong> is an organized collection of structured information or data, typically stored electronically in a computer system. A database is usually controlled by a Database Management System (DBMS).</p><h3>Types of Databases</h3><ul><li><strong>Relational</strong> — Data stored in tables (PostgreSQL, MySQL, Oracle)</li><li><strong>NoSQL</strong> — Document, key-value, graph stores (MongoDB, Redis)</li><li><strong>NewSQL</strong> — Modern relational systems (CockroachDB)</li></ul>',
 1, 8, 10, 'TEXT',
 'A database stores organized data
DBMS manages the database
SQL is for relational databases
Tables = rows and columns'),

('Your First SELECT Statement',
 '<h2>The SELECT Statement</h2><p>The <code>SELECT</code> statement is the most fundamental SQL command. It retrieves data from one or more tables.</p><pre>SELECT column1, column2\nFROM table_name;</pre><p>To select all columns:</p><pre>SELECT * FROM employees;</pre>',
 2, 10, 15, 'TEXT',
 'SELECT retrieves data
* means all columns
FROM specifies the table
Semicolon ends the statement'),

('Filtering with WHERE',
 '<h2>The WHERE Clause</h2><p>Use <code>WHERE</code> to filter rows based on conditions.</p><pre>SELECT * FROM employees\nWHERE salary > 50000;</pre><h3>Comparison Operators</h3><ul><li><code>=</code> Equal</li><li><code>!=</code> or <code>&lt;&gt;</code> Not Equal</li><li><code>&gt;</code>, <code>&gt;=</code> Greater than</li><li><code>&lt;</code>, <code>&lt;=</code> Less than</li></ul>',
 3, 12, 20, 'TEXT',
 'WHERE filters rows
Comparison operators: =, !=, >, <, >=, <=
Conditions must evaluate to TRUE to include row')
) AS v(title, content, order_index, duration_minutes, xp_reward, lesson_type, key_points)
CROSS JOIN (SELECT id FROM courses WHERE title = 'Introduction to SQL') c
WHERE NOT EXISTS (SELECT 1 FROM lessons l WHERE l.title = v.title AND l.course_id = c.id);

-- ─── QUIZZES ─────────────────────────────────────────────────
INSERT INTO quizzes (title, description, difficulty, time_limit_minutes, pass_score, is_published, is_premium, course_id)
SELECT v.title, v.description, v.difficulty, v.time_limit_minutes, v.pass_score, TRUE, FALSE, c.id
FROM (VALUES
('SQL Basics Quiz', 'Test your knowledge of SQL fundamentals', 'BEGINNER', 20, 70, 'Introduction to SQL'),
('SQL Joins Mastery Quiz', 'Advanced quiz on all types of SQL joins', 'INTERMEDIATE', 30, 75, 'SQL Joins & Relationships'),
('Window Functions Quiz', 'Test your analytical SQL skills', 'ADVANCED', 40, 70, 'Advanced SQL'),
('Subqueries & CTEs Quiz', 'Complex query patterns quiz', 'INTERMEDIATE', 35, 70, 'Subqueries & CTEs'),
('Database Design Quiz', 'Schema design and normalization quiz', 'ADVANCED', 30, 75, 'Database Normalization')
) AS v(title, description, difficulty, time_limit_minutes, pass_score, course_title)
JOIN courses c ON c.title = v.course_title
WHERE NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.title = v.title);

-- ─── QUESTIONS — SQL Basics (Quiz 1) ────────────────────────
INSERT INTO questions (question_text, question_type, option_a, option_b, option_c, option_d, correct_answer, explanation, points, difficulty, topic, quiz_id, is_published)
SELECT v.question_text, v.question_type, v.option_a, v.option_b, v.option_c, v.option_d, v.correct_answer, v.explanation, v.points, v.difficulty, v.topic, q.id, TRUE
FROM (VALUES
('What does SQL stand for?',
 'MCQ', 'Structured Query Language', 'Simple Query Language', 'Standard Question Language', 'Sequential Query Logic',
 'A', 'SQL stands for Structured Query Language, used to communicate with relational databases.',
 10, 'BEGINNER', 'Introduction'),

('Which SQL statement is used to retrieve data from a database?',
 'MCQ', 'GET', 'OPEN', 'SELECT', 'EXTRACT',
 'C', 'SELECT is the DML statement used to query and retrieve data from database tables.',
 10, 'BEGINNER', 'SELECT'),

('What does the * mean in SELECT * FROM employees?',
 'MCQ', 'Select first row only', 'Select all columns', 'Select all tables', 'Multiply all values',
 'B', 'The asterisk (*) is a wildcard that selects all columns from the specified table.',
 10, 'BEGINNER', 'SELECT'),

('Which clause is used to filter rows in a SQL query?',
 'MCQ', 'FILTER', 'HAVING', 'WHERE', 'LIMIT',
 'C', 'WHERE clause filters individual rows before grouping. HAVING filters groups after GROUP BY.',
 10, 'BEGINNER', 'WHERE'),

('Which aggregate function returns the number of rows?',
 'MCQ', 'SUM()', 'AVG()', 'COUNT()', 'MAX()',
 'C', 'COUNT() returns the number of rows that match the specified criteria.',
 10, 'BEGINNER', 'Aggregates'),

('What is the correct order of SQL clauses?',
 'MCQ',
 'WHERE, SELECT, FROM, GROUP BY',
 'SELECT, FROM, WHERE, GROUP BY',
 'FROM, SELECT, WHERE, GROUP BY',
 'SELECT, WHERE, FROM, GROUP BY',
 'B', 'The logical order is: SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT.',
 10, 'BEGINNER', 'Syntax'),

('Which operator checks for NULL values in SQL?',
 'MCQ', '= NULL', 'IS NULL', 'NULL =', '== NULL',
 'B', 'IS NULL is the correct way to check for NULL values. You cannot use = NULL because NULL is not equal to anything, including itself.',
 10, 'BEGINNER', 'NULL'),

('SQL is case-sensitive for data values (TRUE or FALSE)?',
 'TRUE_FALSE', 'TRUE', 'FALSE', NULL, NULL,
 'B', 'SQL keywords are case-insensitive, but string data comparisons depend on the collation settings of the database.',
 10, 'BEGINNER', 'Syntax'),

('What does ORDER BY do?',
 'MCQ', 'Groups rows', 'Filters rows', 'Sorts the result set', 'Removes duplicates',
 'C', 'ORDER BY sorts the query results. Use ASC for ascending (default) and DESC for descending order.',
 10, 'BEGINNER', 'Sorting'),

('What keyword removes duplicate rows from a SELECT result?',
 'MCQ', 'UNIQUE', 'DISTINCT', 'DIFFERENT', 'NODUPE',
 'B', 'DISTINCT removes duplicate rows from the result set.',
 10, 'BEGINNER', 'SELECT'),

-- Medium difficulty questions
('What is the difference between WHERE and HAVING?',
 'MCQ',
 'No difference — they are interchangeable',
 'WHERE filters groups; HAVING filters rows',
 'WHERE filters rows before grouping; HAVING filters groups after GROUP BY',
 'HAVING is used without GROUP BY; WHERE is used with GROUP BY',
 'C', 'WHERE filters individual rows before GROUP BY is applied. HAVING filters the grouped results after GROUP BY.',
 15, 'MEDIUM', 'Aggregates'),

('Which JOIN type returns all rows from the left table even if no match exists in the right table?',
 'MCQ', 'INNER JOIN', 'RIGHT JOIN', 'FULL JOIN', 'LEFT JOIN',
 'D', 'LEFT JOIN (or LEFT OUTER JOIN) returns all rows from the left table and matching rows from the right table. NULL is returned for non-matching right table columns.',
 15, 'MEDIUM', 'Joins'),

('What does COALESCE() do in SQL?',
 'MCQ',
 'Returns the maximum non-NULL value',
 'Returns the first non-NULL value from a list',
 'Replaces all NULL values with zero',
 'Converts NULL to empty string',
 'B', 'COALESCE(expr1, expr2, ...) returns the first non-NULL expression in the list.',
 15, 'MEDIUM', 'NULL'),

-- Advanced questions
('What is the output of: SELECT RANK() OVER (ORDER BY salary DESC) FROM employees?',
 'MCQ',
 'Row numbers with no gaps',
 'Random assignment',
 'Rankings with gaps for ties',
 'Sequential integers always',
 'C', 'RANK() assigns the same rank to tied values but leaves gaps. DENSE_RANK() does not leave gaps.',
 20, 'ADVANCED', 'Window Functions'),

('A CTE (Common Table Expression) defined with WITH RECURSIVE is used for?',
 'MCQ',
 'Recursive table joins',
 'Querying hierarchical data like org charts or category trees',
 'Improving index performance',
 'Partitioning large tables',
 'B', 'WITH RECURSIVE allows CTEs to reference themselves, enabling traversal of hierarchical or graph-like data structures.',
 20, 'ADVANCED', 'CTEs')
) AS v(question_text, question_type, option_a, option_b, option_c, option_d, correct_answer, explanation, points, difficulty, topic)
JOIN quizzes q ON q.title = 'SQL Basics Quiz'
WHERE NOT EXISTS (SELECT 1 FROM questions qq WHERE qq.question_text = v.question_text AND qq.quiz_id = q.id);

-- ─── QUESTIONS — Joins Quiz (Quiz 2) ─────────────────────────
INSERT INTO questions (question_text, question_type, option_a, option_b, option_c, option_d, correct_answer, explanation, points, difficulty, topic, quiz_id, is_published)
SELECT v.question_text, v.question_type, v.option_a, v.option_b, v.option_c, v.option_d, v.correct_answer, v.explanation, v.points, v.difficulty, v.topic, q.id, TRUE
FROM (VALUES
('INNER JOIN returns rows that have matching values in ___ table(s)',
 'MCQ', 'Left', 'Right', 'Both', 'Neither',
 'C', 'INNER JOIN returns only the rows where there is a match in both tables.',
 10, 'BEGINNER', 'Inner Join'),

('A LEFT JOIN with WHERE right_table.id IS NULL effectively performs a?',
 'MCQ', 'INNER JOIN', 'LEFT ANTI JOIN (rows in left not in right)', 'FULL OUTER JOIN', 'CROSS JOIN',
 'B', 'LEFT JOIN + WHERE right.id IS NULL returns only rows from the left table that have NO match in the right table.',
 20, 'ADVANCED', 'Anti Join'),

('What does CROSS JOIN produce?',
 'MCQ',
 'Rows with matching keys',
 'Cartesian product of all rows from both tables',
 'Rows from left table only',
 'Union of both tables',
 'B', 'CROSS JOIN returns the Cartesian product — every combination of rows from both tables.',
 15, 'MEDIUM', 'Cross Join'),

('Which join type is used when joining a table to itself?',
 'MCQ', 'SELF JOIN', 'INNER JOIN with alias', 'RECURSIVE JOIN', 'LOOP JOIN',
 'B', 'A SELF JOIN uses table aliases to join a table to itself. There is no special SELF JOIN keyword.',
 15, 'MEDIUM', 'Self Join'),

('FULL OUTER JOIN returns?',
 'MCQ',
 'Only matching rows',
 'All rows from left + matching from right',
 'All rows from both tables, NULLs for non-matching',
 'All rows from right + matching from left',
 'C', 'FULL OUTER JOIN returns all rows from both tables. Where no match exists, NULLs are placed.',
 15, 'MEDIUM', 'Full Join')
) AS v(question_text, question_type, option_a, option_b, option_c, option_d, correct_answer, explanation, points, difficulty, topic)
JOIN quizzes q ON q.title = 'SQL Joins Mastery Quiz'
WHERE NOT EXISTS (SELECT 1 FROM questions qq WHERE qq.question_text = v.question_text AND qq.quiz_id = q.id);

-- ─── CHALLENGES ──────────────────────────────────────────────
INSERT INTO challenges (title, description, problem_statement, starter_query, solution_query, hints, difficulty, points, xp_reward, topic, database_name, is_published, is_premium) VALUES
-- EASY CHALLENGES
('Select All Employees',
 'Retrieve all employee records from the employees table.',
 'Write a SQL query to select all columns from the employees table. Order by employee ID.',
 '-- Write your query here\nSELECT ',
 'SELECT * FROM employees ORDER BY emp_id;',
 'Use SELECT * to get all columns\nUse ORDER BY emp_id',
 'EASY', 10, 15, 'SELECT', 'employees', TRUE, FALSE),

('Count Total Employees',
 'Find the total number of employees in the company.',
 'Write a SQL query to count the total number of employees in the employees table.',
 'SELECT ',
 'SELECT COUNT(*) AS total_employees FROM employees;',
 'Use the COUNT() aggregate function\nAlias it with AS total_employees',
 'EASY', 10, 15, 'Aggregates', 'employees', TRUE, FALSE),

('Find High Earners',
 'List all employees earning more than 75000.',
 'Write a SQL query to find all employees with a salary greater than 75000. Show first_name, last_name, and salary. Order by salary descending.',
 'SELECT ',
 'SELECT first_name, last_name, salary FROM employees WHERE salary > 75000 ORDER BY salary DESC;',
 'Use WHERE to filter by salary\nUse ORDER BY salary DESC',
 'EASY', 10, 15, 'WHERE', 'employees', TRUE, FALSE),

-- MEDIUM CHALLENGES
('Average Salary by Department',
 'Calculate average salary for each department.',
 'Write a query to show department name and average salary for each department. Only include departments with more than 3 employees. Order by average salary descending.',
 'SELECT d.dept_name, ',
 'SELECT d.dept_name, ROUND(AVG(e.salary), 2) AS avg_salary FROM departments d JOIN employees e ON d.dept_id = e.dept_id GROUP BY d.dept_name HAVING COUNT(e.emp_id) > 3 ORDER BY avg_salary DESC;',
 'JOIN departments and employees tables\nUse GROUP BY dept_name\nUse HAVING COUNT() > 3',
 'MEDIUM', 25, 40, 'GROUP BY', 'employees', TRUE, FALSE),

('Top 3 Highest Paid per Department',
 'Find the top 3 highest paid employees in each department using window functions.',
 'Write a query to find the top 3 highest-paid employees in each department. Show department name, employee name, salary, and their rank within the department.',
 'WITH ranked AS (',
 'WITH ranked AS (SELECT d.dept_name, e.first_name, e.last_name, e.salary, RANK() OVER (PARTITION BY e.dept_id ORDER BY e.salary DESC) AS salary_rank FROM employees e JOIN departments d ON e.dept_id = d.dept_id) SELECT dept_name, first_name, last_name, salary, salary_rank FROM ranked WHERE salary_rank <= 3 ORDER BY dept_name, salary_rank;',
 'Use a CTE (WITH clause)\nUse RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC)\nFilter WHERE salary_rank <= 3',
 'MEDIUM', 30, 50, 'Window Functions', 'employees', TRUE, FALSE),

('Employees Without a Manager',
 'Find all employees who do not have a manager assigned.',
 'Write a query to find employees where manager_id is NULL. Show employee ID, full name, and job title.',
 'SELECT ',
 'SELECT emp_id, first_name || '' '' || last_name AS full_name, job_title FROM employees WHERE manager_id IS NULL;',
 'Use IS NULL to check for missing manager\nConcatenate name with ||',
 'MEDIUM', 20, 30, 'NULL', 'employees', TRUE, FALSE),

-- ADVANCED CHALLENGES
('Running Total of Salaries',
 'Calculate a running (cumulative) total of salaries ordered by hire date.',
 'Write a query showing each employee''s name, salary, hire date, and the cumulative sum of salaries ordered by hire date. Include only employees hired after 2020-01-01.',
 'SELECT ',
 'SELECT first_name, last_name, salary, hire_date, SUM(salary) OVER (ORDER BY hire_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total FROM employees WHERE hire_date > ''2020-01-01'' ORDER BY hire_date;',
 'Use SUM() as a window function\nUse ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\nFilter by hire_date',
 'ADVANCED', 50, 80, 'Window Functions', 'employees', TRUE, FALSE),

('Employees Earning Above Department Average',
 'Find employees who earn more than the average salary of their department.',
 'Write a correlated subquery to find employees whose salary is above the average salary of their own department. Show employee name, department, salary, and department average.',
 'SELECT e1.first_name, e1.last_name,',
 'SELECT e1.first_name, e1.last_name, d.dept_name, e1.salary, ROUND((SELECT AVG(e2.salary) FROM employees e2 WHERE e2.dept_id = e1.dept_id), 2) AS dept_avg FROM employees e1 JOIN departments d ON e1.dept_id = d.dept_id WHERE e1.salary > (SELECT AVG(e2.salary) FROM employees e2 WHERE e2.dept_id = e1.dept_id) ORDER BY d.dept_name, e1.salary DESC;',
 'Use a correlated subquery in WHERE clause\nThe subquery references the outer query''s dept_id\nAlso use subquery in SELECT for dept_avg',
 'ADVANCED', 60, 100, 'Subqueries', 'employees', TRUE, FALSE),

-- ECOMMERCE CHALLENGES
('Total Revenue by Product Category',
 'Calculate total revenue for each product category.',
 'Write a query joining orders, order_items, and products to calculate total revenue per product category. Show category and total revenue. Order by revenue descending.',
 'SELECT p.category,',
 'SELECT p.category, SUM(oi.quantity * oi.unit_price) AS total_revenue FROM products p JOIN order_items oi ON p.product_id = oi.product_id JOIN orders o ON oi.order_id = o.order_id WHERE o.status = ''COMPLETED'' GROUP BY p.category ORDER BY total_revenue DESC;',
 'JOIN products, order_items, and orders\nMultiply quantity by unit_price for revenue\nFilter for COMPLETED orders only',
 'MEDIUM', 30, 50, 'JOINs', 'ecommerce', TRUE, FALSE),

('Month-over-Month Sales Growth',
 'Calculate month-over-month sales growth percentage.',
 'Write a query using LAG() to compare monthly sales with the previous month and calculate growth percentage. Show year, month, revenue, previous month revenue, and growth percentage.',
 'WITH monthly AS (',
 'WITH monthly AS (SELECT DATE_TRUNC(''month'', order_date) AS month, SUM(total_amount) AS revenue FROM orders WHERE status = ''COMPLETED'' GROUP BY 1) SELECT month, revenue, LAG(revenue) OVER (ORDER BY month) AS prev_revenue, ROUND(((revenue - LAG(revenue) OVER (ORDER BY month)) / NULLIF(LAG(revenue) OVER (ORDER BY month), 0)) * 100, 2) AS growth_pct FROM monthly ORDER BY month;',
 'Use DATE_TRUNC to group by month\nUse LAG() window function to get previous month\nUse NULLIF to avoid division by zero',
 'ADVANCED', 70, 120, 'Window Functions', 'ecommerce', TRUE, FALSE)
ON CONFLICT DO NOTHING;

-- ─── BLOGS ───────────────────────────────────────────────────
INSERT INTO blogs (title, slug, excerpt, content, category, tags, reading_time_minutes, published, featured, published_at) VALUES
('SQL JOINs Explained with Visual Examples',
 'sql-joins-explained-visual-examples',
 'Master all types of SQL JOINs with clear diagrams and practical examples. From INNER JOIN to FULL OUTER JOIN — everything you need to know.',
 '<h2>Understanding SQL JOINs</h2><p>SQL JOINs combine rows from two or more tables based on a related column. Understanding joins is essential for any SQL developer.</p><h3>INNER JOIN</h3><p>Returns rows that have matching values in both tables:</p><pre>SELECT e.name, d.department_name\nFROM employees e\nINNER JOIN departments d ON e.dept_id = d.id;</pre><h3>LEFT JOIN</h3><p>Returns all rows from the left table plus matched rows from right:</p><pre>SELECT e.name, d.department_name\nFROM employees e\nLEFT JOIN departments d ON e.dept_id = d.id;</pre>',
 'SQL Basics', 'joins,inner join,left join,right join', 8, TRUE, TRUE, NOW() - INTERVAL '5 days'),

('10 SQL Window Functions You Must Know',
 '10-sql-window-functions-you-must-know',
 'Window functions are the most powerful feature in modern SQL. Learn ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, and more.',
 '<h2>SQL Window Functions</h2><p>Window functions perform calculations across a set of table rows related to the current row, without collapsing them into a single row.</p><h3>ROW_NUMBER()</h3><pre>SELECT name, salary,\n  ROW_NUMBER() OVER (ORDER BY salary DESC) AS row_num\nFROM employees;</pre><h3>RANK() vs DENSE_RANK()</h3><p>RANK() leaves gaps for ties; DENSE_RANK() does not.</p>',
 'Advanced SQL', 'window functions,rank,lag,lead,analytical', 12, TRUE, TRUE, NOW() - INTERVAL '3 days'),

('PostgreSQL vs MySQL: Which Should You Choose?',
 'postgresql-vs-mysql-comparison',
 'A comprehensive comparison of PostgreSQL and MySQL — performance, features, use cases, and when to choose each database.',
 '<h2>PostgreSQL vs MySQL</h2><p>Both are excellent open-source relational databases, but they have different strengths.</p><h3>PostgreSQL Strengths</h3><ul><li>Full ACID compliance</li><li>Advanced data types (JSON, Arrays, UUID)</li><li>Better support for complex queries</li><li>Window functions and CTEs</li></ul>',
 'PostgreSQL', 'postgresql,mysql,comparison,database selection', 10, TRUE, FALSE, NOW() - INTERVAL '7 days'),

('Top 50 SQL Interview Questions for FAANG',
 'top-50-sql-interview-questions-faang',
 'Prepare for technical interviews at top companies with these 50 most-asked SQL interview questions with detailed answers.',
 '<h2>SQL Interview Preparation</h2><p>These questions are commonly asked at Google, Amazon, Meta, Apple, and Netflix.</p><h3>Q1: What is the difference between DELETE, TRUNCATE, and DROP?</h3><ul><li><strong>DELETE</strong>: Removes specific rows; logged; can be rolled back</li><li><strong>TRUNCATE</strong>: Removes all rows; minimal logging; faster</li><li><strong>DROP</strong>: Removes the entire table including structure</li></ul>',
 'Interview Questions', 'interview,faang,google,amazon,sql questions', 20, TRUE, TRUE, NOW() - INTERVAL '1 day'),

('SQL Query Optimization: 15 Tips to Make Your Queries Faster',
 'sql-query-optimization-tips',
 'Learn proven techniques to write faster SQL queries — from proper indexing to avoiding N+1 problems and using query execution plans.',
 '<h2>SQL Query Optimization</h2><p>Slow queries can cripple your application. Here are 15 proven techniques.</p><h3>1. Use Indexes Wisely</h3><p>Create indexes on columns used in WHERE, JOIN, and ORDER BY clauses.</p><pre>CREATE INDEX idx_employees_dept ON employees(dept_id, salary);</pre><h3>2. Avoid SELECT *</h3><p>Select only the columns you need to reduce data transfer.</p>',
 'Performance Tuning', 'performance,optimization,indexes,execution plan', 15, TRUE, FALSE, NOW() - INTERVAL '2 days')
ON CONFLICT (slug) DO NOTHING;

-- ─── SAMPLE DATABASE DATA — Employees ────────────────────────
INSERT INTO employees_db.departments (dept_name, location, budget) VALUES
('Engineering',    'San Francisco', 5000000),
('Marketing',      'New York',      2000000),
('Sales',          'Chicago',       3000000),
('Human Resources','Austin',        1500000),
('Finance',        'New York',      2500000),
('Product',        'San Francisco', 3500000)
ON CONFLICT DO NOTHING;

INSERT INTO employees_db.employees (first_name, last_name, email, hire_date, salary, job_title, dept_id, manager_id) VALUES
('Alice',   'Johnson',  'alice@company.com',   '2018-03-15', 95000,  'Software Engineer',     1, NULL),
('Bob',     'Smith',    'bob@company.com',     '2019-06-01', 85000,  'Software Engineer',     1, 1),
('Carol',   'Williams', 'carol@company.com',   '2020-01-10', 120000, 'Engineering Manager',   1, NULL),
('David',   'Brown',    'david@company.com',   '2017-09-20', 75000,  'Marketing Specialist',  2, NULL),
('Eve',     'Davis',    'eve@company.com',     '2021-02-14', 80000,  'Marketing Manager',     2, NULL),
('Frank',   'Miller',   'frank@company.com',   '2019-11-05', 90000,  'Sales Representative',  3, NULL),
('Grace',   'Wilson',   'grace@company.com',   '2018-07-22', 110000, 'Sales Manager',         3, NULL),
('Hank',    'Moore',    'hank@company.com',    '2022-03-01', 70000,  'HR Specialist',         4, NULL),
('Iris',    'Taylor',   'iris@company.com',    '2016-05-15', 130000, 'HR Director',           4, NULL),
('Jack',    'Anderson', 'jack@company.com',    '2020-08-30', 105000, 'Financial Analyst',     5, NULL),
('Karen',   'Thomas',   'karen@company.com',   '2021-11-12', 98000,  'Software Engineer',     1, 3),
('Leo',     'Jackson',  'leo@company.com',     '2022-01-20', 115000, 'Senior Engineer',       1, 3),
('Mia',     'White',    'mia@company.com',     '2019-04-07', 88000,  'Product Manager',       6, NULL),
('Noah',    'Harris',   'noah@company.com',    '2023-05-01', 72000,  'Junior Developer',      1, 3),
('Olivia',  'Martin',   'olivia@company.com',  '2020-09-15', 92000,  'Data Scientist',        1, 3)
ON CONFLICT DO NOTHING;

-- ─── SAMPLE DATABASE DATA — Ecommerce ────────────────────────
INSERT INTO ecommerce_db.customers (name, email, country, joined_date) VALUES
('John Doe',      'john@example.com',    'USA',    '2022-01-15'),
('Jane Smith',    'jane@example.com',    'UK',     '2022-03-22'),
('Raj Patel',     'raj@example.com',     'India',  '2022-06-10'),
('Maria Garcia',  'maria@example.com',   'Spain',  '2023-01-05'),
('Liu Wei',       'liu@example.com',     'China',  '2023-03-18'),
('Emma Wilson',   'emma@example.com',    'Canada', '2023-07-30')
ON CONFLICT DO NOTHING;

INSERT INTO ecommerce_db.products (name, category, price, stock) VALUES
('Laptop Pro 15',      'Electronics', 1299.99, 50),
('Wireless Headphones','Electronics',  199.99, 200),
('SQL Mastery Book',   'Books',         49.99, 500),
('Standing Desk',      'Furniture',    399.99, 30),
('Coffee Maker',       'Appliances',    89.99, 150),
('Python Course',      'Digital',       79.99, 9999),
('Monitor 27"',        'Electronics',  449.99, 75),
('Ergonomic Chair',    'Furniture',    299.99, 40)
ON CONFLICT DO NOTHING;

INSERT INTO ecommerce_db.orders (customer_id, order_date, total_amount, status) VALUES
(1, '2023-01-10', 1499.98, 'COMPLETED'),
(2, '2023-01-15',  449.99, 'COMPLETED'),
(3, '2023-02-05',  129.98, 'COMPLETED'),
(1, '2023-02-20', 1349.99, 'COMPLETED'),
(4, '2023-03-12',  699.98, 'COMPLETED'),
(5, '2023-04-01',  529.98, 'COMPLETED'),
(6, '2023-04-15',  249.98, 'COMPLETED'),
(2, '2023-05-10', 1299.99, 'SHIPPED'),
(3, '2023-06-22',  399.99, 'PENDING')
ON CONFLICT DO NOTHING;

INSERT INTO ecommerce_db.order_items (order_id, product_id, quantity, unit_price) VALUES
(1, 1, 1, 1299.99), (1, 2, 1, 199.99),
(2, 7, 1, 449.99),
(3, 3, 1, 49.99), (3, 6, 1, 79.99),
(4, 1, 1, 1299.99), (4, 6, 1, 49.99),
(5, 4, 1, 399.99), (5, 5, 1, 89.99), (5, 6, 1, 79.99), (5, 3, 1, 49.99),
(6, 2, 1, 199.99), (6, 5, 1, 89.99), (6, 6, 1, 79.99), (6, 3, 1, 49.99), (6, 3, 1, 49.99),
(7, 2, 1, 199.99), (7, 3, 1, 49.99),
(8, 1, 1, 1299.99),
(9, 4, 1, 399.99)
ON CONFLICT DO NOTHING;

-- ─── SAMPLE DATABASE DATA — University ───────────────────────
INSERT INTO university_db.students (name, email, enrollment_year, major, gpa) VALUES
('Alice Chen',    'alice@uni.edu',    2020, 'Computer Science', 3.9),
('Bob Singh',     'bob@uni.edu',      2021, 'Data Science',     3.7),
('Carol Adams',   'carol@uni.edu',    2019, 'Mathematics',      3.5),
('David Lee',     'david@uni.edu',    2022, 'Computer Science', 3.8),
('Eve Martinez',  'eve@uni.edu',      2020, 'Statistics',       3.6)
ON CONFLICT DO NOTHING;

INSERT INTO university_db.courses (course_name, credits, department) VALUES
('Database Systems',        3, 'CS'),
('Data Structures',         4, 'CS'),
('Linear Algebra',          3, 'Math'),
('Machine Learning',        3, 'CS'),
('Statistical Analysis',    3, 'Stats')
ON CONFLICT DO NOTHING;

INSERT INTO university_db.enrollments (student_id, course_id, grade, semester) VALUES
(1, 1, 'A',  'Fall 2023'),   (1, 2, 'A-', 'Fall 2023'),
(2, 1, 'B+', 'Fall 2023'),   (2, 4, 'A',  'Fall 2023'),
(3, 3, 'A-', 'Fall 2023'),   (3, 5, 'B+', 'Fall 2023'),
(4, 1, 'A',  'Spring 2024'), (4, 2, 'A-', 'Spring 2024'),
(5, 5, 'A',  'Spring 2024'), (5, 4, 'B',  'Spring 2024')
ON CONFLICT DO NOTHING;
