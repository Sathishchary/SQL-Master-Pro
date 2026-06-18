-- ============================================================
-- SQL Master Pro - PostgreSQL Schema
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── SEQUENCES ───────────────────────────────────────────────
CREATE SEQUENCE IF NOT EXISTS users_seq START 1 INCREMENT 50;
CREATE SEQUENCE IF NOT EXISTS courses_seq START 1 INCREMENT 50;
CREATE SEQUENCE IF NOT EXISTS lessons_seq START 1 INCREMENT 50;
CREATE SEQUENCE IF NOT EXISTS quizzes_seq START 1 INCREMENT 50;
CREATE SEQUENCE IF NOT EXISTS questions_seq START 1 INCREMENT 50;
CREATE SEQUENCE IF NOT EXISTS challenges_seq START 1 INCREMENT 50;
CREATE SEQUENCE IF NOT EXISTS certificates_seq START 1 INCREMENT 50;
CREATE SEQUENCE IF NOT EXISTS payments_seq START 1 INCREMENT 50;
CREATE SEQUENCE IF NOT EXISTS blogs_seq START 1 INCREMENT 50;
CREATE SEQUENCE IF NOT EXISTS sql_executions_seq START 1 INCREMENT 50;
CREATE SEQUENCE IF NOT EXISTS user_progress_seq START 1 INCREMENT 50;
CREATE SEQUENCE IF NOT EXISTS quiz_attempts_seq START 1 INCREMENT 50;
CREATE SEQUENCE IF NOT EXISTS challenge_submissions_seq START 1 INCREMENT 50;
CREATE SEQUENCE IF NOT EXISTS roles_seq START 1 INCREMENT 50;

-- ─── ROLES ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS roles (
    id          BIGINT DEFAULT nextval('roles_seq') PRIMARY KEY,
    name        VARCHAR(50)  NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at  TIMESTAMP DEFAULT NOW()
);

-- ─── USERS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id                         BIGINT DEFAULT nextval('users_seq') PRIMARY KEY,
    username                   VARCHAR(50)  NOT NULL UNIQUE,
    email                      VARCHAR(100) NOT NULL UNIQUE,
    password                   VARCHAR(255),
    first_name                 VARCHAR(50),
    last_name                  VARCHAR(50),
    profile_picture            VARCHAR(500),
    bio                        TEXT,
    phone                      VARCHAR(20),
    email_verified             BOOLEAN DEFAULT FALSE,
    active                     BOOLEAN DEFAULT TRUE,
    auth_provider              VARCHAR(20) DEFAULT 'LOCAL',
    provider_id                VARCHAR(255),
    subscription_plan          VARCHAR(20) DEFAULT 'FREE',
    subscription_expiry        TIMESTAMP,
    email_verification_token   VARCHAR(255),
    password_reset_token       VARCHAR(255),
    password_reset_expiry      TIMESTAMP,
    learning_streak            INTEGER DEFAULT 0,
    last_active                DATE,
    total_xp                   INTEGER DEFAULT 0,
    created_at                 TIMESTAMP DEFAULT NOW(),
    updated_at                 TIMESTAMP DEFAULT NOW()
);

-- ─── USER ROLES (join table) ─────────────────────────────────
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- ─── COURSES ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS courses (
    id                 BIGINT DEFAULT nextval('courses_seq') PRIMARY KEY,
    title              VARCHAR(200) NOT NULL,
    description        TEXT,
    short_description  VARCHAR(500),
    thumbnail_url      VARCHAR(500),
    difficulty         VARCHAR(20) DEFAULT 'BEGINNER',
    order_index        INTEGER DEFAULT 0,
    premium            BOOLEAN DEFAULT FALSE,
    published          BOOLEAN DEFAULT TRUE,
    total_lessons      INTEGER DEFAULT 0,
    estimated_hours    DECIMAL(4,1) DEFAULT 0,
    icon_class         VARCHAR(50) DEFAULT 'school',
    color_code         VARCHAR(20) DEFAULT '#667eea',
    instructor_id      BIGINT REFERENCES users(id),
    created_at         TIMESTAMP DEFAULT NOW(),
    updated_at         TIMESTAMP DEFAULT NOW()
);

