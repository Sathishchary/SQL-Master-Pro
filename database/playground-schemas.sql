-- ============================================================
-- SQL Master Pro - Playground Sample Databases
-- Run this in your PostgreSQL database (SQLMasterPro) to
-- enable all 7 sandbox schemas for the SQL Playground.
-- ============================================================

-- ═══════════════════════════════════════════════════════════
-- 1. EMPLOYEE DATABASE  (employee_db)
-- ═══════════════════════════════════════════════════════════
CREATE SCHEMA IF NOT EXISTS employee_db;

CREATE TABLE IF NOT EXISTS employee_db.departments (
    id              SERIAL PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL,
    location        VARCHAR(100),
    budget          NUMERIC(15,2)
);

CREATE TABLE IF NOT EXISTS employee_db.employees (
    id              SERIAL PRIMARY KEY,
    first_name      VARCHAR(50)  NOT NULL,
    last_name       VARCHAR(50)  NOT NULL,
    email           VARCHAR(120) UNIQUE NOT NULL,
    department_id   INT REFERENCES employee_db.departments(id),
    salary          NUMERIC(12,2),
    hire_date       DATE,
    job_title       VARCHAR(100),
    manager_id      INT REFERENCES employee_db.employees(id)
);

CREATE TABLE IF NOT EXISTS employee_db.salaries (
    id          SERIAL PRIMARY KEY,
    employee_id INT REFERENCES employee_db.employees(id),
    salary      NUMERIC(12,2),
    from_date   DATE,
    to_date     DATE
);

INSERT INTO employee_db.departments (department_name, location, budget) VALUES
  ('Engineering',    'Bengaluru',  5000000),
  ('Marketing',      'Mumbai',     2000000),
  ('Sales',          'Delhi',      3000000),
  ('HR',             'Hyderabad',  1500000),
  ('Finance',        'Chennai',    2500000),
  ('Product',        'Bengaluru',  3500000),
  ('Data Science',   'Pune',       4000000),
  ('Customer Success','Bengaluru', 1800000)
ON CONFLICT DO NOTHING;

INSERT INTO employee_db.employees (first_name, last_name, email, department_id, salary, hire_date, job_title, manager_id) VALUES
  ('Arjun',    'Sharma',    'arjun.sharma@company.com',    1, 120000, '2019-03-15', 'Senior Engineer',       NULL),
  ('Priya',    'Nair',      'priya.nair@company.com',      1,  95000, '2020-07-01', 'Software Engineer',     1),
  ('Rahul',    'Gupta',     'rahul.gupta@company.com',     2,  80000, '2021-01-10', 'Marketing Manager',     NULL),
  ('Sneha',    'Patel',     'sneha.patel@company.com',     3, 110000, '2018-05-20', 'Sales Director',        NULL),
  ('Vikram',   'Reddy',     'vikram.reddy@company.com',    1,  88000, '2021-09-01', 'Backend Engineer',      1),
  ('Ananya',   'Iyer',      'ananya.iyer@company.com',     4,  72000, '2022-02-14', 'HR Specialist',         NULL),
  ('Karthik',  'Menon',     'karthik.menon@company.com',   7, 135000, '2019-11-03', 'Data Scientist',        NULL),
  ('Deepa',    'Krishnan',  'deepa.krishnan@company.com',  5,  98000, '2020-06-18', 'Finance Analyst',       NULL),
  ('Suresh',   'Kumar',     'suresh.kumar@company.com',    3,  76000, '2022-08-05', 'Sales Executive',       4),
  ('Lakshmi',  'Balasubramanian', 'lakshmi.b@company.com', 6, 105000, '2020-03-22', 'Product Manager',      NULL),
  ('Ravi',     'Tiwari',    'ravi.tiwari@company.com',     1,  91000, '2021-05-11', 'DevOps Engineer',       1),
  ('Meena',    'Joshi',     'meena.joshi@company.com',     7, 125000, '2019-08-29', 'ML Engineer',           7),
  ('Aditya',   'Verma',     'aditya.verma@company.com',    2,  67000, '2023-01-16', 'Content Strategist',    3),
  ('Pooja',    'Singh',     'pooja.singh@company.com',     8,  58000, '2023-06-01', 'Customer Success Rep',  NULL),
  ('Nikhil',   'Desai',     'nikhil.desai@company.com',    1, 145000, '2017-04-10', 'Staff Engineer', NULL),
  ('Swathi',   'Rao',       'swathi.rao@company.com',      6,  92000, '2021-07-19', 'UX Designer',           10),
  ('Manoj',    'Pillai',    'manoj.pillai@company.com',    5,  85000, '2022-03-08', 'Senior Analyst',        8),
  ('Divya',    'Chatterjee','divya.chatterjee@company.com',7, 118000, '2020-10-30', 'Data Engineer',         7),
  ('Sanjay',   'Kapoor',    'sanjay.kapoor@company.com',   3,  99000, '2019-12-02', 'Sales Manager',         4),
  ('Kavitha',  'Murthy',    'kavitha.murthy@company.com',  4,  65000, '2023-04-17', 'Recruiter',             6)
