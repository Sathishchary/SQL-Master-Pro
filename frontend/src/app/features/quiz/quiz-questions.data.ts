import { Question, Quiz } from '../../core/models/models';

// ─── Static Quiz Metadata ────────────────────────────────────────────────────

export const STATIC_QUIZ_META: Record<number, Quiz> = {
  1:  { id: 1,  title: 'SQL Basics: SELECT & WHERE',        description: 'Master SELECT statements, WHERE clauses, LIKE, IN, BETWEEN, and NULL handling', difficulty: 'BEGINNER',     timeLimitMinutes: 15, passScore: 70, published: true, premium: false, randomizeQuestions: true },
  2:  { id: 2,  title: 'Sorting & Limiting Results',         description: 'ORDER BY, LIMIT, OFFSET — control exactly what rows you return and in what order', difficulty: 'BEGINNER',     timeLimitMinutes: 12, passScore: 70, published: true, premium: false, randomizeQuestions: true },
  3:  { id: 3,  title: 'String & Date Functions',            description: 'CONCAT, SUBSTRING, LENGTH, TRIM, DATE_PART, NOW, EXTRACT and 20+ built-in functions', difficulty: 'BEGINNER',     timeLimitMinutes: 20, passScore: 70, published: true, premium: false, randomizeQuestions: true },
  4:  { id: 4,  title: 'SQL Joins Mastery',                  description: 'INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN — all join types with real datasets', difficulty: 'INTERMEDIATE', timeLimitMinutes: 30, passScore: 75, published: true, premium: false, randomizeQuestions: true },
  5:  { id: 5,  title: 'Aggregates & GROUP BY',              description: 'COUNT, SUM, AVG, MIN, MAX with GROUP BY and HAVING clause deep dive', difficulty: 'INTERMEDIATE', timeLimitMinutes: 25, passScore: 70, published: true, premium: false, randomizeQuestions: true },
  6:  { id: 6,  title: 'Subqueries & Correlated Queries',    description: 'Scalar subqueries, IN/EXISTS/ANY/ALL, correlated subqueries in WHERE and SELECT', difficulty: 'INTERMEDIATE', timeLimitMinutes: 35, passScore: 75, published: true, premium: false, randomizeQuestions: true },
  7:  { id: 7,  title: 'UNION, INTERSECT & EXCEPT',          description: 'Set operations — combine, intersect, or subtract result sets with proper column matching', difficulty: 'INTERMEDIATE', timeLimitMinutes: 20, passScore: 70, published: true, premium: false, randomizeQuestions: true },
  8:  { id: 8,  title: 'CASE WHEN & Conditional Logic',      description: 'Inline IF/ELSE using CASE expressions, COALESCE, NULLIF and conditional aggregates', difficulty: 'INTERMEDIATE', timeLimitMinutes: 22, passScore: 70, published: true, premium: false, randomizeQuestions: true },
  9:  { id: 9,  title: 'Window Functions Fundamentals',       description: 'OVER(), PARTITION BY, ORDER BY inside windows — ROW_NUMBER, RANK, DENSE_RANK', difficulty: 'ADVANCED',     timeLimitMinutes: 40, passScore: 78, published: true, premium: true,  randomizeQuestions: true },
  10: { id: 10, title: 'LAG, LEAD & Running Totals',         description: 'Access previous/next rows with LAG/LEAD; compute running sums and moving averages', difficulty: 'ADVANCED',     timeLimitMinutes: 45, passScore: 78, published: true, premium: true,  randomizeQuestions: true },
  11: { id: 11, title: 'CTEs & Recursive Queries',           description: 'WITH clause, multiple CTEs, recursive CTEs for hierarchies and graph traversal', difficulty: 'ADVANCED',     timeLimitMinutes: 50, passScore: 80, published: true, premium: true,  randomizeQuestions: true },
  12: { id: 12, title: 'Indexing & Performance Tuning',      description: 'B-tree vs hash indexes, covering indexes, EXPLAIN ANALYZE output interpretation', difficulty: 'ADVANCED',     timeLimitMinutes: 45, passScore: 80, published: true, premium: true,  randomizeQuestions: true },
  13: { id: 13, title: 'Transactions & ACID Properties',     description: 'BEGIN/COMMIT/ROLLBACK, isolation levels, deadlocks, and savepoints', difficulty: 'ADVANCED',     timeLimitMinutes: 40, passScore: 78, published: true, premium: true,  randomizeQuestions: true },
  14: { id: 14, title: 'Database Design & Normalization',    description: '1NF/2NF/3NF/BCNF normal forms, primary keys, foreign keys, ERD reading', difficulty: 'ADVANCED',     timeLimitMinutes: 50, passScore: 80, published: true, premium: true,  randomizeQuestions: true },
  15: { id: 15, title: 'Expert SQL: Full Interview Drill',   description: '60-question timed drill covering all SQL topics — used in FAANG SQL interviews', difficulty: 'EXPERT',       timeLimitMinutes: 90, passScore: 85, published: true, premium: true,  randomizeQuestions: true },
};