-- ─── LESSONS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lessons (
    id               BIGINT DEFAULT nextval('lessons_seq') PRIMARY KEY,
    title            VARCHAR(200) NOT NULL,
    content          TEXT,
    video_url        VARCHAR(500),
    order_index      INTEGER DEFAULT 0,
    duration_minutes INTEGER DEFAULT 5,
    premium          BOOLEAN DEFAULT FALSE,
    published        BOOLEAN DEFAULT TRUE,
    lesson_type      VARCHAR(20) DEFAULT 'TEXT',
    sql_examples     TEXT,
    key_points       TEXT,
    xp_reward        INTEGER DEFAULT 10,
    course_id        BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    created_at       TIMESTAMP DEFAULT NOW(),
    updated_at       TIMESTAMP DEFAULT NOW()
);

-- ─── QUIZZES ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quizzes (
    id                   BIGINT DEFAULT nextval('quizzes_seq') PRIMARY KEY,
    title                VARCHAR(200) NOT NULL,
    description          TEXT,
    difficulty           VARCHAR(20) DEFAULT 'BEGINNER',
    time_limit_minutes   INTEGER DEFAULT 30,
    pass_score           INTEGER DEFAULT 70,
    published            BOOLEAN DEFAULT TRUE,
    premium              BOOLEAN DEFAULT FALSE,
    randomize_questions  BOOLEAN DEFAULT TRUE,
    course_id            BIGINT REFERENCES courses(id),
    created_at           TIMESTAMP DEFAULT NOW(),
    updated_at           TIMESTAMP DEFAULT NOW()
);

-- ─── QUESTIONS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS questions (
    id             BIGINT DEFAULT nextval('questions_seq') PRIMARY KEY,
    question_text  TEXT NOT NULL,
    question_type  VARCHAR(30) DEFAULT 'MCQ',
    option_a       TEXT,
    option_b       TEXT,
    option_c       TEXT,
    option_d       TEXT,
    correct_answer VARCHAR(500) NOT NULL,
    explanation    TEXT,
    hint           TEXT,
    points         INTEGER DEFAULT 10,
    difficulty     VARCHAR(20) DEFAULT 'BEGINNER',
    topic          VARCHAR(100),
    published      BOOLEAN DEFAULT TRUE,
    order_index    INTEGER DEFAULT 0,
    quiz_id        BIGINT REFERENCES quizzes(id) ON DELETE CASCADE,
    created_at     TIMESTAMP DEFAULT NOW()
);

-- ─── CHALLENGES ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS challenges (
    id                      BIGINT DEFAULT nextval('challenges_seq') PRIMARY KEY,
    title                   VARCHAR(200) NOT NULL,
    description             TEXT,
    problem_statement       TEXT,
    starter_query           TEXT,
    expected_output         TEXT,
    solution_query          TEXT,
    hints                   TEXT,
    explanation             TEXT,
    difficulty              VARCHAR(20) DEFAULT 'EASY',
    points                  INTEGER DEFAULT 10,
    xp_reward               INTEGER DEFAULT 20,
    topic                   VARCHAR(100),
    database_name           VARCHAR(50) DEFAULT 'employees',
    premium                 BOOLEAN DEFAULT FALSE,
    published               BOOLEAN DEFAULT TRUE,
    total_submissions       INTEGER DEFAULT 0,
    successful_submissions  INTEGER DEFAULT 0,
    created_at              TIMESTAMP DEFAULT NOW(),
    updated_at              TIMESTAMP DEFAULT NOW()
);

-- ─── USER PROGRESS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_progress (
    id                  BIGINT DEFAULT nextval('user_progress_seq') PRIMARY KEY,
    user_id             BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id           BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    course_id           BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    completed           BOOLEAN DEFAULT FALSE,
    completed_at        TIMESTAMP,
    time_spent_seconds  INTEGER DEFAULT 0,
    xp_earned           INTEGER DEFAULT 0,
    created_at          TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, lesson_id)
);