ON CONFLICT (email) DO NOTHING;

INSERT INTO employee_db.salaries (employee_id, salary, from_date, to_date)
SELECT id, salary * 0.85, hire_date, hire_date + INTERVAL '1 year' FROM employee_db.employees
ON CONFLICT DO NOTHING;


-- ═══════════════════════════════════════════════════════════
-- 2. ECOMMERCE DATABASE  (ecommerce_db)
-- ═══════════════════════════════════════════════════════════
CREATE SCHEMA IF NOT EXISTS ecommerce_db;

CREATE TABLE IF NOT EXISTS ecommerce_db.customers (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(120) UNIQUE NOT NULL
);
ALTER TABLE ecommerce_db.customers ADD COLUMN IF NOT EXISTS name       VARCHAR(100);
ALTER TABLE ecommerce_db.customers ADD COLUMN IF NOT EXISTS city       VARCHAR(80);
ALTER TABLE ecommerce_db.customers ADD COLUMN IF NOT EXISTS country    VARCHAR(60) DEFAULT 'India';
ALTER TABLE ecommerce_db.customers ADD COLUMN IF NOT EXISTS created_at TIMESTAMP   DEFAULT NOW();

CREATE TABLE IF NOT EXISTS ecommerce_db.products (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL
);
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'ecommerce_db' AND table_name = 'products' AND column_name = 'product_name'
    ) THEN
        ALTER TABLE ecommerce_db.products RENAME COLUMN product_name TO name;
    END IF;
END $$;
ALTER TABLE ecommerce_db.products ADD COLUMN IF NOT EXISTS name           VARCHAR(150);
ALTER TABLE ecommerce_db.products ADD COLUMN IF NOT EXISTS category       VARCHAR(80);
ALTER TABLE ecommerce_db.products ADD COLUMN IF NOT EXISTS price          NUMERIC(10,2);
ALTER TABLE ecommerce_db.products ADD COLUMN IF NOT EXISTS stock_quantity INT DEFAULT 0;

CREATE TABLE IF NOT EXISTS ecommerce_db.orders (
    id          SERIAL PRIMARY KEY,
    customer_id INT REFERENCES ecommerce_db.customers(id)
);
ALTER TABLE ecommerce_db.orders ADD COLUMN IF NOT EXISTS order_date   TIMESTAMP   DEFAULT NOW();
ALTER TABLE ecommerce_db.orders ADD COLUMN IF NOT EXISTS total_amount NUMERIC(12,2);
ALTER TABLE ecommerce_db.orders ADD COLUMN IF NOT EXISTS status       VARCHAR(30) DEFAULT 'PENDING';

CREATE TABLE IF NOT EXISTS ecommerce_db.order_items (
    id         SERIAL PRIMARY KEY,
    order_id   INT REFERENCES ecommerce_db.orders(id),
    product_id INT REFERENCES ecommerce_db.products(id)
);
ALTER TABLE ecommerce_db.order_items ADD COLUMN IF NOT EXISTS quantity INT;
ALTER TABLE ecommerce_db.order_items ADD COLUMN IF NOT EXISTS price    NUMERIC(10,2);

TRUNCATE ecommerce_db.order_items, ecommerce_db.orders, ecommerce_db.products, ecommerce_db.customers RESTART IDENTITY CASCADE;

INSERT INTO ecommerce_db.customers (name, email, city) VALUES
  ('Amit Shah',        'amit.shah@mail.com',      'Mumbai'),
  ('Preethi Nair',     'preethi.nair@mail.com',   'Kochi'),
  ('Rohan Mehta',      'rohan.mehta@mail.com',    'Delhi'),
  ('Sunita Verma',     'sunita.verma@mail.com',   'Lucknow'),
  ('Ankit Jain',       'ankit.jain@mail.com',     'Jaipur'),
  ('Divya Pillai',     'divya.pillai@mail.com',   'Trivandrum'),
  ('Karan Singh',      'karan.singh@mail.com',    'Chandigarh'),
  ('Meghna Bose',      'meghna.bose@mail.com',    'Kolkata'),
  ('Tarun Gupta',      'tarun.gupta@mail.com',    'Bengaluru'),
  ('Nisha Reddy',      'nisha.reddy@mail.com',    'Hyderabad')
ON CONFLICT (email) DO NOTHING;

INSERT INTO ecommerce_db.products (name, category, price, stock_quantity) VALUES
  ('iPhone 15 Pro',        'Electronics',   134900,  50),
  ('Samsung Galaxy S24',   'Electronics',    89999, 120),
  ('Sony WH-1000XM5',      'Audio',          29990,  80),
  ('MacBook Air M3',       'Laptops',       114900,  30),
  ('Dell XPS 15',          'Laptops',        89990,  45),
  ('Nike Air Max 270',     'Footwear',        8995, 200),
  ('Levi''s 511 Jeans',   'Clothing',        3499, 350),
  ('Whirlpool Refrigerator','Appliances',    35000,  25),
  ('Philips Air Fryer',    'Kitchen',         6999, 110),
  ('Kindle Paperwhite',    'Books & E-readers',14999, 90),
  ('JBL Flip 6',           'Audio',           9999, 150),
  ('boAt Airdopes 141',    'Audio',           1299, 500)
