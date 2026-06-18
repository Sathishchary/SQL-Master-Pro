# SQL Master Pro — Frontend Logic Guide (Beginner-Friendly)

A plain-English walkthrough of how the Angular frontend works, for whenever you need a refresher. Pairs with [BACKEND_GUIDE.md](BACKEND_GUIDE.md).

## The big picture

The frontend is built with **Angular 20** using **standalone components** (no `NgModule` files — each component declares its own imports). Think of the flow like this:

```
You click a button  →  Component  →  Service  →  HTTP call to backend  →  Component updates  →  Screen re-renders
```

| Concept | Folder | Job |
|---|---|---|
| **Component** | `features/`, `shared/components/` | A piece of UI (HTML + CSS + logic) — one per page/widget |
| **Service** | `core/services/` | Talks to the backend API, holds shared state |
| **Guard** | `core/guards/` | Blocks navigation to a route if a condition isn't met (e.g. not logged in) |
| **Interceptor** | `core/interceptors/` | Automatically modifies every outgoing HTTP request/response |
| **Model** | `core/models/` | TypeScript interfaces describing the shape of data (mirrors backend DTOs) |
| **Routes** | `app.routes.ts` | Maps URLs (e.g. `/dashboard`) to components |

## How a page loads — routing

[app.routes.ts](frontend/src/app/app.routes.ts) is the map of the whole site:

```typescript
{
  path: 'dashboard',
  canActivate: [authGuard],
  loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
}
```

- `path: 'dashboard'` — when the browser URL is `/dashboard`...
- `loadComponent: () => import(...)` — ...Angular **lazy-loads** that component's code (downloads it only when needed, not all upfront — keeps the app fast).
- `canActivate: [authGuard]` — before showing the page, Angular runs `authGuard`. If it returns `false`, the page never loads.

`authGuard` ([auth.guard.ts](frontend/src/app/core/guards/auth.guard.ts)):
```typescript
export const authGuard: CanActivateFn = (route, state) => {
  if (authService.isAuthenticated()) return true;
  sessionStorage.setItem('returnUrl', state.url);  // remember where they wanted to go
  router.navigate(['/auth/login']);                 // bounce to login instead
  return false;
};
```
Simple gatekeeper: logged in → let them through; not logged in → redirect to login (and remember where they were headed, so login can send them back).

## Components — the building blocks