// ─── BEGINNER Questions (used for quiz IDs 1, 2, 3) ─────────────────────────

const BEGINNER_QUESTIONS: Question[] = [
  {
    id: 101, questionText: 'Which SQL statement is used to retrieve data from a database?',
    questionType: 'MCQ', difficulty: 'BEGINNER', points: 1, topic: 'SELECT',
    optionA: 'INSERT', optionB: 'SELECT', optionC: 'UPDATE', optionD: 'DELETE',
    correctAnswer: 'B',
    explanation: 'SELECT is the SQL statement used to retrieve/query data from one or more tables.',
    hint: 'Think about which word means "pick" or "choose".'
  },
  {
    id: 102, questionText: 'Which clause is used to filter rows returned by a SELECT statement?',
    questionType: 'MCQ', difficulty: 'BEGINNER', points: 1, topic: 'WHERE',
    optionA: 'HAVING', optionB: 'ORDER BY', optionC: 'WHERE', optionD: 'GROUP BY',
    correctAnswer: 'C',
    explanation: 'WHERE filters individual rows before any grouping occurs.',
    hint: 'This clause comes right after FROM in a basic query.'
  },
  {
    id: 103, questionText: "What does the wildcard % represent in a LIKE pattern?",
    questionType: 'MCQ', difficulty: 'BEGINNER', points: 1, topic: 'LIKE',
    optionA: 'Exactly one character', optionB: 'Any single digit', optionC: 'Zero or more characters', optionD: 'One or more characters',
    correctAnswer: 'C',
    explanation: '% matches zero or more characters. _ matches exactly one character.',
    hint: 'Think of it as a wildcard that can expand to nothing or many characters.'
  },
  {
    id: 104, questionText: "Which operator should you use to check if a column value is NULL?",
    questionType: 'MCQ', difficulty: 'BEGINNER', points: 1, topic: 'NULL',
    optionA: '= NULL', optionB: 'IS NULL', optionC: '== NULL', optionD: 'EQUALS NULL',
    correctAnswer: 'B',
    explanation: 'NULL cannot be compared with = because NULL ≠ NULL. Use IS NULL or IS NOT NULL.',
    hint: 'You cannot use equals (=) with NULL values.'
  },
  {
    id: 105, questionText: 'What does SELECT DISTINCT do?',
    questionType: 'MCQ', difficulty: 'BEGINNER', points: 1, topic: 'DISTINCT',
    optionA: 'Sorts the result set', optionB: 'Removes duplicate rows from the result', optionC: 'Counts unique values', optionD: 'Filters NULL values',
    correctAnswer: 'B',
    explanation: 'DISTINCT eliminates duplicate rows so each unique combination appears only once.',
    hint: 'Think about what "distinct" means in plain English.'
  },
  {
    id: 106, questionText: 'The BETWEEN operator in SQL is inclusive of the boundary values.',
    questionType: 'TRUE_FALSE', difficulty: 'BEGINNER', points: 1, topic: 'BETWEEN',
    correctAnswer: 'TRUE',
    explanation: 'BETWEEN a AND b includes both a and b (equivalent to >= a AND <= b).',
    hint: 'Consider whether BETWEEN 1 AND 5 includes the numbers 1 and 5.'
  },
  {
    id: 107, questionText: 'Which of the following correctly uses the IN operator?',
    questionType: 'MCQ', difficulty: 'BEGINNER', points: 1, topic: 'IN',
    optionA: "WHERE dept IN 'HR', 'IT'", optionB: "WHERE dept IN ['HR','IT']", optionC: "WHERE dept IN ('HR','IT')", optionD: "WHERE dept = IN ('HR','IT')",
    correctAnswer: 'C',
    explanation: 'IN requires parentheses around the list of values.',
    hint: 'Values in the list must be enclosed in parentheses, not brackets.'
  },
  {
    id: 108, questionText: 'What is the correct order of clauses in a basic SELECT statement?',
    questionType: 'MCQ', difficulty: 'BEGINNER', points: 1, topic: 'Syntax',
    optionA: 'SELECT → WHERE → FROM', optionB: 'FROM → SELECT → WHERE', optionC: 'SELECT → FROM → WHERE', optionD: 'WHERE → FROM → SELECT',
    correctAnswer: 'C',
    explanation: 'Standard SQL clause order: SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT.',
    hint: 'You first state what you want, then from where, then the filter.'
  },
  {
    id: 109, questionText: "Which keyword is used to give a column or table a temporary alias?",
    questionType: 'MCQ', difficulty: 'BEGINNER', points: 1, topic: 'Alias',
    optionA: 'AS', optionB: 'ALIAS', optionC: 'NAME', optionD: 'RENAME',
    correctAnswer: 'A',
    explanation: 'AS is used to assign an alias: SELECT first_name AS name FROM users.',
    hint: 'It is a two-letter keyword used to rename a column in the output.'
  },
  {
    id: 110, questionText: 'What does SELECT * FROM employees return?',
    questionType: 'MCQ', difficulty: 'BEGINNER', points: 1, topic: 'SELECT',
    optionA: 'Only the first row', optionB: 'Only the column names', optionC: 'All columns and all rows from the employees table', optionD: 'The count of rows in employees',
    correctAnswer: 'C',
    explanation: '* is a wildcard that selects all columns. Without WHERE, all rows are returned.',
    hint: '* means "everything" in SQL column selection.'
  },
];