ON CONFLICT DO NOTHING;

INSERT INTO ecommerce_db.orders (customer_id, order_date, total_amount, status) VALUES
  (1, NOW() - INTERVAL '30 days', 134900, 'DELIVERED'),
  (2, NOW() - INTERVAL '25 days',  29990, 'DELIVERED'),
  (3, NOW() - INTERVAL '20 days', 114900, 'SHIPPED'),
  (4, NOW() - INTERVAL '15 days',  12494, 'DELIVERED'),
  (5, NOW() - INTERVAL '10 days',  89999, 'PROCESSING'),
  (6, NOW() - INTERVAL '7 days',    6999, 'DELIVERED'),
  (7, NOW() - INTERVAL '5 days',   14999, 'SHIPPED'),
  (8, NOW() - INTERVAL '3 days',   44998, 'PROCESSING'),
  (9, NOW() - INTERVAL '2 days',    9999, 'PENDING'),
  (10,NOW() - INTERVAL '1 day',    35000, 'PENDING')
ON CONFLICT DO NOTHING;

INSERT INTO ecommerce_db.order_items (order_id, product_id, quantity, price) VALUES
  (1,1,1,134900),(2,3,1,29990),(3,4,1,114900),(4,6,1,8995),(4,7,1,3499),
  (5,2,1,89999),(6,9,1,6999),(7,10,1,14999),(8,11,1,9999),(8,12,2,1299),
  (9,11,1,9999),(10,8,1,35000);


-- ═══════════════════════════════════════════════════════════
-- 3. HOSPITAL DATABASE  (hospital_db)
-- ═══════════════════════════════════════════════════════════
CREATE SCHEMA IF NOT EXISTS hospital_db;

CREATE TABLE IF NOT EXISTS hospital_db.doctors (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);
ALTER TABLE hospital_db.doctors ADD COLUMN IF NOT EXISTS specialization   VARCHAR(100);
ALTER TABLE hospital_db.doctors ADD COLUMN IF NOT EXISTS department       VARCHAR(100);
ALTER TABLE hospital_db.doctors ADD COLUMN IF NOT EXISTS years_experience INT;

CREATE TABLE IF NOT EXISTS hospital_db.patients (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);
ALTER TABLE hospital_db.patients ADD COLUMN IF NOT EXISTS age            INT;
ALTER TABLE hospital_db.patients ADD COLUMN IF NOT EXISTS gender         VARCHAR(10);
ALTER TABLE hospital_db.patients ADD COLUMN IF NOT EXISTS blood_group    VARCHAR(5);
ALTER TABLE hospital_db.patients ADD COLUMN IF NOT EXISTS admission_date DATE;

CREATE TABLE IF NOT EXISTS hospital_db.appointments (
    id         SERIAL PRIMARY KEY,
    patient_id INT REFERENCES hospital_db.patients(id),
    doctor_id  INT REFERENCES hospital_db.doctors(id)
);
ALTER TABLE hospital_db.appointments ADD COLUMN IF NOT EXISTS appointment_date TIMESTAMP;
ALTER TABLE hospital_db.appointments ADD COLUMN IF NOT EXISTS status           VARCHAR(30) DEFAULT 'SCHEDULED';
ALTER TABLE hospital_db.appointments ADD COLUMN IF NOT EXISTS notes            TEXT;

CREATE TABLE IF NOT EXISTS hospital_db.medical_records (
    id         SERIAL PRIMARY KEY,
    patient_id INT REFERENCES hospital_db.patients(id),
    doctor_id  INT REFERENCES hospital_db.doctors(id)
);
ALTER TABLE hospital_db.medical_records ADD COLUMN IF NOT EXISTS diagnosis   TEXT;
ALTER TABLE hospital_db.medical_records ADD COLUMN IF NOT EXISTS treatment   TEXT;
ALTER TABLE hospital_db.medical_records ADD COLUMN IF NOT EXISTS record_date DATE DEFAULT CURRENT_DATE;

INSERT INTO hospital_db.doctors (name, specialization, department, years_experience) VALUES
  ('Dr. Ramesh Iyer',      'Cardiology',       'Cardiology',    18),
  ('Dr. Seetha Lakshmi',   'Neurology',        'Neurology',     14),
  ('Dr. Arjun Nair',       'Orthopedics',      'Surgery',       10),
  ('Dr. Priya Menon',      'Pediatrics',       'Pediatrics',     9),
  ('Dr. Vijay Kumar',      'General Surgery',  'Surgery',       22),
  ('Dr. Anitha Reddy',     'Dermatology',      'OPD',            7),
  ('Dr. Suresh Babu',      'Oncology',         'Oncology',      16),
  ('Dr. Kavitha Rao',      'Gynecology',       'Obstetrics',    13)
ON CONFLICT DO NOTHING;