Every component (e.g. [login.component.ts](frontend/src/app/features/auth/login/login.component.ts)) has 3 parts bundled in one file:
1. **`template`** — the HTML (what's on screen)
2. **`styles`** — the CSS (how it looks)
3. **The class body** — the TypeScript logic (what happens when you interact)

```typescript
@Component({
  selector: 'app-login',
  standalone: true,                 // doesn't need an NgModule
  imports: [CommonModule, ReactiveFormsModule, ...],  // only imports what THIS component needs
  template: `<form [formGroup]="loginForm" (ngSubmit)="onSubmit()"> ... </form>`,
})
export class LoginComponent {
  loginForm: FormGroup;             // a "reactive form" — tracks field values + validation

  constructor(private fb: FormBuilder, private authService: AuthService, ...) {
    this.loginForm = this.fb.group({
      emailOrUsername: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    const { emailOrUsername, password } = this.loginForm.value;
    this.authService.login(emailOrUsername, password).subscribe({
      next: (res) => { /* success — redirect */ },
      error: (err) => { /* show error message */ }
    });
  }
}
```

- `[formGroup]="loginForm"` binds the HTML `<form>` to the TypeScript `loginForm` object — Angular keeps them in sync automatically.
- `(ngSubmit)="onSubmit()"` — when the form is submitted, call `onSubmit()`.
- `Validators.required` — Angular won't let the form be "valid" until that field has a value. The submit button is disabled (`[disabled]="loginForm.invalid"`) until then.
- `.subscribe({ next, error })` — HTTP calls in Angular return **Observables** (a stream you "subscribe" to). `next` runs on success, `error` runs on failure — similar to a `.then()/.catch()` you may have seen with Promises, but able to handle multiple/streaming values.

## Services — where backend calls actually happen

[auth.service.ts](frontend/src/app/core/services/auth.service.ts) is the single place that knows how to talk to `/api/auth/*`:

```typescript
@Injectable({ providedIn: 'root' })   // one shared instance for the whole app
export class AuthService {
  private _currentUser = signal<AuthResponse | null>(this.getStoredUser());
  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this._currentUser());

  login(emailOrUsername: string, password: string) {
    return this.http.post<ApiResponse<AuthResponse>>(`${environment.apiUrl}/auth/login`, { emailOrUsername, password })
      .pipe(tap(res => { if (res.success) this.storeAuth(res.data); }));
  }

  private storeAuth(auth: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, auth.accessToken);   // save JWT token from backend
    localStorage.setItem(this.USER_KEY, JSON.stringify(auth));
    this._currentUser.set(auth);                               // update the "live" signal
  }
}
```

Key ideas:
- **`signal`** — Angular's reactive state container (new in recent Angular versions). Any component that reads `authService.currentUser()` automatically re-renders when it changes — no manual "refresh" needed.
- **`localStorage`** — the browser's persistent storage. The JWT token is saved here so that refreshing the page (or closing/reopening the browser) doesn't log you out.
- `@Injectable({ providedIn: 'root' })` means Angular creates **one single instance** of `AuthService` for the entire app — every component that injects it shares the same state (so login in one place is instantly visible everywhere).

## Interceptors — automatic request/response handling

[auth.interceptor.ts](frontend/src/app/core/interceptors/auth.interceptor.ts) runs on **every single HTTP request** the app makes, without you calling it manually:

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = authService.getToken();
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })  // attach the JWT
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/')) {
        // token expired — try to silently get a new one and retry the original request
        return authService.refreshToken().pipe(
          switchMap(() => next(req.clone({ setHeaders: { Authorization: `Bearer ${authService.getToken()}` } }))),
          catchError(() => { authService.logout(); return throwError(() => error); })
        );
      }
      return throwError(() => error);
    })
  );
};
```

This is why individual components/services never manually add the `Authorization` header — it's stamped onto every outgoing request automatically here. If the backend says "401 Unauthorized" (token expired), it tries to refresh the token once and retries; if that also fails, it logs the user out.

## How a typical feature works end-to-end (example: Login)

1. User types credentials into `LoginComponent`'s form, clicks **Sign In**.
2. `onSubmit()` calls `authService.login(...)`.
3. `AuthService` sends `POST /api/auth/login` via `HttpClient`.
4. `authInterceptor` lets this request through untouched (no token needed for login itself).
5. Backend responds with a JWT + user info (see [BACKEND_GUIDE.md](BACKEND_GUIDE.md)).
6. `AuthService.storeAuth()` saves the token to `localStorage` and updates the `currentUser` signal.
7. `LoginComponent`'s `.subscribe({ next })` fires, redirects to `/dashboard` (or wherever the user originally tried to go, via `returnUrl`).
8. Every future request automatically carries the saved token, thanks to `authInterceptor`.

## Folder cheat-sheet

```
frontend/src/app/
├── core/
│   ├── services/      Shared logic + backend API calls (one per domain: auth, api, loading)
│   ├── guards/         Route protection (auth.guard, admin.guard, guest.guard)
│   ├── interceptors/    Auto-run on every HTTP request (attach token, show loading spinner)
│   └── models/          TypeScript interfaces matching backend DTOs
├── features/            One folder per page/feature (auth, learning, playground, quiz, admin, ...)
│   └── <feature>/<page>/<page>.component.ts   — standalone component, often inline template+styles
├── shared/
│   ├── components/      Reusable UI used across features (navbar, sidebar, code-editor, loading spinner)
│   └── pipes/            Custom template transforms (e.g. formatting dates/numbers)
└── app.routes.ts         The full URL → component map
```

## Key Angular concepts used throughout this app

| Concept | What it means here |
|---|---|
| **Standalone component** | No `NgModule` — each component lists its own `imports: [...]` |
| **Signal** (`signal()`, `computed()`) | Reactive variable; UI auto-updates when it changes |
| **Reactive Forms** (`FormGroup`, `FormBuilder`) | Form state + validation managed in TypeScript, not just HTML |
| **Observable** (`.subscribe()`, RxJS operators like `tap`, `catchError`, `switchMap`) | A stream of async values — how HTTP responses are handled |
| **Lazy loading** (`loadComponent: () => import(...)`) | Only download a page's code when the user actually navigates to it |
| **Guard** (`CanActivateFn`) | A function that returns true/false to allow/block navigation |
| **Interceptor** (`HttpInterceptorFn`) | Middleware that wraps every HTTP request/response |

## One-sentence summary

A URL match triggers a lazy-loaded **component** (after passing any **guards**) → the component calls a **service** → the service fires an HTTP request (auto-stamped with the JWT by an **interceptor**) → the backend responds → the service updates a **signal** → every component watching that signal re-renders automatically.