// ─── INTERMEDIATE Questions (used for quiz IDs 4, 5, 6, 7, 8) ───────────────

const INTERMEDIATE_QUESTIONS: Question[] = [
  {
    id: 201, questionText: 'What does an INNER JOIN return?',
    questionType: 'MCQ', difficulty: 'INTERMEDIATE', points: 2, topic: 'JOINs',
    optionA: 'All rows from both tables', optionB: 'Only rows where the join condition matches in BOTH tables', optionC: 'All rows from the left table', optionD: 'Rows that do NOT match',
    correctAnswer: 'B',
    explanation: 'INNER JOIN returns only the rows where the ON condition is true in both tables.',
    hint: 'Think of the intersection of two sets.'
  },
  {
    id: 202, questionText: 'What does a LEFT JOIN return when there is no matching row in the right table?',
    questionType: 'MCQ', difficulty: 'INTERMEDIATE', points: 2, topic: 'JOINs',
    optionA: 'The row is excluded', optionB: 'An error is thrown', optionC: 'NULL for all right-table columns', optionD: 'Zero for numeric columns',
    correctAnswer: 'C',
    explanation: 'LEFT JOIN keeps all left-table rows. Unmatched right-table columns become NULL.',
    hint: 'The left side is always preserved, missing values fill with NULL.'
  },
  {
    id: 203, questionText: 'Which aggregate function returns the number of rows (including NULLs) in a table?',
    questionType: 'MCQ', difficulty: 'INTERMEDIATE', points: 2, topic: 'Aggregates',
    optionA: 'COUNT(column)', optionB: 'COUNT(*)', optionC: 'SUM(*)', optionD: 'TOTAL()',
    correctAnswer: 'B',
    explanation: 'COUNT(*) counts all rows including NULLs. COUNT(column) counts non-NULL values.',
    hint: 'The asterisk version counts everything without filtering NULLs.'
  },
  {
    id: 204, questionText: 'Which clause filters groups after GROUP BY has been applied?',
    questionType: 'MCQ', difficulty: 'INTERMEDIATE', points: 2, topic: 'GROUP BY',
    optionA: 'WHERE', optionB: 'FILTER', optionC: 'HAVING', optionD: 'QUALIFY',
    correctAnswer: 'C',
    explanation: 'HAVING filters groups after aggregation. WHERE filters individual rows before grouping.',
    hint: 'This clause works like WHERE but operates on aggregated results.'
  },
  {
    id: 205, questionText: 'A subquery in a WHERE clause that references the outer query is called a ______.',
    questionType: 'MCQ', difficulty: 'INTERMEDIATE', points: 2, topic: 'Subqueries',
    optionA: 'Scalar subquery', optionB: 'Inline view', optionC: 'Correlated subquery', optionD: 'Derived table',
    correctAnswer: 'C',
    explanation: 'A correlated subquery references columns from the outer query, so it executes once per outer row.',
    hint: 'The inner query "correlates" with (depends on) the outer query.'
  },
  {
    id: 206, questionText: 'What is the difference between UNION and UNION ALL?',
    questionType: 'MCQ', difficulty: 'INTERMEDIATE', points: 2, topic: 'Set Operations',
    optionA: 'UNION ALL removes duplicates; UNION keeps them', optionB: 'UNION removes duplicates; UNION ALL keeps all rows including duplicates', optionC: 'They are identical', optionD: 'UNION ALL only works on numbers',
    correctAnswer: 'B',
    explanation: 'UNION deduplicates the result. UNION ALL is faster as it skips the deduplication step.',
    hint: 'The "ALL" keyword means "keep everything, even duplicates".'
  },
  {
    id: 207, questionText: 'Which CASE expression syntax is correct?',
    questionType: 'MCQ', difficulty: 'INTERMEDIATE', points: 2, topic: 'CASE',
    optionA: 'CASE WHEN score > 90 THEN "A" ELSE "B" END', optionB: "CASE WHEN score > 90 THEN 'A' ELSE 'B' END", optionC: "IF score > 90 THEN 'A' ELSE 'B'", optionD: "SWITCH score WHEN > 90 THEN 'A'",
    correctAnswer: 'B',
    explanation: 'CASE expressions use single quotes for string literals and must end with END.',
    hint: 'SQL uses single quotes for strings, not double quotes.'
  },
  {
    id: 208, questionText: 'The EXISTS operator returns TRUE if the subquery returns ______.',
    questionType: 'MCQ', difficulty: 'INTERMEDIATE', points: 2, topic: 'Subqueries',
    optionA: 'Exactly one row', optionB: 'At least one row', optionC: 'No rows', optionD: 'A non-NULL value',
    correctAnswer: 'B',
    explanation: 'EXISTS is TRUE as long as the subquery produces one or more rows, regardless of content.',
    hint: 'Think of it as checking if "something exists" in the subquery result.'
  },
  {
    id: 209, questionText: 'CROSS JOIN produces a ______ between two tables.',
    questionType: 'MCQ', difficulty: 'INTERMEDIATE', points: 2, topic: 'JOINs',
    optionA: 'Natural join', optionB: 'Cartesian product', optionC: 'Left outer join', optionD: 'Self join',
    correctAnswer: 'B',
    explanation: 'CROSS JOIN returns every combination of rows: n × m rows for tables of size n and m.',
    hint: 'Every row from table A is paired with every row from table B.'
  },
  {
    id: 210, questionText: 'COALESCE(NULL, NULL, 3, 4) returns ______.',
    questionType: 'MCQ', difficulty: 'INTERMEDIATE', points: 2, topic: 'NULL Handling',
    optionA: 'NULL', optionB: '4', optionC: '3', optionD: '7',
    correctAnswer: 'C',
    explanation: 'COALESCE returns the first non-NULL value in the list. Here the first non-NULL is 3.',
    hint: 'COALESCE scans left to right and stops at the first non-NULL.'
  },
];