INSERT INTO hospital_db.patients (name, age, gender, blood_group, admission_date) VALUES
  ('Mohan Das',        52, 'Male',   'O+',  '2024-01-10'),
  ('Lalitha Krishnan', 45, 'Female', 'A+',  '2024-02-05'),
  ('Ravi Shankar',     67, 'Male',   'B-',  '2024-02-20'),
  ('Suma Pillai',      34, 'Female', 'AB+', '2024-03-01'),
  ('Ajay Menon',        8, 'Male',   'O-',  '2024-03-15'),
  ('Geeta Sharma',     78, 'Female', 'A-',  '2024-04-02'),
  ('Deepak Nair',      41, 'Male',   'B+',  '2024-05-08'),
  ('Anitha Joseph',    29, 'Female', 'O+',  '2024-06-12'),
  ('Sunil Varghese',   55, 'Male',   'AB-', '2024-07-19'),
  ('Rekha Murthy',     38, 'Female', 'A+',  '2024-08-01')
ON CONFLICT DO NOTHING;

INSERT INTO hospital_db.appointments (patient_id, doctor_id, appointment_date, status) VALUES
  (1,1,'2024-01-11 10:00','COMPLETED'),(2,2,'2024-02-06 11:00','COMPLETED'),
  (3,5,'2024-02-21 09:30','COMPLETED'),(4,8,'2024-03-02 14:00','COMPLETED'),
  (5,4,'2024-03-16 10:30','COMPLETED'),(6,1,'2024-04-03 09:00','COMPLETED'),
  (7,3,'2024-05-09 11:30','COMPLETED'),(8,6,'2024-06-13 15:00','SCHEDULED'),
  (9,7,'2024-07-20 10:00','SCHEDULED'),(10,2,'2024-08-02 09:30','SCHEDULED')
ON CONFLICT DO NOTHING;

INSERT INTO hospital_db.medical_records (patient_id, doctor_id, diagnosis, treatment, record_date) VALUES
  (1,1,'Coronary artery disease','Medication + lifestyle changes','2024-01-11'),
  (2,2,'Migraine chronic','Prophylactic treatment','2024-02-06'),
  (3,5,'Appendicitis','Appendectomy surgery','2024-02-21'),
  (4,8,'Prenatal checkup - normal','Routine vitamins','2024-03-02'),
  (5,4,'Viral fever','Antipyretics and rest','2024-03-16'),
  (6,1,'Hypertension stage 2','ACE inhibitors prescribed','2024-04-03'),
  (7,3,'Knee ligament tear','Physiotherapy + bracing','2024-05-09')
ON CONFLICT DO NOTHING;


-- ═══════════════════════════════════════════════════════════
-- 4. BANKING DATABASE  (banking_db)
-- ═══════════════════════════════════════════════════════════
CREATE SCHEMA IF NOT EXISTS banking_db;

CREATE TABLE IF NOT EXISTS banking_db.customers (
    id    SERIAL PRIMARY KEY,
    name  VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL
);
ALTER TABLE banking_db.customers ADD COLUMN IF NOT EXISTS phone      VARCHAR(15);
ALTER TABLE banking_db.customers ADD COLUMN IF NOT EXISTS city       VARCHAR(80);
ALTER TABLE banking_db.customers ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();

CREATE TABLE IF NOT EXISTS banking_db.accounts (
    id          SERIAL PRIMARY KEY,
    customer_id INT REFERENCES banking_db.customers(id)
);
ALTER TABLE banking_db.accounts ADD COLUMN IF NOT EXISTS account_type VARCHAR(30);
ALTER TABLE banking_db.accounts ADD COLUMN IF NOT EXISTS balance      NUMERIC(15,2) DEFAULT 0;
ALTER TABLE banking_db.accounts ADD COLUMN IF NOT EXISTS created_at   TIMESTAMP     DEFAULT NOW();

CREATE TABLE IF NOT EXISTS banking_db.transactions (
    id         SERIAL PRIMARY KEY,
    account_id INT REFERENCES banking_db.accounts(id)
);
ALTER TABLE banking_db.transactions ADD COLUMN IF NOT EXISTS type             VARCHAR(20);
ALTER TABLE banking_db.transactions ADD COLUMN IF NOT EXISTS amount           NUMERIC(12,2);
ALTER TABLE banking_db.transactions ADD COLUMN IF NOT EXISTS description      VARCHAR(200);
ALTER TABLE banking_db.transactions ADD COLUMN IF NOT EXISTS transaction_date TIMESTAMP DEFAULT NOW();

CREATE TABLE IF NOT EXISTS banking_db.loans (
    id          SERIAL PRIMARY KEY,
    customer_id INT REFERENCES banking_db.customers(id)
);
ALTER TABLE banking_db.loans ADD COLUMN IF NOT EXISTS loan_type     VARCHAR(50);
ALTER TABLE banking_db.loans ADD COLUMN IF NOT EXISTS amount        NUMERIC(15,2);
ALTER TABLE banking_db.loans ADD COLUMN IF NOT EXISTS interest_rate NUMERIC(5,2);
ALTER TABLE banking_db.loans ADD COLUMN IF NOT EXISTS status        VARCHAR(20) DEFAULT 'ACTIVE';
ALTER TABLE banking_db.loans ADD COLUMN IF NOT EXISTS issued_date   DATE;