-- ─── QUIZ ATTEMPTS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id                BIGINT DEFAULT nextval('quiz_attempts_seq') PRIMARY KEY,
    user_id           BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quiz_id           BIGINT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    score             INTEGER DEFAULT 0,
    total_questions   INTEGER DEFAULT 0,
    correct_answers   INTEGER DEFAULT 0,
    time_taken_seconds INTEGER DEFAULT 0,
    passed            BOOLEAN DEFAULT FALSE,
    xp_earned         INTEGER DEFAULT 0,
    answers_json      TEXT,
    attempted_at      TIMESTAMP DEFAULT NOW()
);

-- ─── CHALLENGE SUBMISSIONS ───────────────────────────────────
CREATE TABLE IF NOT EXISTS challenge_submissions (
    id                BIGINT DEFAULT nextval('challenge_submissions_seq') PRIMARY KEY,
    user_id           BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    challenge_id      BIGINT NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    submitted_query   TEXT,
    correct           BOOLEAN DEFAULT FALSE,
    execution_time_ms BIGINT,
    error_message     TEXT,
    points_earned     INTEGER DEFAULT 0,
    xp_earned         INTEGER DEFAULT 0,
    submitted_at      TIMESTAMP DEFAULT NOW()
);

-- ─── CERTIFICATES ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS certificates (
    id                  BIGINT DEFAULT nextval('certificates_seq') PRIMARY KEY,
    user_id             BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id           BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    certificate_number  VARCHAR(100) NOT NULL UNIQUE,
    qr_code_data        TEXT,
    pdf_url             VARCHAR(500),
    completion_score    INTEGER,
    grade               VARCHAR(5),
    valid               BOOLEAN DEFAULT TRUE,
    issued_at           TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, course_id)
);

-- ─── PAYMENTS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
    id                    BIGINT DEFAULT nextval('payments_seq') PRIMARY KEY,
    user_id               BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    razorpay_order_id     VARCHAR(100) UNIQUE,
    razorpay_payment_id   VARCHAR(100),
    razorpay_signature    VARCHAR(500),
    amount                DECIMAL(10,2) NOT NULL,
    currency              VARCHAR(10) DEFAULT 'INR',
    status                VARCHAR(20) DEFAULT 'PENDING',
    subscription_plan     VARCHAR(20),
    plan_duration         VARCHAR(20) DEFAULT 'MONTHLY',
    subscription_start    TIMESTAMP,
    subscription_end      TIMESTAMP,
    invoice_number        VARCHAR(100),
    coupon_code           VARCHAR(50),
    discount_amount       DECIMAL(10,2) DEFAULT 0,
    created_at            TIMESTAMP DEFAULT NOW(),
    updated_at            TIMESTAMP DEFAULT NOW()
);

-- ─── BLOGS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blogs (
    id                  BIGINT DEFAULT nextval('blogs_seq') PRIMARY KEY,
    title               VARCHAR(300) NOT NULL,
    slug                VARCHAR(300) NOT NULL UNIQUE,
    content             TEXT,
    excerpt             TEXT,
    thumbnail_url       VARCHAR(500),
    category            VARCHAR(100),
    tags                VARCHAR(500),
    reading_time_minutes INTEGER DEFAULT 5,
    views               INTEGER DEFAULT 0,
    likes               INTEGER DEFAULT 0,
    published           BOOLEAN DEFAULT FALSE,
    featured            BOOLEAN DEFAULT FALSE,
    seo_title           VARCHAR(300),
    seo_description     VARCHAR(500),
    author_id           BIGINT REFERENCES users(id),
    published_at        TIMESTAMP,
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW()
);

-- ─── SQL EXECUTIONS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sql_executions (
    id                BIGINT DEFAULT nextval('sql_executions_seq') PRIMARY KEY,
    user_id           BIGINT REFERENCES users(id) ON DELETE SET NULL,
    query             TEXT,
    result_json       TEXT,
    row_count         INTEGER DEFAULT 0,
    execution_time_ms BIGINT,
    database_name     VARCHAR(50),
    success           BOOLEAN DEFAULT TRUE,
    error_message     TEXT,
    saved             BOOLEAN DEFAULT FALSE,
    query_name        VARCHAR(200),
    favorite          BOOLEAN DEFAULT FALSE,
    executed_at       TIMESTAMP DEFAULT NOW()
);

