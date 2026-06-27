package com.sqlmasterpro.config;

import com.sqlmasterpro.model.entity.Course;
import com.sqlmasterpro.model.entity.Lesson;
import com.sqlmasterpro.model.enums.DifficultyLevel;
import com.sqlmasterpro.repository.CourseRepository;
import com.sqlmasterpro.repository.LessonRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
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

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public void run(String... args) {
        resyncSequence("courses_seq", "courses");
        resyncSequence("lessons_seq", "lessons");

        if (courseRepository.count() > 0) {
            return;
        }
        log.info("No courses found — seeding starter SQL course catalog");

        seedCourse(
            "SQL Fundamentals", "Learn the basics of SQL — SELECT, WHERE, ORDER BY and more.",
            "Start your SQL journey from zero.", DifficultyLevel.BEGINNER, 0, false, 4,
            List.of(
                lesson("Introduction to Databases",
                    "<h2>What Is a Database?</h2><p>A database is an organized collection of data stored electronically and managed by a Database Management System (DBMS), such as PostgreSQL, MySQL, or Oracle. Instead of scattering information across spreadsheets or text files, a database keeps related data together in a structured, queryable form.</p>" +
                    "<h3>Relational Databases</h3><p>A relational database organizes data into tables made up of rows and columns, similar to a spreadsheet. Each table represents one type of entity, such as employees or orders, and tables can be linked together through shared key columns.</p>" +
                    "<table><tr><th>Term</th><th>Meaning</th></tr><tr><td>Table</td><td>A named collection of rows, all sharing the same columns</td></tr><tr><td>Row</td><td>A single record in a table, also called a tuple</td></tr><tr><td>Column</td><td>A named attribute shared by every row, also called a field</td></tr><tr><td>Primary Key</td><td>A column, or set of columns, that uniquely identifies each row</td></tr></table>" +
                    "<h3>Why SQL?</h3><p>SQL, Structured Query Language, is the standard language for creating, reading, updating, and deleting data in a relational database. Every major relational database understands SQL, which is why it has remained the most widely used data language for over four decades.</p>",
                    "TEXT", 10, 10,
                    "-- A simple table of employees\nSELECT * FROM employees;",
                    "A database is an organized, electronically stored collection of data\nA DBMS like PostgreSQL manages and enforces structure on that data\nRelational databases organize data into tables made of rows and columns\nSQL is the standard language used to interact with relational databases"),

                lesson("Your First SELECT Statement",
                    "<h2>The SELECT Statement</h2><p>SELECT is the most fundamental SQL command. It retrieves data from one or more tables without modifying anything, making it completely safe to experiment with.</p>" +
                    "<pre>SELECT column1, column2\nFROM table_name;</pre>" +
                    "<h3>Selecting Every Column</h3><p>The asterisk wildcard selects every column in the table, which is convenient while exploring data but should usually be avoided in production code, where naming exact columns is clearer and more efficient.</p>" +
                    "<pre>SELECT * FROM employees;</pre>" +
                    "<h3>Selecting Specific Columns</h3><p>Naming exact columns returns only the data you actually need.</p>" +
                    "<pre>SELECT first_name, last_name, salary\nFROM employees;</pre>" +
                    "<h3>Renaming Columns With AS</h3><p>The AS keyword gives a column a friendlier name in the result set, called an alias, without changing the underlying table.</p>" +
                    "<pre>SELECT first_name AS name, salary AS monthly_pay\nFROM employees;</pre>",
                    "TEXT", 15, 15,
                    "SELECT * FROM employees;\n---\nSELECT first_name, last_name, salary FROM employees;\n---\nSELECT first_name AS name, salary AS monthly_pay FROM employees;",
                    "SELECT retrieves data without changing it\nThe asterisk (*) selects every column\nFROM specifies which table to read from\nAS renames a column in the output using an alias\nEvery SQL statement ends with a semicolon"),

                lesson("Filtering with WHERE",
                    "<h2>The WHERE Clause</h2><p>WHERE filters rows based on a condition, so only rows where the condition evaluates to true are included in the result.</p>" +
                    "<pre>SELECT * FROM employees\nWHERE salary > 50000;</pre>" +
                    "<h3>Comparison Operators</h3><table><tr><th>Operator</th><th>Meaning</th></tr><tr><td>=</td><td>Equal to</td></tr><tr><td>!= or &lt;&gt;</td><td>Not equal to</td></tr><tr><td>&gt;, &gt;=</td><td>Greater than, greater than or equal to</td></tr><tr><td>&lt;, &lt;=</td><td>Less than, less than or equal to</td></tr></table>" +
                    "<h3>Combining Conditions</h3><p>AND requires both conditions to be true. OR requires at least one to be true.</p>" +
                    "<pre>SELECT * FROM employees\nWHERE department = 'Sales' AND salary > 40000;</pre>" +
                    "<h3>Filtering With a List or Range</h3><p>IN checks against a list of values, and BETWEEN checks an inclusive range, both of which are shorter than chaining several OR conditions together.</p>" +
                    "<pre>SELECT * FROM employees WHERE department IN ('Sales', 'Marketing');\nSELECT * FROM employees WHERE salary BETWEEN 40000 AND 80000;</pre>",
                    "INTERACTIVE", 20, 20,
                    "SELECT * FROM employees WHERE salary > 50000;\n---\nSELECT * FROM employees WHERE department = 'Sales' AND salary > 40000;\n---\nSELECT * FROM employees WHERE department IN ('Sales', 'Marketing');",
                    "WHERE filters rows before any grouping happens\nComparison operators include =, !=, >, <, >=, <=\nAND requires every condition to be true; OR requires at least one\nIN checks membership in a list; BETWEEN checks an inclusive range"),

                lesson("Sorting with ORDER BY",
                    "<h2>The ORDER BY Clause</h2><p>ORDER BY sorts the rows returned by a query. Without it, a database makes no guarantee about the order rows come back in.</p>" +
                    "<pre>SELECT first_name, salary\nFROM employees\nORDER BY salary DESC;</pre>" +
                    "<h3>Ascending vs Descending</h3><p>ASC sorts smallest to largest and is the default if you omit it entirely. DESC sorts largest to smallest.</p>" +
                    "<pre>SELECT * FROM employees ORDER BY first_name ASC;\nSELECT * FROM employees ORDER BY salary DESC;</pre>" +
                    "<h3>Sorting by Multiple Columns</h3><p>Listing more than one column breaks ties in the first column using the second column, and so on.</p>" +
                    "<pre>SELECT * FROM employees\nORDER BY department ASC, salary DESC;</pre>" +
                    "<h3>Combining With LIMIT</h3><p>LIMIT restricts how many rows come back, which combined with ORDER BY is the standard way to answer questions like \"who are the top 5 earners.\"</p>" +
                    "<pre>SELECT first_name, salary FROM employees\nORDER BY salary DESC\nLIMIT 5;</pre>",
                    "INTERACTIVE", 15, 15,
                    "SELECT * FROM employees ORDER BY salary DESC;\n---\nSELECT * FROM employees ORDER BY department ASC, salary DESC;\n---\nSELECT first_name, salary FROM employees ORDER BY salary DESC LIMIT 5;",
                    "ORDER BY controls the sort order of query results\nASC is ascending (default); DESC is descending\nMultiple sort columns break ties left to right\nLIMIT combined with ORDER BY answers top-N questions")
            )
        );

        seedCourse(
            "Joins & Relationships", "Master INNER, LEFT, RIGHT and FULL joins across multiple tables.",
            "Connect data across tables like a pro.", DifficultyLevel.INTERMEDIATE, 1, false, 5,
            List.of(
                lesson("Understanding Table Relationships",
                    "<h2>Primary and Foreign Keys</h2><p>Relational databases split data across multiple tables to avoid duplication, then link them back together using keys. A primary key uniquely identifies each row in its own table. A foreign key is a column in one table that references a primary key in another table.</p>" +
                    "<table><tr><th>employees</th><th>departments</th></tr><tr><td>employee_id (PK), name, dept_id (FK)</td><td>dept_id (PK), dept_name</td></tr></table>" +
                    "<h3>One-to-Many Relationships</h3><p>One department can have many employees, but each employee belongs to exactly one department, making this a one-to-many relationship, the most common pattern in relational schemas.</p>" +
                    "<h3>Many-to-Many Relationships</h3><p>A student can enroll in many courses, and a course can have many students. This requires a third linking table, often called a junction table, holding pairs of foreign keys from both sides.</p>" +
                    "<pre>CREATE TABLE enrollments (\n  student_id INT REFERENCES students(student_id),\n  course_id INT REFERENCES courses(course_id),\n  PRIMARY KEY (student_id, course_id)\n);</pre>",
                    "TEXT", 12, 10,
                    "CREATE TABLE departments (dept_id SERIAL PRIMARY KEY, dept_name VARCHAR(100));\n---\nCREATE TABLE employees (employee_id SERIAL PRIMARY KEY, name VARCHAR(100), dept_id INT REFERENCES departments(dept_id));",
                    "A primary key uniquely identifies a row in its own table\nA foreign key references a primary key in another table\nOne-to-many is the most common relationship pattern\nMany-to-many relationships require a junction table"),

                lesson("INNER JOIN",
                    "<h2>INNER JOIN</h2><p>INNER JOIN returns only the rows that have a matching value in both tables. Rows without a match on either side are excluded entirely.</p>" +
                    "<pre>SELECT e.name, d.dept_name\nFROM employees e\nINNER JOIN departments d ON e.dept_id = d.dept_id;</pre>" +
                    "<h3>Why Alias Tables?</h3><p>Aliasing each table with a short letter, such as e for employees, keeps column references like e.name unambiguous when both tables could otherwise have a column with the same name.</p>" +
                    "<h3>Joining on Multiple Conditions</h3><p>You can combine multiple conditions with AND inside the ON clause, useful for composite keys.</p>" +
                    "<pre>SELECT * FROM orders o\nINNER JOIN order_items oi\n  ON oi.order_id = o.order_id AND oi.is_active = true;</pre>",
                    "INTERACTIVE", 20, 20,
                    "SELECT e.name, d.dept_name FROM employees e INNER JOIN departments d ON e.dept_id = d.dept_id;",
                    "INNER JOIN keeps only rows with a match in both tables\nTable aliases keep column references unambiguous\nON conditions can combine multiple columns with AND\nINNER JOIN is the default, most restrictive join type"),

                lesson("LEFT and RIGHT JOIN",
                    "<h2>LEFT JOIN</h2><p>LEFT JOIN keeps every row from the left table, filling in NULL for any right-table columns that have no match.</p>" +
                    "<pre>SELECT e.name, d.dept_name\nFROM employees e\nLEFT JOIN departments d ON e.dept_id = d.dept_id;</pre>" +
                    "<p>An employee with no department assigned still appears in the result, with dept_name shown as NULL instead of being dropped.</p>" +
                    "<h2>RIGHT JOIN</h2><p>RIGHT JOIN is the mirror image: it keeps every row from the right table instead.</p>" +
                    "<pre>SELECT e.name, d.dept_name\nFROM employees e\nRIGHT JOIN departments d ON e.dept_id = d.dept_id;</pre>" +
                    "<p>Most developers rewrite a RIGHT JOIN as a LEFT JOIN with the table order swapped, since it tends to read more naturally from left to right.</p>",
                    "INTERACTIVE", 20, 20,
                    "SELECT e.name, d.dept_name FROM employees e LEFT JOIN departments d ON e.dept_id = d.dept_id;\n---\nSELECT e.name, d.dept_name FROM employees e RIGHT JOIN departments d ON e.dept_id = d.dept_id;",
                    "LEFT JOIN keeps every row from the left table\nUnmatched right-side columns are filled with NULL\nRIGHT JOIN keeps every row from the right table instead\nA RIGHT JOIN can always be rewritten as a LEFT JOIN with table order swapped"),

                lesson("FULL OUTER JOIN",
                    "<h2>FULL OUTER JOIN</h2><p>FULL OUTER JOIN combines LEFT and RIGHT JOIN behavior, keeping every row from both tables and matching where possible.</p>" +
                    "<pre>SELECT e.name, d.dept_name\nFROM employees e\nFULL OUTER JOIN departments d ON e.dept_id = d.dept_id;</pre>" +
                    "<p>This returns employees with no department, departments with no employees, and every normally matched row, all in one result set, which makes it the standard tool for data reconciliation tasks.</p>" +
                    "<h3>Finding Orphaned Rows</h3><p>Filtering for NULL on either side after a FULL OUTER JOIN isolates exactly the unmatched rows.</p>" +
                    "<pre>SELECT e.name, d.dept_name\nFROM employees e\nFULL OUTER JOIN departments d ON e.dept_id = d.dept_id\nWHERE e.employee_id IS NULL OR d.dept_id IS NULL;</pre>",
                    "INTERACTIVE", 18, 18,
                    "SELECT e.name, d.dept_name FROM employees e FULL OUTER JOIN departments d ON e.dept_id = d.dept_id;",
                    "FULL OUTER JOIN keeps every row from both tables\nUnmatched rows on either side are filled with NULL\nIt is the standard tool for finding orphaned or mismatched records\nMySQL has no native FULL OUTER JOIN and simulates it with a UNION"),

                lesson("Self Joins",
                    "<h2>What Is a Self Join?</h2><p>A self join joins a table to itself, typically to compare rows within the same table, such as comparing each employee to their own manager, who is also stored as a row in the employees table.</p>" +
                    "<pre>SELECT e.name AS employee, m.name AS manager\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.employee_id;</pre>" +
                    "<h3>Why Two Aliases Are Required</h3><p>Without aliasing the table twice with different names, the database has no way to tell which copy of employees a given column reference belongs to. Always alias both sides of a self join.</p>" +
                    "<h3>Other Common Uses</h3><p>Self joins are also used to find duplicate rows, compare each row to the next one in a sequence, or build hierarchical reports such as an org chart.</p>",
                    "INTERACTIVE", 18, 18,
                    "SELECT e.name AS employee, m.name AS manager FROM employees e LEFT JOIN employees m ON e.manager_id = m.employee_id;",
                    "A self join joins a table to itself\nBoth sides must be aliased with different names\nSelf joins are common for manager/employee hierarchies\nThey are also used to find duplicates or compare adjacent rows")
            )
        );

        seedCourse(
            "Aggregations & Grouping", "GROUP BY, HAVING, and aggregate functions like COUNT, SUM and AVG.",
            "Summarize and analyze your data.", DifficultyLevel.INTERMEDIATE, 2, true, 4,
            List.of(
                lesson("Aggregate Functions",
                    "<h2>Aggregate Functions</h2><p>Aggregate functions take many rows and collapse them into a single summary value, such as a total or an average.</p>" +
                    "<table><tr><th>Function</th><th>Returns</th></tr><tr><td>COUNT(*)</td><td>Number of rows</td></tr><tr><td>SUM(column)</td><td>Total of a numeric column</td></tr><tr><td>AVG(column)</td><td>Average value</td></tr><tr><td>MIN(column)</td><td>Smallest value</td></tr><tr><td>MAX(column)</td><td>Largest value</td></tr></table>" +
                    "<pre>SELECT COUNT(*) AS total_employees,\n       AVG(salary) AS avg_salary,\n       MAX(salary) AS highest_salary\nFROM employees;</pre>" +
                    "<h3>COUNT(*) vs COUNT(column)</h3><p>COUNT(*) counts every row, including ones with NULLs. COUNT(column) counts only rows where that specific column is not NULL.</p>",
                    "TEXT", 15, 15,
                    "SELECT COUNT(*) AS total_employees, AVG(salary) AS avg_salary, MAX(salary) AS highest_salary FROM employees;",
                    "Aggregate functions collapse many rows into one summary value\nCOUNT, SUM, AVG, MIN, and MAX are the five most common aggregates\nCOUNT(*) counts all rows; COUNT(column) skips NULLs in that column\nAggregates are usually combined with GROUP BY for per-category summaries"),

                lesson("GROUP BY",
                    "<h2>The GROUP BY Clause</h2><p>GROUP BY groups rows that share the same value in one or more columns, so an aggregate function runs once per group instead of once for the whole table.</p>" +
                    "<pre>SELECT department, COUNT(*) AS headcount, AVG(salary) AS avg_salary\nFROM employees\nGROUP BY department;</pre>" +
                    "<p>This returns one row per department, with the headcount and average salary computed separately for each group.</p>" +
                    "<h3>A Common Rule</h3><p>Every column in SELECT must either be inside an aggregate function or listed in GROUP BY. Selecting a non-grouped, non-aggregated column produces an error or an arbitrary value, depending on the database.</p>",
                    "INTERACTIVE", 20, 20,
                    "SELECT department, COUNT(*) AS headcount, AVG(salary) AS avg_salary FROM employees GROUP BY department;",
                    "GROUP BY groups rows sharing the same column value\nAggregate functions then compute once per group, not once overall\nEvery selected column must be aggregated or listed in GROUP BY\nGROUP BY runs after WHERE but before HAVING and ORDER BY"),

                lesson("HAVING vs WHERE",
                    "<h2>Filtering Groups With HAVING</h2><p>WHERE filters individual rows before grouping happens. HAVING filters entire groups after GROUP BY has run, which is the only place you can reference an aggregate function in a filter condition.</p>" +
                    "<pre>SELECT department, AVG(salary) AS avg_salary\nFROM employees\nGROUP BY department\nHAVING AVG(salary) > 60000;</pre>" +
                    "<p>This returns only departments whose average salary exceeds 60000, after the averages have already been computed.</p>" +
                    "<h3>Combining WHERE and HAVING</h3><p>You can use both together: WHERE narrows down the rows first, then HAVING filters the resulting groups.</p>" +
                    "<pre>SELECT department, COUNT(*) AS active_count\nFROM employees\nWHERE active = true\nGROUP BY department\nHAVING COUNT(*) >= 5;</pre>",
                    "INTERACTIVE", 18, 18,
                    "SELECT department, AVG(salary) AS avg_salary FROM employees GROUP BY department HAVING AVG(salary) > 60000;",
                    "WHERE filters rows before grouping; HAVING filters groups after\nHAVING is the only clause that can filter on an aggregate result\nWHERE and HAVING can be combined in the same query\nExecution order is roughly: WHERE, GROUP BY, HAVING, ORDER BY"),

                lesson("Subqueries in Aggregations",
                    "<h2>Combining Subqueries With Aggregates</h2><p>A subquery can supply a threshold value computed from the same or a different table, letting you compare each group to a company-wide benchmark.</p>" +
                    "<pre>SELECT department, AVG(salary) AS dept_avg\nFROM employees\nGROUP BY department\nHAVING AVG(salary) > (SELECT AVG(salary) FROM employees);</pre>" +
                    "<p>This finds every department whose average salary beats the overall company average, computed independently inside the subquery.</p>" +
                    "<h3>Aggregating a Joined Result</h3><p>Subqueries are also useful for pre-filtering before an aggregate, such as only counting completed orders.</p>" +
                    "<pre>SELECT customer_id, SUM(total) AS lifetime_value\nFROM (SELECT * FROM orders WHERE status = 'COMPLETED') completed_orders\nGROUP BY customer_id;</pre>",
                    "INTERACTIVE", 22, 22,
                    "SELECT department, AVG(salary) AS dept_avg FROM employees GROUP BY department HAVING AVG(salary) > (SELECT AVG(salary) FROM employees);",
                    "A subquery can provide a dynamic threshold for HAVING to compare against\nSubqueries let you benchmark each group against an overall aggregate\nA subquery can also pre-filter rows before they reach GROUP BY\nThis pattern is common for above/below-average style reports")
            )
        );

        seedCourse(
            "Advanced SQL & Window Functions", "CTEs, window functions, and query optimization techniques.",
            "Write production-grade SQL queries.", DifficultyLevel.ADVANCED, 3, true, 4,
            List.of(
                lesson("Common Table Expressions (CTEs)",
                    "<h2>What Is a CTE?</h2><p>A Common Table Expression, written with a WITH clause, defines a named temporary result set that the rest of the query can reference as if it were a real table, making complex queries far easier to read.</p>" +
                    "<pre>WITH high_earners AS (\n  SELECT * FROM employees WHERE salary > 80000\n)\nSELECT department, COUNT(*) FROM high_earners GROUP BY department;</pre>" +
                    "<h3>Multiple CTEs</h3><p>You can chain several CTEs in one WITH clause, each able to reference the ones defined before it.</p>" +
                    "<pre>WITH dept_totals AS (\n  SELECT department, SUM(salary) AS total FROM employees GROUP BY department\n),\ncompany_total AS (\n  SELECT SUM(total) AS grand_total FROM dept_totals\n)\nSELECT dt.department, dt.total, ct.grand_total\nFROM dept_totals dt, company_total ct;</pre>" +
                    "<h3>Recursive CTEs</h3><p>Adding RECURSIVE lets a CTE reference itself, which is the standard way to traverse hierarchical data such as an org chart or a category tree.</p>",
                    "INTERACTIVE", 20, 25,
                    "WITH high_earners AS (SELECT * FROM employees WHERE salary > 80000) SELECT department, COUNT(*) FROM high_earners GROUP BY department;",
                    "A CTE is a named, temporary result set defined with WITH\nCTEs make multi-step queries far more readable than deeply nested subqueries\nMultiple CTEs can be chained, each referencing the ones before it\nRECURSIVE CTEs can traverse hierarchical data like org charts"),

                lesson("Window Functions",
                    "<h2>What Makes Window Functions Different</h2><p>Unlike GROUP BY, a window function performs a calculation across a set of related rows while keeping every original row in the output, instead of collapsing them into one row per group.</p>" +
                    "<pre>SELECT name, department, salary,\n  ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rank_in_dept\nFROM employees;</pre>" +
                    "<h3>RANK and DENSE_RANK</h3><p>RANK leaves a gap in the numbering after a tie. DENSE_RANK does not.</p>" +
                    "<pre>SELECT name, salary,\n  RANK() OVER (ORDER BY salary DESC) AS salary_rank,\n  DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rank\nFROM employees;</pre>" +
                    "<h3>PARTITION BY</h3><p>PARTITION BY resets the window calculation independently for each group, similar in spirit to GROUP BY, but without merging the underlying rows.</p>",
                    "INTERACTIVE", 25, 25,
                    "SELECT name, department, salary, ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rank_in_dept FROM employees;",
                    "Window functions keep every row while still performing group-style math\nROW_NUMBER assigns a unique sequential number even when values tie\nRANK leaves a gap after ties; DENSE_RANK does not\nPARTITION BY restarts the calculation independently for each group"),

                lesson("Indexes & Query Performance",
                    "<h2>What an Index Does</h2><p>An index is a separate data structure that lets the database jump directly to matching rows instead of scanning the entire table, much like an index at the back of a book.</p>" +
                    "<pre>CREATE INDEX idx_employees_department ON employees(department);</pre>" +
                    "<h3>When Indexes Help</h3><p>Columns used frequently in WHERE, JOIN, or ORDER BY clauses on large tables are the best candidates for indexing.</p>" +
                    "<h3>The Tradeoff</h3><p>Every index speeds up reads but slows down writes, since each INSERT, UPDATE, or DELETE must also update every index on that table. Indexing everything is rarely the right answer.</p>" +
                    "<h3>Reading a Query Plan</h3><p>EXPLAIN ANALYZE shows whether a query used an index scan or a slower sequential scan, which is the most reliable way to confirm an index is actually being used.</p>" +
                    "<pre>EXPLAIN ANALYZE\nSELECT * FROM employees WHERE department = 'Sales';</pre>",
                    "TEXT", 18, 20,
                    "CREATE INDEX idx_employees_department ON employees(department);\n---\nEXPLAIN ANALYZE SELECT * FROM employees WHERE department = 'Sales';",
                    "An index lets the database jump to matching rows instead of scanning everything\nIndex columns frequently used in WHERE, JOIN, and ORDER BY\nEvery index speeds up reads but slows down writes\nEXPLAIN ANALYZE confirms whether a query plan is actually using an index"),

                lesson("Query Optimization Patterns",
                    "<h2>Common Anti-Patterns</h2><p>Most slow queries fall into a handful of repeatable categories, each with a well-known fix.</p>" +
                    "<h3>SELECT * on Wide Tables</h3><p>Naming only the columns you need avoids reading unnecessary data and can allow an index-only scan.</p>" +
                    "<pre>-- Avoid\nSELECT * FROM orders;\n-- Prefer\nSELECT order_id, status FROM orders;</pre>" +
                    "<h3>Functions Wrapped Around Indexed Columns</h3><p>Wrapping an indexed column in a function, such as YEAR(order_date), usually prevents the database from using a standard index on that column.</p>" +
                    "<pre>-- Avoid\nWHERE YEAR(order_date) = 2026\n-- Prefer\nWHERE order_date >= '2026-01-01' AND order_date &lt; '2027-01-01'</pre>" +
                    "<h3>The N+1 Query Problem</h3><p>Looping over rows in application code and issuing one query per row is far slower than fetching everything in a single JOIN.</p>",
                    "TEXT", 20, 20,
                    "SELECT order_id, status FROM orders WHERE order_date >= '2026-01-01' AND order_date < '2027-01-01';",
                    "Select only the columns you need instead of using SELECT *\nAvoid wrapping indexed columns in functions inside WHERE\nFix the N plus one query problem by combining queries with a JOIN\nAlways confirm an optimization worked with EXPLAIN ANALYZE, not guesswork")
            )
        );

        log.info("Seeding complete");
    }

    /**
     * Realigns a Postgres sequence with the table's actual max id. Without this, rows inserted
     * with an explicit id (e.g. a manual SQL import of curated course content) leave the sequence
     * behind, so the next JPA-generated insert collides with an existing id and fails with a
     * duplicate-key violation.
     */
    private void resyncSequence(String sequenceName, String tableName) {
        try {
            entityManager.createNativeQuery(
                "SELECT setval('" + sequenceName + "', COALESCE((SELECT MAX(id) FROM " + tableName + "), 0) + 1, false)"
            ).getSingleResult();
        } catch (Exception ex) {
            log.warn("Could not resync sequence {} for table {}: {}", sequenceName, tableName, ex.getMessage());
        }
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

    private Lesson lesson(String title, String content, String type, int durationMinutes, int xpReward,
                           String sqlExamples, String keyPoints) {
        return Lesson.builder()
            .title(title)
            .content(content)
            .lessonType(type)
            .durationMinutes(durationMinutes)
            .xpReward(xpReward)
            .sqlExamples(sqlExamples)
            .keyPoints(keyPoints)
            .build();
    }
}