INSERT INTO banking_db.customers (name, email, phone, city) VALUES
  ('Rajesh Kumar',   'rajesh.kumar@bank.com',   '9876543210', 'Mumbai'),
  ('Asha Patel',     'asha.patel@bank.com',     '9123456780', 'Ahmedabad'),
  ('Deepak Nair',    'deepak.nair@bank.com',    '9012345678', 'Kochi'),
  ('Sunita Tiwari',  'sunita.tiwari@bank.com',  '9345678901', 'Lucknow'),
  ('Vijay Menon',    'vijay.menon@bank.com',    '9456789012', 'Chennai'),
  ('Nandita Roy',    'nandita.roy@bank.com',    '9567890123', 'Kolkata'),
  ('Harish Sharma',  'harish.sharma@bank.com',  '9678901234', 'Jaipur'),
  ('Preethi Iyer',   'preethi.iyer@bank.com',   '9789012345', 'Bengaluru'),
  ('Sanjay Gupta',   'sanjay.gupta@bank.com',   '9890123456', 'Delhi'),
  ('Kavitha Rao',    'kavitha.rao@bank.com',     '9901234567', 'Hyderabad')
ON CONFLICT (email) DO NOTHING;

INSERT INTO banking_db.accounts (customer_id, account_type, balance) VALUES
  (1,'SAVINGS',   245000.00),(1,'CURRENT',  850000.00),
  (2,'SAVINGS',   128500.50),(3,'SAVINGS',   95200.75),
  (4,'SAVINGS',   312000.00),(5,'CURRENT', 1250000.00),
  (6,'SAVINGS',    67800.25),(7,'SAVINGS',  185000.00),
  (7,'FD',        500000.00),(8,'SAVINGS',  430000.00),
  (9,'CURRENT',   760000.00),(10,'SAVINGS',  98000.00)
ON CONFLICT DO NOTHING;

INSERT INTO banking_db.transactions (account_id, type, amount, description, transaction_date) VALUES
  (1,'CREDIT', 50000,'Salary credit',       NOW()-INTERVAL '5 days'),
  (1,'DEBIT',  12000,'Rent payment',        NOW()-INTERVAL '4 days'),
  (1,'DEBIT',   3500,'Grocery shopping',    NOW()-INTERVAL '3 days'),
  (2,'CREDIT',250000,'Business income',     NOW()-INTERVAL '7 days'),
  (2,'DEBIT',  80000,'Supplier payment',    NOW()-INTERVAL '2 days'),
  (3,'CREDIT', 45000,'Salary credit',       NOW()-INTERVAL '6 days'),
  (3,'DEBIT',   8000,'Utility bills',       NOW()-INTERVAL '1 day'),
  (5,'CREDIT',100000,'Investment return',   NOW()-INTERVAL '8 days'),
  (9,'CREDIT',300000,'Quarterly bonus',     NOW()-INTERVAL '10 days'),
  (9,'DEBIT',  50000,'Tax payment',         NOW()-INTERVAL '3 days')
ON CONFLICT DO NOTHING;

INSERT INTO banking_db.loans (customer_id, loan_type, amount, interest_rate, status, issued_date) VALUES
  (1,'HOME LOAN',    3500000, 8.50, 'ACTIVE',   '2022-01-15'),
  (2,'CAR LOAN',      850000, 9.25, 'ACTIVE',   '2023-06-01'),
  (3,'PERSONAL LOAN', 200000,12.00, 'ACTIVE',   '2024-01-10'),
  (5,'HOME LOAN',    5000000, 8.20, 'ACTIVE',   '2021-09-20'),
  (7,'EDUCATION LOAN',700000, 7.50, 'CLOSED',   '2020-07-01'),
  (9,'BUSINESS LOAN',2000000,10.50, 'ACTIVE',   '2023-03-15')
ON CONFLICT DO NOTHING;


-- ═══════════════════════════════════════════════════════════
-- 5. SCHOOL DATABASE  (school_db)
-- ═══════════════════════════════════════════════════════════
CREATE SCHEMA IF NOT EXISTS school_db;

CREATE TABLE IF NOT EXISTS school_db.teachers (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);
ALTER TABLE school_db.teachers ADD COLUMN IF NOT EXISTS department VARCHAR(80);
ALTER TABLE school_db.teachers ADD COLUMN IF NOT EXISTS subject    VARCHAR(80);
ALTER TABLE school_db.teachers ADD COLUMN IF NOT EXISTS experience INT;

CREATE TABLE IF NOT EXISTS school_db.courses (
    id          SERIAL PRIMARY KEY,
    course_name VARCHAR(120) NOT NULL
);
ALTER TABLE school_db.courses ADD COLUMN IF NOT EXISTS credits    INT;
ALTER TABLE school_db.courses ADD COLUMN IF NOT EXISTS department VARCHAR(80);
ALTER TABLE school_db.courses ADD COLUMN IF NOT EXISTS teacher_id INT REFERENCES school_db.teachers(id);

