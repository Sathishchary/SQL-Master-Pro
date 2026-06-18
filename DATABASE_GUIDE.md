# SQL Master Pro — Database Guide (Beginner-Friendly)

A plain-English walkthrough of the `database/` SQL files, for whenever you need a refresher. Pairs with [BACKEND_GUIDE.md](BACKEND_GUIDE.md) and [FRONTEND_GUIDE.md](FRONTEND_GUIDE.md).

## The 3 files and what each one is for

| File | Purpose | Run when? |
|---|---|---|
| [schema.sql](database/schema.sql) | Creates all tables, sequences, and relationships for the **app itself** (users, courses, lessons, quizzes, etc.) | Once, when setting up a fresh database |
| [seed-data.sql](database/seed-data.sql) | Fills those app tables with **sample content** (10 courses, lessons, quizzes, questions, challenges, blog posts) | After `schema.sql`, to have content to look at instead of an empty app |
| [playground-schemas.sql](database/playground-schemas.sql) | Creates 7 separate **practice sandbox databases** (`employee_db`, `ecommerce_db`, `hospital_db`, `banking_db`, `school_db`, `inventory_db`, `movies_db`) used by the **SQL Playground** feature, where users write and run their own SQL | After `schema.sql`, to populate the Playground |

Important distinction: `schema.sql` + `seed-data.sql` power the **app's own content** (the courses you browse, quizzes you take). `playground-schemas.sql` powers **practice data the user queries against** inside the SQL Playground — totally separate purpose, separate schemas, separate tables.

## `schema.sql` — the app's own structure

This file defines the tables that make the platform function. A few core ideas:

**Sequences** generate unique IDs:
```sql
CREATE SEQUENCE IF NOT EXISTS courses_seq START 1 INCREMENT 50;
```
Each new row's `id` is pulled from this counter. `INCREMENT 50` (rather than 1) is a Hibernate convention that lets the backend safely "reserve" a batch of 50 IDs in memory before touching the database again — an optimization, not something you need to manage by hand.

**Tables** look like this:
```sql
CREATE TABLE IF NOT EXISTS courses (
    id                 BIGINT DEFAULT nextval('courses_seq') PRIMARY KEY,
    title              VARCHAR(200) NOT NULL,
    difficulty         VARCHAR(20) DEFAULT 'BEGINNER',
    premium            BOOLEAN DEFAULT FALSE,
    published          BOOLEAN DEFAULT TRUE,
    ...
);
```
- `PRIMARY KEY` — the column that uniquely identifies each row.
- `DEFAULT nextval('courses_seq')` — when you don't specify an `id`, grab the next number from the sequence automatically.
- `NOT NULL` — this column must always have a value, or the insert fails.
- `VARCHAR(200)` — text, max 200 characters.

**Relationships** are created with `REFERENCES`:
```sql
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);
```
This is a **join table** — since one user can have many roles and one role can belong to many users (a "many-to-many" relationship), you can't just put a `role_id` column directly on `users`. Instead, `user_roles` stores pairs of (`user_id`, `role_id`). `ON DELETE CASCADE` means: if a user is deleted, automatically delete their rows here too (no orphaned references left behind).