// ─── ADVANCED Questions (used for quiz IDs 9–15) ────────────────────────────

const ADVANCED_QUESTIONS: Question[] = [
  {
    id: 301, questionText: 'What does the OVER() clause in a window function define?',
    questionType: 'MCQ', difficulty: 'ADVANCED', points: 3, topic: 'Window Functions',
    optionA: 'The condition for WHERE filtering', optionB: 'The window (set of rows) the function operates on', optionC: 'The sort order of the final result', optionD: 'An alias for the function',
    correctAnswer: 'B',
    explanation: 'OVER() defines the window — the set of rows each function invocation can see. Without PARTITION BY, the window is the entire result set.',
    hint: 'Think of a "window" as a sliding frame of rows the function looks through.'
  },
  {
    id: 302, questionText: 'What is the difference between RANK() and DENSE_RANK()?',
    questionType: 'MCQ', difficulty: 'ADVANCED', points: 3, topic: 'Window Functions',
    optionA: 'No difference — they are aliases', optionB: 'RANK() leaves gaps after ties; DENSE_RANK() does not', optionC: 'DENSE_RANK() leaves gaps; RANK() does not', optionD: 'RANK() is only available in PostgreSQL',
    correctAnswer: 'B',
    explanation: 'If two rows tie at rank 1, RANK() gives next row rank 3. DENSE_RANK() gives rank 2.',
    hint: 'Dense means "no gaps" — ranks are always consecutive.'
  },
  {
    id: 303, questionText: 'What does a Common Table Expression (CTE) improve?',
    questionType: 'MCQ', difficulty: 'ADVANCED', points: 3, topic: 'CTEs',
    optionA: 'Only query performance', optionB: 'Readability and reusability of complex queries', optionC: 'Table indexing', optionD: 'Transaction handling',
    correctAnswer: 'B',
    explanation: 'CTEs (WITH clause) improve readability by naming subquery logic. They can also be referenced multiple times within a query.',
    hint: 'CTE stands for Common Table Expression — they make queries easier to read.'
  },
  {
    id: 304, questionText: 'LAG(salary, 1) OVER (ORDER BY hire_date) returns ______.',
    questionType: 'MCQ', difficulty: 'ADVANCED', points: 3, topic: 'Window Functions',
    optionA: 'The next row\'s salary', optionB: 'The salary from 1 row ahead in the order', optionC: 'The salary from the previous row in the ordering', optionD: 'The average of surrounding salaries',
    correctAnswer: 'C',
    explanation: 'LAG(expr, n) looks n rows BEHIND (earlier in the ORDER BY). LEAD() looks ahead.',
    hint: 'LAG = look back (lag behind). LEAD = look forward.'
  },
  {
    id: 305, questionText: 'Which index type is most commonly used in PostgreSQL by default?',
    questionType: 'MCQ', difficulty: 'ADVANCED', points: 3, topic: 'Indexing',
    optionA: 'Hash index', optionB: 'GIN index', optionC: 'B-tree index', optionD: 'BRIN index',
    correctAnswer: 'C',
    explanation: 'B-tree is PostgreSQL\'s default index type. It supports equality, range, and ordering queries efficiently.',
    hint: 'B-tree is the "default" — no need to specify it when creating a plain index.'
  },
  {
    id: 306, questionText: 'What does PARTITION BY do inside a window function?',
    questionType: 'MCQ', difficulty: 'ADVANCED', points: 3, topic: 'Window Functions',
    optionA: 'Splits the physical table into partitions', optionB: 'Divides the result set into groups; the window function restarts for each group', optionC: 'Limits the result to one row per partition', optionD: 'Works the same as GROUP BY',
    correctAnswer: 'B',
    explanation: 'PARTITION BY groups rows into logical windows. The function resets for each partition without collapsing rows.',
    hint: 'Unlike GROUP BY, PARTITION BY does NOT reduce row count.'
  },
  {
    id: 307, questionText: 'In ACID properties, what does "I" (Isolation) guarantee?',
    questionType: 'MCQ', difficulty: 'ADVANCED', points: 3, topic: 'Transactions',
    optionA: 'Data is never lost once committed', optionB: 'Concurrent transactions do not interfere with each other', optionC: 'All operations succeed or all fail', optionD: 'The database remains in a valid state',
    correctAnswer: 'B',
    explanation: 'Isolation ensures concurrent transactions execute as if they were serial, preventing dirty reads, non-repeatable reads, and phantom reads.',
    hint: 'Isolation = transactions are "isolated" from each other.'
  },
  {
    id: 308, questionText: 'Third Normal Form (3NF) requires that all non-key attributes depend only on ______.',
    questionType: 'MCQ', difficulty: 'ADVANCED', points: 3, topic: 'Normalization',
    optionA: 'Any column in the table', optionB: 'The primary key (no transitive dependency)', optionC: 'A foreign key', optionD: 'All composite keys',
    correctAnswer: 'B',
    explanation: '3NF eliminates transitive dependencies: non-key columns must depend on the primary key, not on other non-key columns.',
    hint: 'If A → B → C, remove the transitive dependency by splitting the table.'
  },
  {
    id: 309, questionText: 'A recursive CTE must include which two parts?',
    questionType: 'MCQ', difficulty: 'ADVANCED', points: 3, topic: 'CTEs',
    optionA: 'An ORDER BY and a LIMIT', optionB: 'An anchor member and a recursive member joined with UNION ALL', optionC: 'A WHERE clause and a HAVING clause', optionD: 'Two separate CTEs',
    correctAnswer: 'B',
    explanation: 'Recursive CTEs have an anchor member (base case) and a recursive member that references the CTE itself, combined with UNION ALL.',
    hint: 'Think of it like a loop: you need a starting point (anchor) and a repeating step (recursive).'
  },
  {
    id: 310, questionText: 'What does NTILE(4) OVER (ORDER BY score) do?',
    questionType: 'MCQ', difficulty: 'ADVANCED', points: 3, topic: 'Window Functions',
    optionA: 'Returns the 4th row', optionB: 'Divides rows into 4 equal buckets and assigns each row a bucket number 1–4', optionC: 'Ranks rows from 1 to 4', optionD: 'Returns the top 4 rows',
    correctAnswer: 'B',
    explanation: 'NTILE(n) distributes rows into n roughly equal buckets ordered by the window ORDER BY.',
    hint: 'NTILE is like a quartile function — it splits data into n equal-ish groups.'
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getStaticQuestions(quizId: number): Question[] {
  const meta = STATIC_QUIZ_META[quizId];
  if (!meta) return BEGINNER_QUESTIONS;
  switch (meta.difficulty) {
    case 'BEGINNER': return BEGINNER_QUESTIONS;
    case 'INTERMEDIATE': return INTERMEDIATE_QUESTIONS;
    case 'ADVANCED':
    case 'EXPERT': return ADVANCED_QUESTIONS;
    default: return BEGINNER_QUESTIONS;
  }
}

export function getStaticQuiz(quizId: number): Quiz {
  return STATIC_QUIZ_META[quizId] ?? STATIC_QUIZ_META[1];
}