CREATE TABLE IF NOT EXISTS school_db.students (
    id    SERIAL PRIMARY KEY,
    name  VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL
);
ALTER TABLE school_db.students ADD COLUMN IF NOT EXISTS enrollment_date DATE;
ALTER TABLE school_db.students ADD COLUMN IF NOT EXISTS gpa             NUMERIC(3,2);

CREATE TABLE IF NOT EXISTS school_db.enrollments (
    id         SERIAL PRIMARY KEY,
    student_id INT REFERENCES school_db.students(id),
    course_id  INT REFERENCES school_db.courses(id)
);
ALTER TABLE school_db.enrollments ADD COLUMN IF NOT EXISTS grade    VARCHAR(3);
ALTER TABLE school_db.enrollments ADD COLUMN IF NOT EXISTS semester VARCHAR(20);

INSERT INTO school_db.teachers (name, department, subject, experience) VALUES
  ('Prof. Rajan Nair',      'Computer Science', 'Data Structures',    15),
  ('Prof. Geetha Krishnan', 'Mathematics',      'Calculus',           20),
  ('Prof. Arvind Sharma',   'Physics',          'Quantum Mechanics',  12),
  ('Prof. Lakshmi Pillai',  'Computer Science', 'Database Systems',    8),
  ('Prof. Suresh Menon',    'Business',         'Management',          18)
ON CONFLICT DO NOTHING;

INSERT INTO school_db.courses (course_name, credits, department, teacher_id) VALUES
  ('Data Structures & Algorithms', 4, 'Computer Science', 1),
  ('Calculus III',                 3, 'Mathematics',      2),
  ('Modern Physics',               3, 'Physics',          3),
  ('Database Management Systems',  4, 'Computer Science', 4),
  ('Business Strategy',            3, 'Business',         5),
  ('Machine Learning Basics',      4, 'Computer Science', 1),
  ('Linear Algebra',               3, 'Mathematics',      2),
  ('Operating Systems',            4, 'Computer Science', 4)
ON CONFLICT DO NOTHING;

INSERT INTO school_db.students (name, email, enrollment_date, gpa) VALUES
  ('Aryan Kapoor',   'aryan.kapoor@college.edu',   '2022-07-01', 3.85),
  ('Sneha Reddy',    'sneha.reddy@college.edu',    '2022-07-01', 3.92),
  ('Rahul Sharma',   'rahul.sharma@college.edu',   '2021-07-01', 3.45),
  ('Priya Gupta',    'priya.gupta@college.edu',    '2021-07-01', 3.78),
  ('Kiran Nair',     'kiran.nair@college.edu',     '2023-07-01', 3.60),
  ('Divya Menon',    'divya.menon@college.edu',    '2023-07-01', 3.30),
  ('Aditya Iyer',    'aditya.iyer@college.edu',    '2020-07-01', 3.95),
  ('Meena Pillai',   'meena.pillai@college.edu',   '2020-07-01', 3.55),
  ('Suresh Babu',    'suresh.babu@college.edu',    '2022-07-01', 3.20),
  ('Kavitha Rao',    'kavitha.rao@college.edu',    '2021-07-01', 3.70)
ON CONFLICT (email) DO NOTHING;

INSERT INTO school_db.enrollments (student_id, course_id, grade, semester) VALUES
  (1,1,'A','2023-Spring'),(1,4,'A-','2023-Fall'),(1,6,'B+','2024-Spring'),
  (2,1,'A+','2023-Spring'),(2,2,'A','2023-Fall'),(2,4,'A','2024-Spring'),
  (3,1,'B+','2022-Spring'),(3,4,'A-','2022-Fall'),(3,8,'B','2023-Spring'),
  (4,2,'A','2022-Spring'),(4,4,'A+','2022-Fall'),(4,7,'A-','2023-Spring'),
  (5,1,'B','2023-Fall'),(5,4,'B+','2024-Spring'),
  (6,2,'C+','2023-Fall'),(6,5,'B','2024-Spring'),
  (7,1,'A','2021-Spring'),(7,4,'A+','2021-Fall'),(7,6,'A','2022-Spring'),(7,8,'A+','2022-Fall'),
  (8,2,'B+','2021-Spring'),(8,7,'A-','2021-Fall'),
  (9,1,'C','2023-Spring'),(9,5,'B-','2023-Fall'),
  (10,4,'A-','2022-Spring'),(10,1,'B+','2022-Fall'),(10,6,'B','2023-Spring')
ON CONFLICT DO NOTHING;


-- ═══════════════════════════════════════════════════════════
-- 6. INVENTORY DATABASE  (inventory_db)
-- ═══════════════════════════════════════════════════════════
CREATE SCHEMA IF NOT EXISTS inventory_db;

CREATE TABLE IF NOT EXISTS inventory_db.suppliers (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);
ALTER TABLE inventory_db.suppliers ADD COLUMN IF NOT EXISTS contact_email VARCHAR(120);
ALTER TABLE inventory_db.suppliers ADD COLUMN IF NOT EXISTS country       VARCHAR(60);
ALTER TABLE inventory_db.suppliers ADD COLUMN IF NOT EXISTS rating        NUMERIC(3,1);

