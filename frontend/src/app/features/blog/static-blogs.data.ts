export const STATIC_BLOGS = [
  {
    id: 1,
    title: 'Mastering SQL JOINs: INNER, LEFT, RIGHT & FULL OUTER Explained',
    slug: 'mastering-sql-joins',
    excerpt: 'JOINs are the backbone of relational databases. Learn every JOIN type with clear visuals, real examples, and know exactly when to use each one.',
    category: 'SQL Basics',
    tags: 'JOIN, INNER JOIN, LEFT JOIN, SQL Basics, Relational',
    views: 24800,
    likes: 412,
    readingTimeMinutes: 12,
    publishedAt: '2025-03-15T10:00:00Z',
    author: { firstName: 'Sarah', lastName: 'Chen', id: 1 },
    content: `
      <h2>What is a JOIN?</h2>
      <p>A JOIN combines rows from two or more tables based on a related column. It's how you query data that spans multiple tables in a relational database.</p>

      <h2>INNER JOIN — Only Matching Rows</h2>
      <p>Returns rows where there's a match in <em>both</em> tables.</p>
      <pre><code>-- Find all orders with customer info
SELECT c.name, c.email, o.total, o.created_at
FROM customers c
INNER JOIN orders o ON c.id = o.customer_id
WHERE o.total > 100
ORDER BY o.created_at DESC;</code></pre>
      <p>Only customers who <strong>have</strong> orders appear. Customers with no orders are excluded.</p>

      <h2>LEFT JOIN — All Left Rows + Matching Right</h2>
      <p>Returns ALL rows from the left table, even if there's no match on the right.</p>
      <pre><code>-- Find customers who have NOT placed any orders
SELECT c.name, c.email, o.id AS order_id
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.id IS NULL;</code></pre>
      <p>This is the <strong>"anti-join"</strong> pattern — customers with <code>NULL</code> order_id never ordered.</p>

      <h2>RIGHT JOIN — All Right Rows + Matching Left</h2>
      <p>Mirror of LEFT JOIN. Rarely used — you can always rewrite as LEFT JOIN by swapping table order.</p>
      <pre><code>SELECT c.name, o.total
FROM orders o
RIGHT JOIN customers c ON o.customer_id = c.id;</code></pre>

      <h2>FULL OUTER JOIN — All Rows from Both</h2>
      <p>Returns all rows from both tables. Non-matching sides fill with NULL.</p>
      <pre><code>-- Show all customers and all orders, matched or not
SELECT c.name, o.total
FROM customers c
FULL OUTER JOIN orders o ON c.id = o.customer_id;</code></pre>

      <h2>CROSS JOIN — Cartesian Product</h2>
      <p>Every row from table A paired with every row from table B. Useful for generating combinations.</p>
      <pre><code>-- Generate all size × color combinations
SELECT s.name AS size, c.name AS color
FROM sizes s
CROSS JOIN colors c;</code></pre>

      <h2>SELF JOIN — Join a Table to Itself</h2>
      <pre><code>-- Find employee and their manager (same table)
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;</code></pre>

      <h2>Performance Tips</h2>
      <ul>
        <li>Always index the JOIN columns (<code>ON c.id = o.customer_id</code> → index <code>orders.customer_id</code>)</li>
        <li>Filter early — put WHERE conditions before JOINs when possible</li>
        <li>Use EXPLAIN ANALYZE to see if index scans are happening</li>
      </ul>
    `
  },
  {
    id: 2,
    title: 'Window Functions Deep Dive: RANK, LAG, LEAD & Running Totals',
    slug: 'window-functions-deep-dive',
    excerpt: 'Window functions let you do complex analytics without collapsing rows. Master RANK, ROW_NUMBER, LAG, LEAD, and running totals with production-ready examples.',
    category: 'Window Functions',
    tags: 'Window Functions, RANK, LAG, LEAD, OVER, Analytics',
    views: 19200,
    likes: 387,
    readingTimeMinutes: 15,
    publishedAt: '2025-04-02T09:00:00Z',
    author: { firstName: 'Marcus', lastName: 'Johnson', id: 2 },
    content: `
      <h2>What Makes Window Functions Special?</h2>
      <p>Unlike GROUP BY which collapses rows, window functions compute values across a "window" of related rows while keeping each row intact.</p>

      <h2>The OVER() Clause</h2>
      <pre><code>-- Basic syntax
function_name() OVER (
  PARTITION BY column   -- reset per group
  ORDER BY column       -- define row order within window
  ROWS BETWEEN ...      -- frame specification
)</code></pre>

      <h2>ROW_NUMBER, RANK, DENSE_RANK</h2>
      <pre><code>SELECT
  name,
  department,
  salary,
  ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS row_num,
  RANK()       OVER (PARTITION BY department ORDER BY salary DESC) AS rank,
  DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dense_rank
FROM employees;</code></pre>
      <p><strong>Difference:</strong> With salaries 100, 100, 80:</p>
      <ul>
        <li>ROW_NUMBER: 1, 2, 3 (always unique)</li>
        <li>RANK: 1, 1, 3 (skips 2)</li>
        <li>DENSE_RANK: 1, 1, 2 (no gaps)</li>
      </ul>

      <h2>LAG & LEAD — Access Neighboring Rows</h2>
      <pre><code>SELECT
  date,
  revenue,
  LAG(revenue, 1) OVER (ORDER BY date)  AS prev_day_revenue,
  LEAD(revenue, 1) OVER (ORDER BY date) AS next_day_revenue,
  revenue - LAG(revenue, 1) OVER (ORDER BY date) AS day_over_day_change
FROM daily_sales;</code></pre>

      <h2>Running Total with SUM() OVER()</h2>
      <pre><code>SELECT
  date,
  amount,
  SUM(amount) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total,
  AVG(amount) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)         AS rolling_7day_avg
FROM transactions;</code></pre>

      <h2>NTILE — Divide Into Buckets</h2>
      <pre><code>-- Split customers into 4 revenue quartiles
SELECT
  customer_id,
  total_spent,
  NTILE(4) OVER (ORDER BY total_spent DESC) AS quartile
FROM customer_totals;</code></pre>

      <h2>FIRST_VALUE & LAST_VALUE</h2>
      <pre><code>SELECT
  product_name,
  sale_date,
  revenue,
  FIRST_VALUE(revenue) OVER (PARTITION BY product_name ORDER BY sale_date) AS first_sale,
  LAST_VALUE(revenue)  OVER (PARTITION BY product_name ORDER BY sale_date
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS last_sale
FROM product_sales;</code></pre>

      <h2>Real-World Use Case: Top N Per Group</h2>
      <pre><code>-- Top 3 products by revenue per category
WITH ranked AS (
  SELECT
    category,
    product_name,
    revenue,
    DENSE_RANK() OVER (PARTITION BY category ORDER BY revenue DESC) AS rnk
  FROM products
)
SELECT category, product_name, revenue
FROM ranked
WHERE rnk <= 3;</code></pre>
    `
  },
  {
    id: 3,
    title: 'CTEs vs Subqueries: When to Use Which (With Performance Tests)',
    slug: 'ctes-vs-subqueries',
    excerpt: 'Common Table Expressions (CTEs) improve readability, but do they hurt performance? We benchmark CTEs vs subqueries vs temp tables with real EXPLAIN ANALYZE output.',
    category: 'Performance Tuning',
    tags: 'CTE, Subquery, WITH, Performance, EXPLAIN, Optimization',
    views: 15600,
    likes: 298,
    readingTimeMinutes: 10,
    publishedAt: '2025-04-20T08:30:00Z',
    author: { firstName: 'Priya', lastName: 'Sharma', id: 3 },
    content: `
      <h2>What is a CTE?</h2>
      <p>A Common Table Expression (CTE) defines a temporary named result set using the <code>WITH</code> keyword. It exists only for the duration of the query.</p>

      <h2>Basic CTE Syntax</h2>
      <pre><code>WITH high_value_orders AS (
  SELECT customer_id, SUM(total) AS total_spent
  FROM orders
  WHERE status = 'completed'
  GROUP BY customer_id
  HAVING SUM(total) > 1000
)
SELECT c.name, c.email, h.total_spent
FROM customers c
JOIN high_value_orders h ON c.id = h.customer_id
ORDER BY h.total_spent DESC;</code></pre>

      <h2>Multiple CTEs</h2>
      <pre><code>WITH
monthly_revenue AS (
  SELECT DATE_TRUNC('month', created_at) AS month, SUM(total) AS revenue
  FROM orders GROUP BY 1
),
monthly_growth AS (
  SELECT
    month,
    revenue,
    LAG(revenue) OVER (ORDER BY month) AS prev_month,
    ROUND((revenue - LAG(revenue) OVER (ORDER BY month))
          / LAG(revenue) OVER (ORDER BY month) * 100, 2) AS growth_pct
  FROM monthly_revenue
)
SELECT * FROM monthly_growth WHERE growth_pct IS NOT NULL;</code></pre>

      <h2>Recursive CTEs — Hierarchies & Graphs</h2>
      <pre><code>-- Traverse employee management hierarchy
WITH RECURSIVE org_chart AS (
  -- Base case: CEO (no manager)
  SELECT id, name, manager_id, 0 AS level
  FROM employees
  WHERE manager_id IS NULL

  UNION ALL

  -- Recursive case: each employee's reports
  SELECT e.id, e.name, e.manager_id, oc.level + 1
  FROM employees e
  JOIN org_chart oc ON e.manager_id = oc.id
)
SELECT REPEAT('  ', level) || name AS hierarchy, level
FROM org_chart
ORDER BY level, name;</code></pre>

      <h2>CTE vs Subquery: Performance</h2>
      <p>In PostgreSQL, CTEs are <strong>optimization fences by default</strong> (before PG 12). The optimizer can't "look through" them. Use <code>NOT MATERIALIZED</code> to hint inline behavior:</p>
      <pre><code>-- Force inline (PostgreSQL 12+)
WITH filtered AS NOT MATERIALIZED (
  SELECT * FROM orders WHERE total > 100
)
SELECT * FROM filtered JOIN customers c ON filtered.customer_id = c.id;</code></pre>

      <h2>When to Choose Which</h2>
      <ul>
        <li><strong>CTE</strong>: Complex logic you reference multiple times, recursive queries, readable long queries</li>
        <li><strong>Subquery</strong>: Simple single-use filters, correlated lookups</li>
        <li><strong>Temp Table</strong>: Very large intermediate results you need to index</li>
      </ul>
    `
  },
  {
    id: 4,
    title: 'PostgreSQL Indexing Guide: B-Tree, GIN, GiST & Hash Indexes',
    slug: 'postgresql-indexing-guide',
    excerpt: 'The right index can turn a 10-second query into 10 milliseconds. Learn every PostgreSQL index type, when to use them, and how to read EXPLAIN ANALYZE output.',
    category: 'PostgreSQL',
    tags: 'PostgreSQL, Indexes, B-Tree, GIN, EXPLAIN, Performance',
    views: 21300,
    likes: 445,
    readingTimeMinutes: 14,
    publishedAt: '2025-05-05T11:00:00Z',
    author: { firstName: 'Alex', lastName: 'Kumar', id: 4 },
    content: `
      <h2>Why Indexes Matter</h2>
      <p>Without an index, PostgreSQL does a sequential scan — reading every row. With a proper index, it uses a binary search or hash lookup, finding results in <strong>O(log n)</strong> time instead of O(n).</p>

      <h2>Creating a Basic B-Tree Index</h2>
      <pre><code>-- Index for equality and range queries
CREATE INDEX idx_orders_customer_id ON orders (customer_id);
CREATE INDEX idx_orders_created_at  ON orders (created_at DESC);

-- Composite index — column order matters!
CREATE INDEX idx_orders_status_date ON orders (status, created_at);</code></pre>

      <h2>Reading EXPLAIN ANALYZE</h2>
      <pre><code>EXPLAIN ANALYZE
SELECT * FROM orders WHERE customer_id = 42 AND status = 'pending';

-- Output:
-- Index Scan using idx_orders_status_date on orders  (cost=0.43..8.45 rows=3)
--   Index Cond: ((status = 'pending') AND (customer_id = 42))
--   Rows Removed by Filter: 0
-- Planning Time: 0.3 ms
-- Execution Time: 0.05 ms</code></pre>

      <h2>Partial Indexes — Index Only What You Query</h2>
      <pre><code>-- Only index pending orders (not completed/cancelled)
CREATE INDEX idx_pending_orders ON orders (created_at)
WHERE status = 'pending';

-- 99% smaller index, queries on pending orders stay fast</code></pre>

      <h2>GIN Index — Full-Text Search & Arrays</h2>
      <pre><code>-- Full-text search index
CREATE INDEX idx_articles_fts ON articles
USING GIN (to_tsvector('english', title || ' ' || body));

-- Query it
SELECT title FROM articles
WHERE to_tsvector('english', title || ' ' || body) @@ to_tsquery('SQL & JOIN');</code></pre>

      <h2>Covering Index — Avoid Table Lookups</h2>
      <pre><code>-- Include all columns the query needs — no heap fetch required
CREATE INDEX idx_orders_covering ON orders (customer_id)
INCLUDE (total, status, created_at);</code></pre>

      <h2>When NOT to Add an Index</h2>
      <ul>
        <li>Tables with < 1000 rows (seq scan is faster)</li>
        <li>Columns with very low cardinality (boolean, status with 2 values)</li>
        <li>Tables with very high write/update rates (each write updates all indexes)</li>
      </ul>

      <h2>Find Unused Indexes</h2>
      <pre><code>SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY pg_relation_size(indexrelid) DESC;</code></pre>
    `
  },
  {
    id: 5,
    title: 'SQL Interview Questions: 25 Most Asked at Google, Amazon & Meta',
    slug: 'sql-interview-questions-faang',
    excerpt: 'Crack SQL rounds at top tech companies. We cover the 25 most frequently asked SQL interview questions with detailed answers and query solutions.',
    category: 'Interview Prep',
    tags: 'Interview, FAANG, Google, Amazon, SQL Questions, Career',
    views: 38500,
    likes: 712,
    readingTimeMinutes: 18,
    publishedAt: '2025-05-18T07:00:00Z',
    author: { firstName: 'Jordan', lastName: 'Lee', id: 5 },
    content: `
      <h2>Q1: Find the second highest salary</h2>
      <pre><code>-- Method 1: Subquery
SELECT MAX(salary) FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);

-- Method 2: DENSE_RANK (handles ties)
SELECT salary FROM (
  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
  FROM employees
) t WHERE rnk = 2;</code></pre>

      <h2>Q2: Customers who placed orders in both 2023 and 2024</h2>
      <pre><code>SELECT customer_id
FROM orders
WHERE EXTRACT(YEAR FROM created_at) IN (2023, 2024)
GROUP BY customer_id
HAVING COUNT(DISTINCT EXTRACT(YEAR FROM created_at)) = 2;</code></pre>

      <h2>Q3: Department with highest average salary</h2>
      <pre><code>SELECT department, ROUND(AVG(salary), 2) AS avg_salary
FROM employees
GROUP BY department
ORDER BY avg_salary DESC
LIMIT 1;</code></pre>

      <h2>Q4: Running total of daily signups</h2>
      <pre><code>SELECT
  signup_date,
  daily_signups,
  SUM(daily_signups) OVER (ORDER BY signup_date) AS cumulative_signups
FROM (
  SELECT DATE(created_at) AS signup_date, COUNT(*) AS daily_signups
  FROM users
  GROUP BY 1
) daily;</code></pre>

      <h2>Q5: Find duplicate records</h2>
      <pre><code>SELECT email, COUNT(*) AS occurrences
FROM users
GROUP BY email
HAVING COUNT(*) > 1
ORDER BY occurrences DESC;</code></pre>

      <h2>Q6: Employees who earn more than their manager</h2>
      <pre><code>SELECT e.name AS employee, e.salary, m.name AS manager, m.salary AS manager_salary
FROM employees e
JOIN employees m ON e.manager_id = m.id
WHERE e.salary > m.salary;</code></pre>

      <h2>Q7: 7-day moving average of revenue</h2>
      <pre><code>SELECT
  date,
  revenue,
  ROUND(AVG(revenue) OVER (
    ORDER BY date
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ), 2) AS moving_avg_7d
FROM daily_revenue;</code></pre>

      <h2>Q8: Users active in last 30 days but not last 7 days</h2>
      <pre><code>SELECT DISTINCT user_id
FROM activity
WHERE action_date >= CURRENT_DATE - INTERVAL '30 days'
  AND user_id NOT IN (
    SELECT DISTINCT user_id FROM activity
    WHERE action_date >= CURRENT_DATE - INTERVAL '7 days'
  );</code></pre>

      <h2>Q9: Pivot monthly sales by category</h2>
      <pre><code>SELECT
  EXTRACT(MONTH FROM sale_date) AS month,
  SUM(CASE WHEN category = 'Electronics' THEN amount ELSE 0 END) AS electronics,
  SUM(CASE WHEN category = 'Clothing'    THEN amount ELSE 0 END) AS clothing,
  SUM(CASE WHEN category = 'Food'        THEN amount ELSE 0 END) AS food
FROM sales
GROUP BY 1
ORDER BY 1;</code></pre>

      <h2>Q10: Retention Rate Month-Over-Month</h2>
      <pre><code>WITH monthly_users AS (
  SELECT user_id, DATE_TRUNC('month', activity_date) AS month
  FROM activity
  GROUP BY 1, 2
)
SELECT
  curr.month,
  COUNT(DISTINCT curr.user_id) AS active_users,
  COUNT(DISTINCT prev.user_id) AS retained_users,
  ROUND(COUNT(DISTINCT prev.user_id)::decimal / COUNT(DISTINCT curr.user_id) * 100, 1) AS retention_rate
FROM monthly_users curr
LEFT JOIN monthly_users prev
  ON curr.user_id = prev.user_id
  AND prev.month = curr.month - INTERVAL '1 month'
GROUP BY curr.month
ORDER BY curr.month;</code></pre>
    `
  },
  {
    id: 6,
    title: 'Database Normalization: 1NF, 2NF, 3NF & BCNF With Real Examples',
    slug: 'database-normalization-guide',
    excerpt: 'Bad database design causes data anomalies and bugs. Learn normalization with a step-by-step example that transforms a single messy table into a clean, efficient schema.',
    category: 'Database Design',
    tags: 'Normalization, 1NF, 2NF, 3NF, BCNF, Schema Design',
    views: 17800,
    likes: 334,
    readingTimeMinutes: 13,
    publishedAt: '2025-06-01T09:30:00Z',
    author: { firstName: 'Maria', lastName: 'Garcia', id: 6 },
    content: `
      <h2>Why Normalize?</h2>
      <p>Without normalization you get: <strong>update anomalies</strong> (change one thing, miss another), <strong>insert anomalies</strong> (can't add data without unrelated data), and <strong>delete anomalies</strong> (deleting a row loses unrelated facts).</p>

      <h2>The Unnormalized Starting Point</h2>
      <pre><code>-- One messy orders table
orders(order_id, customer_name, customer_email, customer_city,
       product_id, product_name, product_category,
       quantity, unit_price, order_date)</code></pre>

      <h2>First Normal Form (1NF) — Eliminate Repeating Groups</h2>
      <p>Each cell must hold a single atomic value. No arrays or comma-separated lists.</p>
      <pre><code>-- BAD (violates 1NF)
order_id | products
1        | 'pen,notebook,stapler'

-- GOOD (1NF)
order_id | product
1        | 'pen'
1        | 'notebook'
1        | 'stapler'</code></pre>

      <h2>Second Normal Form (2NF) — Eliminate Partial Dependencies</h2>
      <p>Every non-key column must depend on the <em>entire</em> primary key (applies to composite PKs).</p>
      <pre><code>-- Separate customer and product info (they depend on only part of the key)
CREATE TABLE customers (
  customer_id SERIAL PRIMARY KEY,
  name TEXT, email TEXT, city TEXT
);

CREATE TABLE products (
  product_id SERIAL PRIMARY KEY,
  name TEXT, category TEXT, unit_price DECIMAL
);

CREATE TABLE orders (
  order_id   SERIAL PRIMARY KEY,
  customer_id INT REFERENCES customers(id),
  order_date  DATE
);

CREATE TABLE order_items (
  order_id   INT REFERENCES orders(id),
  product_id INT REFERENCES products(id),
  quantity   INT,
  PRIMARY KEY (order_id, product_id)
);</code></pre>

      <h2>Third Normal Form (3NF) — Eliminate Transitive Dependencies</h2>
      <p>No non-key column should depend on another non-key column.</p>
      <pre><code>-- BAD: zip_code → city (transitive dependency)
customers(id, name, zip_code, city)

-- GOOD: move city to zip_codes lookup table
CREATE TABLE zip_codes (zip_code CHAR(5) PRIMARY KEY, city TEXT, state TEXT);
CREATE TABLE customers (id SERIAL PRIMARY KEY, name TEXT, zip_code CHAR(5) REFERENCES zip_codes);</code></pre>

      <h2>BCNF — Boyce-Codd Normal Form</h2>
      <p>Stricter than 3NF: every determinant must be a candidate key.</p>
      <pre><code>-- Rooms example: {student, course} → instructor, but instructor → course
-- Decompose to remove the anomaly:
CREATE TABLE instructor_course (instructor TEXT PRIMARY KEY, course TEXT);
CREATE TABLE student_instructor (student TEXT, instructor TEXT, PRIMARY KEY (student, instructor));</code></pre>
    `
  },
  {
    id: 7,
    title: 'Query Optimization: 10 Techniques to Speed Up Slow SQL Queries',
    slug: 'query-optimization-techniques',
    excerpt: 'Your queries are running slow. Here are 10 battle-tested optimization techniques — from index strategies to query rewrites — that will cut execution time dramatically.',
    category: 'Performance Tuning',
    tags: 'Performance, Optimization, EXPLAIN, Index, Slow Query',
    views: 29100,
    likes: 521,
    readingTimeMinutes: 16,
    publishedAt: '2025-06-08T10:00:00Z',
    author: { firstName: 'David', lastName: 'Park', id: 7 },
    content: `
      <h2>1. Use EXPLAIN ANALYZE First</h2>
      <p>Never optimize blindly. Always check the query plan first.</p>
      <pre><code>EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT * FROM orders WHERE customer_id = 42;</code></pre>
      <p>Look for: <strong>Seq Scan</strong> (bad on large tables), <strong>Nested Loop</strong> on large datasets, high <strong>actual rows vs estimated rows</strong> (stale stats).</p>

      <h2>2. Add Missing Indexes</h2>
      <pre><code>-- Find columns used in WHERE with seq scans
SELECT schemaname, tablename, attname, n_distinct, correlation
FROM pg_stats
WHERE tablename = 'orders';</code></pre>

      <h2>3. Select Only Needed Columns (Avoid SELECT *)</h2>
      <pre><code>-- BAD: fetches all columns, can't use index-only scan
SELECT * FROM users WHERE email = 'test@example.com';

-- GOOD: covering index can serve this entirely
SELECT id, name FROM users WHERE email = 'test@example.com';</code></pre>

      <h2>4. Filter Before Joining</h2>
      <pre><code>-- BAD: join then filter
SELECT * FROM orders o JOIN customers c ON o.customer_id = c.id
WHERE o.status = 'pending';

-- GOOD: pre-filter with CTE or subquery
WITH pending AS (SELECT * FROM orders WHERE status = 'pending')
SELECT * FROM pending p JOIN customers c ON p.customer_id = c.id;</code></pre>

      <h2>5. Replace Correlated Subqueries With JOINs</h2>
      <pre><code>-- BAD: runs once per row (O(n²))
SELECT name, (SELECT COUNT(*) FROM orders WHERE customer_id = c.id) AS order_count
FROM customers c;

-- GOOD: one pass
SELECT c.name, COUNT(o.id) AS order_count
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name;</code></pre>

      <h2>6. Use EXISTS Instead of IN for Subqueries</h2>
      <pre><code>-- Slower with large subquery result
SELECT * FROM customers WHERE id IN (SELECT customer_id FROM orders WHERE total > 500);

-- Faster: stops at first match
SELECT * FROM customers c WHERE EXISTS (
  SELECT 1 FROM orders o WHERE o.customer_id = c.id AND o.total > 500
);</code></pre>

      <h2>7. Avoid Functions on Indexed Columns in WHERE</h2>
      <pre><code>-- BAD: can't use index on created_at
SELECT * FROM orders WHERE EXTRACT(YEAR FROM created_at) = 2024;

-- GOOD: range query, uses index
SELECT * FROM orders
WHERE created_at BETWEEN '2024-01-01' AND '2024-12-31 23:59:59';</code></pre>

      <h2>8. Use LIMIT for Pagination Efficiently</h2>
      <pre><code>-- BAD: OFFSET gets slow at high page numbers (reads all skipped rows)
SELECT * FROM products ORDER BY id LIMIT 20 OFFSET 10000;

-- GOOD: keyset pagination
SELECT * FROM products WHERE id > 10020 ORDER BY id LIMIT 20;</code></pre>

      <h2>9. Vacuum & Analyze Regularly</h2>
      <pre><code>-- Update statistics for query planner
ANALYZE orders;

-- Reclaim space from dead rows
VACUUM (VERBOSE, ANALYZE) orders;</code></pre>

      <h2>10. Use Connection Pooling</h2>
      <p>PgBouncer reduces connection overhead from ~3ms per connection to microseconds for high-traffic apps. Configure in transaction pooling mode for maximum throughput.</p>
    `
  },
  {
    id: 8,
    title: 'Transactions & Isolation Levels: Preventing Dirty Reads & Deadlocks',
    slug: 'sql-transactions-isolation-levels',
    excerpt: 'Race conditions in databases cause corrupted data. Learn ACID properties, the 4 SQL isolation levels, and how to design transactions that are safe under concurrency.',
    category: 'PostgreSQL',
    tags: 'Transactions, ACID, Isolation, Deadlock, Concurrency, PostgreSQL',
    views: 14200,
    likes: 287,
    readingTimeMinutes: 11,
    publishedAt: '2025-06-10T08:00:00Z',
    author: { firstName: 'Sarah', lastName: 'Chen', id: 1 },
    content: `
      <h2>ACID Properties</h2>
      <ul>
        <li><strong>Atomicity</strong>: All-or-nothing. Either all statements in a transaction commit, or none do.</li>
        <li><strong>Consistency</strong>: Database moves from one valid state to another. Constraints are never violated.</li>
        <li><strong>Isolation</strong>: Concurrent transactions don't interfere with each other.</li>
        <li><strong>Durability</strong>: Once committed, data survives crashes (WAL logging).</li>
      </ul>

      <h2>Basic Transaction Syntax</h2>
      <pre><code>BEGIN;

UPDATE accounts SET balance = balance - 500 WHERE id = 1;
UPDATE accounts SET balance = balance + 500 WHERE id = 2;

-- Check for errors before committing
COMMIT;

-- Or roll back if something went wrong
-- ROLLBACK;</code></pre>

      <h2>Savepoints — Partial Rollbacks</h2>
      <pre><code>BEGIN;

INSERT INTO orders (customer_id, total) VALUES (42, 99.99);
SAVEPOINT order_placed;

INSERT INTO payments (order_id, amount) VALUES (LASTVAL(), 99.99);

-- If payment fails, roll back just the payment
ROLLBACK TO SAVEPOINT order_placed;

-- Order still exists, re-try with different payment
COMMIT;</code></pre>

      <h2>The 4 Isolation Levels</h2>
      <pre><code>-- Set for current transaction
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;    -- Default in PostgreSQL
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;</code></pre>
      <table>
        <tr><th>Level</th><th>Dirty Read</th><th>Non-Repeatable Read</th><th>Phantom Read</th></tr>
        <tr><td>Read Uncommitted</td><td>Possible</td><td>Possible</td><td>Possible</td></tr>
        <tr><td>Read Committed</td><td>Safe</td><td>Possible</td><td>Possible</td></tr>
        <tr><td>Repeatable Read</td><td>Safe</td><td>Safe</td><td>Possible</td></tr>
        <tr><td>Serializable</td><td>Safe</td><td>Safe</td><td>Safe</td></tr>
      </table>

      <h2>Detecting & Preventing Deadlocks</h2>
      <pre><code>-- Always acquire locks in the same order
-- BAD: Transaction A locks row 1 then row 2
--      Transaction B locks row 2 then row 1 → deadlock

-- GOOD: both lock in ascending id order
BEGIN;
SELECT * FROM accounts WHERE id IN (1, 2) ORDER BY id FOR UPDATE;
-- Now safely update both</code></pre>

      <h2>Advisory Locks for Application-Level Locking</h2>
      <pre><code>-- Lock a resource by integer key (no table needed)
SELECT pg_try_advisory_lock(42);  -- returns true if acquired

-- Do work...

SELECT pg_advisory_unlock(42);</code></pre>
    `
  },
  {
    id: 9,
    title: 'PostgreSQL JSON & JSONB: Querying Semi-Structured Data',
    slug: 'postgresql-json-jsonb',
    excerpt: 'PostgreSQL JSONB lets you store flexible, schema-less data alongside relational tables. Learn operators, indexing, and when JSON in PostgreSQL beats a document database.',
    category: 'PostgreSQL',
    tags: 'PostgreSQL, JSON, JSONB, NoSQL, Semi-Structured, GIN Index',
    views: 11900,
    likes: 243,
    readingTimeMinutes: 12,
    publishedAt: '2025-06-12T10:30:00Z',
    author: { firstName: 'Alex', lastName: 'Kumar', id: 4 },
    content: `
      <h2>JSON vs JSONB</h2>
      <p><strong>JSON</strong>: stores exact text, preserves duplicate keys and key order. Slower to query.<br>
      <strong>JSONB</strong>: binary format, removes duplicates, faster querying, supports indexes. <strong>Almost always prefer JSONB.</strong></p>

      <h2>Storing and Querying JSON</h2>
      <pre><code>CREATE TABLE products (
  id      SERIAL PRIMARY KEY,
  name    TEXT,
  attrs   JSONB  -- flexible attributes
);

INSERT INTO products (name, attrs) VALUES
  ('Laptop', '{"brand":"Dell","ram_gb":16,"storage":"512GB SSD","in_stock":true}'),
  ('Phone',  '{"brand":"Apple","storage":"256GB","color":"midnight","in_stock":false}');</code></pre>

      <h2>Accessing JSON Fields</h2>
      <pre><code>-- Get brand as JSON
SELECT attrs->'brand' FROM products;           -- returns "Dell" (with quotes)

-- Get brand as text
SELECT attrs->>'brand' FROM products;          -- returns Dell

-- Nested access
SELECT attrs->'specs'->>'cpu' FROM products;

-- Filter by JSON field
SELECT name FROM products WHERE attrs->>'brand' = 'Apple';
SELECT name FROM products WHERE (attrs->>'ram_gb')::int > 8;</code></pre>

      <h2>GIN Index for Fast JSON Queries</h2>
      <pre><code>-- Index all keys and values
CREATE INDEX idx_products_attrs ON products USING GIN (attrs);

-- Now this is fast:
SELECT * FROM products WHERE attrs @> '{"brand": "Dell", "in_stock": true}';</code></pre>

      <h2>Aggregating JSON Arrays</h2>
      <pre><code>-- Expand JSON array to rows
SELECT id, jsonb_array_elements(attrs->'tags') AS tag
FROM products;

-- Build JSON object from query
SELECT jsonb_build_object('id', id, 'name', name) FROM products;

-- Aggregate rows into JSON array
SELECT jsonb_agg(jsonb_build_object('id', id, 'name', name))
FROM products WHERE attrs->>'in_stock' = 'true';</code></pre>

      <h2>Updating JSONB Fields</h2>
      <pre><code>-- Set a key
UPDATE products SET attrs = attrs || '{"in_stock": false}' WHERE id = 1;

-- Remove a key
UPDATE products SET attrs = attrs - 'color' WHERE id = 2;

-- Update nested key
UPDATE products
SET attrs = jsonb_set(attrs, '{specs, ram_gb}', '32')
WHERE id = 1;</code></pre>
    `
  },
  {
    id: 10,
    title: 'GROUP BY vs PARTITION BY: Understanding the Core Difference',
    slug: 'group-by-vs-partition-by',
    excerpt: 'GROUP BY collapses rows — PARTITION BY keeps them. This single distinction unlocks the power of window functions. Master it with clear before/after query comparisons.',
    category: 'SQL Basics',
    tags: 'GROUP BY, PARTITION BY, Window Functions, Aggregation, SQL',
    views: 22400,
    likes: 398,
    readingTimeMinutes: 9,
    publishedAt: '2025-06-13T09:00:00Z',
    author: { firstName: 'Marcus', lastName: 'Johnson', id: 2 },
    content: `
      <h2>The Core Difference</h2>
      <p><strong>GROUP BY</strong> reduces many rows to one summary row per group.<br>
      <strong>PARTITION BY</strong> computes a value for each row using neighboring rows — the original rows remain.</p>

      <h2>GROUP BY Example</h2>
      <pre><code>-- Returns ONE row per department
SELECT department, COUNT(*) AS headcount, AVG(salary) AS avg_salary
FROM employees
GROUP BY department;</code></pre>
      <p>Output: 3 rows (one per department). Individual employee rows are gone.</p>

      <h2>PARTITION BY Example</h2>
      <pre><code>-- Returns ALL rows, with department stats attached to each row
SELECT
  name,
  department,
  salary,
  COUNT(*) OVER (PARTITION BY department)  AS dept_headcount,
  AVG(salary) OVER (PARTITION BY department) AS dept_avg_salary,
  salary - AVG(salary) OVER (PARTITION BY department) AS diff_from_avg
FROM employees;</code></pre>
      <p>Output: All 50 employee rows, each with their department's stats alongside individual data.</p>

      <h2>Combining Both in One Query</h2>
      <pre><code>-- Department totals AND individual row details in same query
SELECT
  d.department,
  d.total_employees,
  d.total_salary,
  e.name,
  e.salary,
  ROUND(e.salary / d.total_salary * 100, 1) AS pct_of_dept_salary
FROM (
  SELECT department, COUNT(*) AS total_employees, SUM(salary) AS total_salary
  FROM employees GROUP BY department
) d
JOIN employees e ON e.department = d.department
ORDER BY d.department, e.salary DESC;</code></pre>

      <h2>Percent of Total — Classic Pattern</h2>
      <pre><code>SELECT
  category,
  revenue,
  SUM(revenue) OVER () AS total_revenue,
  ROUND(revenue / SUM(revenue) OVER () * 100, 1) AS pct_of_total
FROM category_sales
ORDER BY revenue DESC;</code></pre>

      <h2>Running Count Within Groups</h2>
      <pre><code>SELECT
  department,
  name,
  hire_date,
  ROW_NUMBER() OVER (PARTITION BY department ORDER BY hire_date) AS hire_order
FROM employees;</code></pre>
    `
  }
];
