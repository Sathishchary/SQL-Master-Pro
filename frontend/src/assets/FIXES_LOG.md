# SQL Playground — Fixes Log (Beginner-Friendly)

A plain-English record of every bug fixed in the SQL Playground feature, why it happened, and how it was fixed. Read this whenever you forget why something looks/works the way it does.

---

## 1. Footer was covering the query results table

**What you saw:** On the `/playground` page, the site-wide footer rendered at the bottom and pushed/overlapped the results table, making it hard to see your query output.

**Why it happened:** `app.component.ts` (the root component wrapping every page) always rendered `<app-footer>` no matter which page you were on. The Playground page is meant to be a full-height, app-like screen — it was never designed to have a footer at all.

**Fix:** Added a `showFooter` flag that watches the current route. It's `true` everywhere except when the URL starts with `/playground`.

```typescript
// app.component.ts
this.showFooter = !this.router.url.startsWith('/playground');
this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e) => {
  this.showFooter = !(e as NavigationEnd).urlAfterRedirects.startsWith('/playground');
});
```
```html
@if (showFooter) {
  <app-footer></app-footer>
}
```

---

## 2. Unclear emoji icon in the empty state

**What you saw:** Before running a query, the empty state showed a 🗄️ emoji above "Ready to execute SQL" that looked broken/blurry rather than like a real icon.

**Why it happened:** It was a raw emoji character dropped into a styled box — emoji rendering varies a lot between OS/browsers and often looks low-quality or like a missing-icon placeholder.

**Fix:** Just removed the `<div class="empty-icon">🗄️</div>` element (and its now-unused CSS rule). The heading text alone reads cleanly without it.

---

## 3. SQL editor's light/dark theme toggle did nothing

**What you saw:** There was a moon/sun toggle button on the editor, but clicking it didn't visibly change anything.

**Why it happened:** The toggle's logic was already correct (`darkMode` flag + `[class.dark]="darkMode"` binding worked fine) — but the CSS only ever defined **one** color palette (the dark one). So whether `dark` class was added or not, the editor looked identical. There was no actual "light theme" to switch *to*.

**Fix:** Wrote real light-theme colors as the default (`.editor-wrapper`, `.sql-editor`, etc.), then moved the original dark colors into a `.editor-wrapper.dark { ... }` block that only applies when the dark class is present. Now toggling actually switches between two real palettes.

---

## 4. Empty state forced unnecessary scrolling

**What you saw:** The "Ready to execute SQL" message and table-chip list needed scrolling to see fully, even though there was visible empty space.

**Why it happened:** `.results-section` (the container) just let content overflow and scroll by default, and `.empty-state` had large fixed padding (`60px 24px`) that pushed content below the visible area on smaller screens.

**Fix:** Made `.results-section` a flex column (`display: flex; flex-direction: column; min-height: 0;`) and centered `.empty-state` inside it using `margin: auto`, with smaller padding. It now sits centered in whatever space is available, no forced scroll.

---

## 5. Saved & History tabs were completely blank

**What you saw:** Clicking the "Saved" or "History" tabs in the sidebar showed... nothing. No error, no "empty" message, just blank space.

**Why it happened — two layers:**

**Layer A (frontend, cosmetic):** The component code that loads this data had no `error` handler:
```typescript
// before
this.apiService.getSQLHistory().subscribe({
  next: (res) => { if (res.success) this.history = res.data.content; }
  // no error handler — failures vanish silently!
});
```
If the request failed, RxJS just swallowed the error. Nothing told you it failed — the tab just stayed empty forever, identical to "it loaded fine, you just have nothing saved yet."

**Layer B (backend, the real bug):** The requests were actually crashing with an HTTP 500 error every single time. Here's why:

Each saved query / history row (`SqlExecution`) has a link back to the user who ran it:
```java
@ManyToOne(fetch = FetchType.LAZY)
private User user;
```
`LAZY` means "don't load the real `User` data unless something explicitly asks for it" — a normal performance optimization. Until asked, that field holds a lightweight **placeholder object** (a "proxy"), not real data — think of it like a coat-check ticket instead of the actual coat.

When the backend converts this row to JSON to send to the browser, it tries to convert *every* field — including that placeholder `user` ticket. The JSON converter (Jackson) doesn't know how to turn "a placeholder ticket" into JSON (it only knows how to convert a real `User`), so it throws an error and the whole request fails with a 500.

This only broke the **history**, **saved list**, and **save/favorite-toggle** endpoints — they were the only three places in the whole backend that returned this `SqlExecution` object directly, ticket and all. Running a query itself worked fine because that response never includes the `user` field.

**Fix (two parts):**

1. **Backend** — told the JSON converter to skip that field entirely, since the frontend never needed it anyway:
   ```java
   // SqlExecution.java
   @ManyToOne(fetch = FetchType.LAZY)
   @JoinColumn(name = "user_id")
   @JsonIgnore   // <-- added: never try to serialize this
   private User user;
   ```

2. **Frontend** — added proper loading/empty/error states so this class of bug is visible next time instead of silently blank:
   ```typescript
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
   ```
   Plus template states for loading (spinner), empty ("No queries executed yet"), and populated (the actual list).

**Lesson for the future:** any time a JPA entity with a `LAZY` relationship gets returned directly as a REST response (instead of being converted to a clean DTO first), watch out for this exact crash. The safer long-term pattern is to never return entities directly — always map them to a plain DTO that only has the fields the frontend actually needs.

---

## One-sentence summary of the whole session

Fixed four frontend-only cosmetic/layout bugs in the Playground (footer overlap, broken-looking icon, non-functional theme toggle, forced scrolling), then traced the "Saved/History tabs are blank" report all the way down to a real backend crash — Jackson choking on an unserialized lazy-loaded `User` proxy — and fixed it at the source with `@JsonIgnore`, plus added frontend error/empty states so future backend failures show up clearly instead of vanishing silently.