CREATE TABLE IF NOT EXISTS inventory_db.warehouses (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);
ALTER TABLE inventory_db.warehouses ADD COLUMN IF NOT EXISTS location VARCHAR(100);
ALTER TABLE inventory_db.warehouses ADD COLUMN IF NOT EXISTS capacity INT;

CREATE TABLE IF NOT EXISTS inventory_db.products (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL
);
ALTER TABLE inventory_db.products ADD COLUMN IF NOT EXISTS category    VARCHAR(80);
ALTER TABLE inventory_db.products ADD COLUMN IF NOT EXISTS sku         VARCHAR(50);
ALTER TABLE inventory_db.products ADD COLUMN IF NOT EXISTS unit_price  NUMERIC(10,2);
ALTER TABLE inventory_db.products ADD COLUMN IF NOT EXISTS supplier_id INT REFERENCES inventory_db.suppliers(id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_inventory_products_sku ON inventory_db.products(sku);

CREATE TABLE IF NOT EXISTS inventory_db.stock (
    id           SERIAL PRIMARY KEY,
    product_id   INT REFERENCES inventory_db.products(id),
    warehouse_id INT REFERENCES inventory_db.warehouses(id)
);
ALTER TABLE inventory_db.stock ADD COLUMN IF NOT EXISTS quantity     INT       DEFAULT 0;
ALTER TABLE inventory_db.stock ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP DEFAULT NOW();

INSERT INTO inventory_db.suppliers (name, contact_email, country, rating) VALUES
  ('TechGlobal Pvt Ltd',    'supply@techglobal.in',   'India',  4.5),
  ('EcoGoods Co.',          'orders@ecogoods.com',    'Germany',4.8),
  ('AsiaSource Ltd',        'info@asiasource.hk',     'China',  4.1),
  ('PrimeParts Inc.',       'sales@primeparts.us',    'USA',    4.6),
  ('LocalCraft Suppliers',  'hello@localcraft.in',    'India',  4.3)
ON CONFLICT DO NOTHING;

INSERT INTO inventory_db.warehouses (name, location, capacity) VALUES
  ('Bengaluru Central',  'Bengaluru, KA',    10000),
  ('Mumbai North',       'Mumbai, MH',        8000),
  ('Delhi Hub',          'Delhi, DL',        12000),
  ('Chennai South',      'Chennai, TN',       6000),
  ('Hyderabad Tech',     'Hyderabad, TS',     9000)
ON CONFLICT DO NOTHING;

INSERT INTO inventory_db.products (name, category, sku, unit_price, supplier_id) VALUES
  ('Laptop Stand Aluminium',   'Accessories',  'SKU-ACC-001',  2499, 1),
  ('USB-C Hub 7-in-1',         'Accessories',  'SKU-ACC-002',  1899, 1),
  ('Mechanical Keyboard',      'Peripherals',  'SKU-PRF-001',  4999, 4),
  ('27" 4K Monitor',           'Displays',     'SKU-DSP-001', 28999, 4),
  ('Ergonomic Mouse',          'Peripherals',  'SKU-PRF-002',  2299, 2),
  ('Webcam 1080p',             'Peripherals',  'SKU-PRF-003',  3499, 3),
  ('Noise Cancelling Headset', 'Audio',        'SKU-AUD-001',  5999, 2),
  ('Standing Desk Mat',        'Ergonomics',   'SKU-ERG-001',  1499, 5),
  ('Cable Management Kit',     'Accessories',  'SKU-ACC-003',   699, 5),
  ('Portable SSD 1TB',         'Storage',      'SKU-STG-001',  7999, 3)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO inventory_db.stock (product_id, warehouse_id, quantity) VALUES
  (1,1,150),(1,2,80),(2,1,200),(2,3,120),(3,1,60),(3,3,45),
  (4,1,20),(4,2,15),(5,2,180),(5,4,90),(6,1,75),(6,5,50),
  (7,1,40),(7,3,35),(8,2,300),(8,4,200),(9,1,500),(9,3,400),(10,1,55),(10,5,30)
ON CONFLICT DO NOTHING;


-- ═══════════════════════════════════════════════════════════
-- 7. MOVIES DATABASE  (movies_db)
-- ═══════════════════════════════════════════════════════════
CREATE SCHEMA IF NOT EXISTS movies_db;

CREATE TABLE IF NOT EXISTS movies_db.directors (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);
ALTER TABLE movies_db.directors ADD COLUMN IF NOT EXISTS nationality VARCHAR(60);
ALTER TABLE movies_db.directors ADD COLUMN IF NOT EXISTS debut_year  INT;

CREATE TABLE IF NOT EXISTS movies_db.movies (
    id    SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL
);
ALTER TABLE movies_db.movies ADD COLUMN IF NOT EXISTS year        INT;
ALTER TABLE movies_db.movies ADD COLUMN IF NOT EXISTS genre       VARCHAR(60);
ALTER TABLE movies_db.movies ADD COLUMN IF NOT EXISTS rating      NUMERIC(3,1);
ALTER TABLE movies_db.movies ADD COLUMN IF NOT EXISTS box_office  NUMERIC(15,2);
ALTER TABLE movies_db.movies ADD COLUMN IF NOT EXISTS director_id INT REFERENCES movies_db.directors(id);

CREATE TABLE IF NOT EXISTS movies_db.actors (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);
ALTER TABLE movies_db.actors ADD COLUMN IF NOT EXISTS nationality VARCHAR(60);
ALTER TABLE movies_db.actors ADD COLUMN IF NOT EXISTS birth_year  INT;

CREATE TABLE IF NOT EXISTS movies_db.movie_cast (
    id       SERIAL PRIMARY KEY,
    movie_id INT REFERENCES movies_db.movies(id),
    actor_id INT REFERENCES movies_db.actors(id)
);
ALTER TABLE movies_db.movie_cast ADD COLUMN IF NOT EXISTS character_name VARCHAR(100);
ALTER TABLE movies_db.movie_cast ADD COLUMN IF NOT EXISTS is_lead        BOOLEAN DEFAULT FALSE;

INSERT INTO movies_db.directors (name, nationality, debut_year) VALUES
  ('Christopher Nolan',  'British-American', 1998),
  ('SS Rajamouli',       'Indian',           2001),
  ('Anurag Kashyap',     'Indian',           2003),
  ('Mani Ratnam',        'Indian',           1983),
  ('James Cameron',      'Canadian-American',1984),
  ('Quentin Tarantino',  'American',         1992),
  ('Shankar Shanmugam',  'Indian',           1993)
ON CONFLICT DO NOTHING;

INSERT INTO movies_db.movies (title, year, genre, rating, box_office, director_id) VALUES
  ('Inception',              2010,'Sci-Fi / Thriller', 8.8, 836848102,  1),
  ('The Dark Knight',        2008,'Action / Crime',    9.0, 1004558444, 1),
  ('Interstellar',           2014,'Sci-Fi / Drama',    8.6, 701729206,  1),
  ('RRR',                    2022,'Action / Drama',    7.8, 1200000000, 2),
  ('Baahubali 2',            2017,'Action / Epic',     8.2, 1810000000, 2),
  ('Gangs of Wasseypur',     2012,'Crime / Drama',     8.2,  11000000,  3),
  ('Roja',                   1992,'Romance / Thriller',8.0,  35000000,  4),
  ('Dil Se',                 1998,'Romance / Drama',   7.5,  12000000,  4),
  ('Avatar',                 2009,'Sci-Fi / Action',   7.9, 2923706026, 5),
  ('Titanic',                1997,'Romance / Drama',   7.9, 2201647264, 5),
  ('Pulp Fiction',           1994,'Crime / Drama',     8.9, 214179088,  6),
  ('Django Unchained',       2012,'Western / Drama',   8.5, 425368238,  6),
  ('Enthiran (Robot)',        2010,'Sci-Fi / Action',   6.9, 1800000000, 7),
  ('2.0',                    2018,'Sci-Fi / Action',   6.8, 2000000000, 7)
ON CONFLICT DO NOTHING;

INSERT INTO movies_db.actors (name, nationality, birth_year) VALUES
  ('Leonardo DiCaprio',  'American',    1974),
  ('Joseph Gordon-Levitt','American',   1981),
  ('Christian Bale',     'British',     1974),
  ('Heath Ledger',       'Australian',  1979),
  ('Matthew McConaughey','American',    1969),
  ('N.T. Rama Rao Jr.',  'Indian',      1983),
  ('Ram Charan',         'Indian',      1985),
  ('Prabhas',            'Indian',      1979),
  ('Anushka Shetty',     'Indian',      1981),
  ('Shah Rukh Khan',     'Indian',      1965),
  ('Manisha Koirala',    'Nepalese',    1970),
  ('John Travolta',      'American',    1954),
  ('Samuel L. Jackson',  'American',    1948),
  ('Rajinikanth',        'Indian',      1950),
  ('Aishwarya Rai',      'Indian',      1973)
ON CONFLICT DO NOTHING;

INSERT INTO movies_db.movie_cast (movie_id, actor_id, character_name, is_lead) VALUES
  (1,1,'Cobb',           TRUE), (1,2,'Arthur',         FALSE),
  (2,3,'Bruce Wayne',    TRUE), (2,4,'Joker',           FALSE),
  (3,5,'Cooper',         TRUE), (3,1,'Dr. Brand',       FALSE),
  (4,6,'Bheem',          TRUE), (4,7,'Raju',            TRUE),
  (5,8,'Baahubali',      TRUE), (5,9,'Devasena',        FALSE),
  (9,1,'Jake Sully',     TRUE),
  (10,1,'Jack Dawson',   TRUE),
  (11,12,'Vincent Vega', TRUE), (11,13,'Jules',         TRUE),
  (12,1,'Django',        TRUE),
  (13,14,'Chitti (Robot)',TRUE),(13,15,'Sana',          FALSE),
  (14,14,'Vaseegaran',   TRUE)
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════════
-- Done! All 7 playground schemas are ready.
-- ═══════════════════════════════════════════════════════════