-- ─── SANDBOX SCHEMAS ─────────────────────────────────────────
-- Each sample database gets its own schema for isolation
CREATE SCHEMA IF NOT EXISTS employees_db;
CREATE SCHEMA IF NOT EXISTS ecommerce_db;
CREATE SCHEMA IF NOT EXISTS university_db;
CREATE SCHEMA IF NOT EXISTS library_db;
CREATE SCHEMA IF NOT EXISTS hospital_db;
CREATE SCHEMA IF NOT EXISTS inventory_db;
CREATE SCHEMA IF NOT EXISTS social_db;

-- ─── EMPLOYEES DATABASE ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS employees_db.departments (
    dept_id    SERIAL PRIMARY KEY,
    dept_name  VARCHAR(100) NOT NULL,
    location   VARCHAR(100),
    budget     DECIMAL(15,2)
);

CREATE TABLE IF NOT EXISTS employees_db.employees (
    emp_id      SERIAL PRIMARY KEY,
    first_name  VARCHAR(50) NOT NULL,
    last_name   VARCHAR(50) NOT NULL,
    email       VARCHAR(100) UNIQUE,
    hire_date   DATE,
    salary      DECIMAL(10,2),
    job_title   VARCHAR(100),
    dept_id     INT REFERENCES employees_db.departments(dept_id),
    manager_id  INT REFERENCES employees_db.employees(emp_id),
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employees_db.salaries (
    id         SERIAL PRIMARY KEY,
    emp_id     INT REFERENCES employees_db.employees(emp_id),
    amount     DECIMAL(10,2),
    from_date  DATE,
    to_date    DATE
);

-- ─── ECOMMERCE DATABASE ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS ecommerce_db.customers (
    customer_id  SERIAL PRIMARY KEY,
    name         VARCHAR(100) NOT NULL,
    email        VARCHAR(100) UNIQUE,
    country      VARCHAR(50),
    joined_date  DATE
);

CREATE TABLE IF NOT EXISTS ecommerce_db.products (
    product_id    SERIAL PRIMARY KEY,
    product_name  VARCHAR(200) NOT NULL,
    category      VARCHAR(100),
    price         DECIMAL(10,2),
    stock         INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS ecommerce_db.orders (
    order_id     SERIAL PRIMARY KEY,
    customer_id  INT REFERENCES ecommerce_db.customers(customer_id),
    order_date   DATE DEFAULT CURRENT_DATE,
    total_amount DECIMAL(10,2),
    status       VARCHAR(20) DEFAULT 'PENDING'
);

CREATE TABLE IF NOT EXISTS ecommerce_db.order_items (
    id          SERIAL PRIMARY KEY,
    order_id    INT REFERENCES ecommerce_db.orders(order_id),
    product_id  INT REFERENCES ecommerce_db.products(product_id),
    quantity    INTEGER,
    unit_price  DECIMAL(10,2)
);

-- ─── UNIVERSITY DATABASE ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS university_db.students (
    student_id   SERIAL PRIMARY KEY,
    name         VARCHAR(100) NOT NULL,
    email        VARCHAR(100),
    enrollment_year INTEGER,
    major        VARCHAR(100),
    gpa          DECIMAL(3,2)
);

CREATE TABLE IF NOT EXISTS university_db.courses (
    course_id    SERIAL PRIMARY KEY,
    course_name  VARCHAR(200) NOT NULL,
    credits      INTEGER DEFAULT 3,
    department   VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS university_db.enrollments (
    id         SERIAL PRIMARY KEY,
    student_id INT REFERENCES university_db.students(student_id),
    course_id  INT REFERENCES university_db.courses(course_id),
    grade      VARCHAR(5),
    semester   VARCHAR(20)
);

-- ─── INDEXES ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_subscription ON users(subscription_plan);
CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_questions_quiz ON questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_challenges_difficulty ON challenges(difficulty, published);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON challenge_submissions(user_id, challenge_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_number ON certificates(certificate_number);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay ON payments(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_sql_executions_user ON sql_executions(user_id, executed_at DESC);
