# SQL Master Pro — Backend Logic Guide (Beginner-Friendly)

A plain-English walkthrough of how the Spring Boot backend works, for whenever you need a refresher.

## The big picture

The backend is built with **Spring Boot** (Java). Think of it as a waiter in a restaurant:

```
Browser (Angular)  →  Controller  →  Service  →  Repository  →  Database (PostgreSQL)
     "request"          "waiter"      "chef"      "fetches      "the pantry"
                                                    ingredients"
```

Each layer has one job:

| Layer | Folder | Job |
|---|---|---|
| **Controller** | `backend/src/main/java/com/sqlmasterpro/controller/` | Receives HTTP requests (GET/POST/etc.), decides which service to call, returns the response |
| **Service** | `service/`, `service/impl/` | Contains the actual business logic ("rules") |
| **Repository** | `repository/` | Talks to the database — no SQL written by hand, Spring generates it |
| **Entity** | `model/entity/` | A Java class that mirrors a database table (e.g. `Course.java` = `courses` table) |
| **Security** | `security/`, `config/SecurityConfig.java` | Decides who's allowed to call what |

This is called a **layered architecture** — each layer only talks to the layer directly below it.

## Example 1: Getting the list of courses (simple GET, no login needed)

When the Angular app calls `GET /api/courses`, this happens in `CourseController.java`:

```java
@GetMapping
public ResponseEntity<ApiResponse<List<Course>>> getAllCourses() {
    List<Course> courses = courseRepository.findByPublishedTrueOrderByOrderIndexAsc();
    return ResponseEntity.ok(ApiResponse.success(courses));
}
```

- `@GetMapping` tells Spring "run this method when someone sends a GET request to `/api/courses`".
- `courseRepository.findByPublishedTrueOrderByOrderIndexAsc()` — this method isn't written anywhere by hand! Spring Data JPA reads the method *name* and auto-generates the SQL: `SELECT * FROM courses WHERE is_published = true ORDER BY order_index ASC`. That's the "magic" of Spring Data repositories — name your method correctly and Spring writes the query for you.
- The result (a list of `Course` Java objects) gets wrapped in `ApiResponse.success(...)` — a consistent envelope (`{ success: true, message: "...", data: [...] }`) so the frontend always knows what shape to expect.

Since this is a plain `GET` on `/api/courses`, `SecurityConfig.java` explicitly allows it without login:
```java
.requestMatchers(HttpMethod.GET, "/api/courses/**").permitAll()
```

## Example 2: Logging in (the interesting one — security)

**Step 1 — Controller receives the request** (`AuthController.java`):
```java
@PostMapping("/login")
public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
    AuthResponse response = authService.login(request);
    return ResponseEntity.ok(ApiResponse.success("Login successful", response));
}
```
`@RequestBody LoginRequest request` means: take the JSON body the browser sent (`{ "emailOrUsername": "...", "password": "..." }`) and automatically convert it into a Java object. The controller does almost nothing itself — it hands off to `authService.login(...)`. **Controllers should be thin** — that's the rule this codebase follows.

**Step 2 — Service does the real work** (`AuthServiceImpl.java`):
```java
public AuthResponse login(LoginRequest request) {
    Authentication auth = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.getEmailOrUsername(), request.getPassword()));
    ...
    return buildAuthResponse(auth, user);
}
```
- `authenticationManager.authenticate(...)` is Spring Security's built-in mechanism: it looks up the user and checks the password hash matches (passwords are never stored as plain text — see `BCryptPasswordEncoder(12)` in `SecurityConfig.java`). It throws an error automatically if the password is wrong.
- If correct, `buildAuthResponse` generates a **JWT token** — a signed, tamper-proof ID card with an expiry date. It's not stored on the server; the browser keeps it and shows it on every future request.

**Step 3 — Every future request proves who you are using that token.** This is `JwtAuthenticationFilter.java` — it runs *before* every controller method, automatically:

```java
String jwt = getJwtFromRequest(request);          // reads "Authorization: Bearer xxx" header
if (jwt is valid) {
    Long userId = tokenProvider.getUserIdFromToken(jwt);   // decode the token
    UserDetails userDetails = userDetailsService.loadUserById(userId);  // load user from DB
    SecurityContextHolder.getContext().setAuthentication(...);  // "log them in" for this one request
}
filterChain.doFilter(request, response);  // continue to the controller
```

So: you log in **once**, get a token, and that token rides along on every request in the `Authorization` header instead of re-typing your password each time. The server never "remembers" you between requests (`SessionCreationPolicy.STATELESS`) — it just re-verifies the token every single time.

**Step 4 — Authorization rules** (`SecurityConfig.java`) decide *who* can hit *which* endpoint:
```java
.requestMatchers("/api/auth/**").permitAll()              // anyone, no token needed
.requestMatchers(HttpMethod.GET, "/api/courses/**").permitAll()
.requestMatchers("/api/admin/**").hasRole("ADMIN")         // must be logged in AND have ADMIN role
.anyRequest().authenticated()                              // everything else just needs to be logged in
```
You'll also see `@PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")` on methods like `createCourse`/`updateCourse` in `CourseController` — same idea, but checked at the method level instead of the URL level.

## How the database connects (Entities + Repositories)

`Course.java` is a plain Java class with annotations that map it to the `courses` table:
```java
@Entity
@Table(name = "courses")
public class Course {
    @Id
    @GeneratedValue(...)
    private Long id;            // maps to courses.id

    @Column(name = "is_premium", nullable = false)
    private boolean premium = false;   // Java field "premium" -> DB column "is_premium"
}
```
This is **Hibernate/JPA** — it lets you work with Java objects and never write raw SQL for basic CRUD. `CourseRepository extends JpaRepository<Course, Long>` automatically gets `.save()`, `.findById()`, `.findAll()`, `.deleteById()` for free, plus any custom-named finder methods like the one above.

## Startup behavior (DataSeeder)

`DataSeeder.java` implements `CommandLineRunner`, so Spring Boot runs it **automatically once, right after the app starts**. It checks `if (courseRepository.count() > 0) return;` — i.e. "only seed starter courses if the table is currently empty." This is why the courses table wasn't fully empty even before any manual seed script ran.

## Folder cheat-sheet

```
backend/src/main/java/com/sqlmasterpro/
├── config/        SecurityConfig, DataSeeder — app-wide setup, runs at startup
├── controller/     REST endpoints (@RestController) — one per feature area
├── exception/      Custom errors (ResourceNotFoundException, BadRequestException, etc.)
├── model/
│   ├── entity/     JPA entities — one class per DB table
│   ├── dto/        Request/response shapes sent over the wire (not DB tables)
│   └── enums/       e.g. DifficultyLevel
├── repository/     JpaRepository interfaces — DB access, no manual SQL
├── security/       JWT filter, token provider, user details service
├── service/         Interfaces — what each feature can do
└── service/impl/    Actual implementation of the business logic
```

## One-sentence summary

A request comes in → the **security filter** checks the token → the **controller** receives it and delegates → the **service** applies business rules → the **repository** reads/writes the **entity** objects, which Hibernate translates into SQL against PostgreSQL → the result flows back up through the same layers as JSON.

---
*DB credentials (local dev): `postgres/root`, database `SQLMasterPro`, port `5432`.*