> **Note on drift:** `schema.sql` still defines `premium`/`published` columns, but the live database (and the Java code) actually use `is_premium`/`is_published` (added later by Hibernate's auto-update feature). This file is slightly out of sync with reality — useful as a rough map, but if you need the *exact* current structure, check the entity files in `backend/src/main/java/com/sqlmasterpro/model/entity/` or query the live DB directly with `\d courses` in `psql`.

## `seed-data.sql` — sample content for the app

This inserts realistic rows into the tables `schema.sql` created — e.g. 10 courses, their lessons, 5 quizzes with questions, 10 coding challenges, 5 blog posts.

The interesting pattern used throughout is **idempotent, name-based seeding** — meaning you can run this file multiple times safely without creating duplicates or crashing on foreign-key errors. Example (simplified):

```sql
INSERT INTO lessons (title, content, course_id, is_published, is_premium, ...)
SELECT v.title, v.content, c.id, TRUE, FALSE
FROM (VALUES
  ('Your First SELECT Statement', 'Learn to query...'),
  ('Filtering with WHERE', 'Filter rows...')
) AS v(title, content)
CROSS JOIN (SELECT id FROM courses WHERE title = 'Introduction to SQL') c
WHERE NOT EXISTS (
  SELECT 1 FROM lessons l WHERE l.title = v.title
);
```

Why this matters, broken down:
- `(VALUES (...), (...)) AS v(title, content)` — define a temporary list of rows inline, like a mini-table, instead of writing 10 separate `INSERT` statements.
- `CROSS JOIN (SELECT id FROM courses WHERE title = '...')` — instead of hardcoding `course_id = 1` (which breaks if that course doesn't actually have ID 1), **look up the real ID by title**. This makes the script resilient to however many rows already exist.
- `WHERE NOT EXISTS (...)` — before inserting, check "does a lesson with this exact title already exist?" If yes, skip it. This is what makes re-running the script safe (no duplicate lessons pile up).
- Some tables (like `courses` and `challenges`) also have an actual database-level safety net: `ALTER TABLE courses ADD CONSTRAINT courses_title_key UNIQUE (title);` — this makes the database itself reject a duplicate title, so even `ON CONFLICT DO NOTHING` clauses elsewhere in the file work correctly.

## `playground-schemas.sql` — the practice sandboxes

This is a completely different purpose: 7 **mini realistic databases** for users to practice writing SQL against in the in-browser SQL Playground (e.g. "write a query to find the top 5 highest-paid employees").

Each sandbox gets its own **PostgreSQL schema** (a namespace, like a folder for tables):
```sql
CREATE SCHEMA IF NOT EXISTS employee_db;

CREATE TABLE IF NOT EXISTS employee_db.departments (
    id              SERIAL PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL,
    location        VARCHAR(100),
    budget          NUMERIC(15,2)
);

CREATE TABLE IF NOT EXISTS employee_db.employees (
    id              SERIAL PRIMARY KEY,
    department_id   INT REFERENCES employee_db.departments(id),
    manager_id      INT REFERENCES employee_db.employees(id),  -- references itself!
    ...
);
```
- `employee_db.departments` — the schema name (`employee_db`) comes before the table name, separating these sandbox tables from the app's own tables (`courses`, `users`, etc.) even though they all live in the same `SQLMasterPro` database.
- `SERIAL` is a shorthand for "auto-incrementing integer" — simpler than the manual sequence pattern used in `schema.sql`, fine for sandbox data that doesn't need Hibernate's specific ID strategy.
- `manager_id INT REFERENCES employee_db.employees(id)` — a **self-referencing foreign key**: an employee's manager is just another row in the same `employees` table. This is exactly the kind of relationship the "Self Joins" lesson in the course content teaches users to query.

The backend exposes the list of available sandboxes via `GET /api/sql/databases` (see `SqlPlaygroundController.java`), and the user's typed SQL is executed directly against whichever schema they pick.

> **Caution:** Several Playground tables (`departments`, `patients`, `movies`, etc.) have no `UNIQUE` constraint on their natural data, so re-running this file blindly can duplicate rows. If you ever need to re-seed it, `TRUNCATE` the relevant tables with `RESTART IDENTITY CASCADE` first, then run the file once.

## How it all fits together with the rest of the app

```
schema.sql          →  creates tables for: users, courses, lessons, quizzes, questions,
                        challenges, blogs, certificates, payments, etc.
        ↓
seed-data.sql        →  fills those tables with sample course content
        ↓
(app runs)            →  Spring Boot's DataSeeder.java also auto-seeds 4 starter
                          courses on first run if the courses table is empty
                          (see BACKEND_GUIDE.md)

playground-schemas.sql →  separately creates + fills 7 sandbox schemas
                           used only by the "SQL Playground" feature
```

## Quick reference — connecting manually

```bash
psql -U postgres -d SQLMasterPro -h localhost -p 5432
# password: root
```
Useful psql commands once connected:
- `\dt` — list tables in the current schema
- `\dn` — list all schemas (you should see `public`, `employee_db`, `ecommerce_db`, etc.)
- `\d courses` — show the exact current structure of the `courses` table
- `SET search_path TO employee_db;` then `\dt` — list tables inside a specific Playground schema

## One-sentence summary

`schema.sql` builds the skeleton (tables + relationships), `seed-data.sql` puts sample course content into that skeleton using safe lookup-by-name inserts so it can be re-run without duplicating data, and `playground-schemas.sql` builds and fills 7 unrelated mini-databases that exist purely so users have something realistic to practice writing SQL against.
