import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule, MatButtonModule, MatIconModule],
  template: `
    <div class="not-found">
      <div class="not-found-content">
        <div class="error-code">404</div>
        <div class="error-emoji">🗄️</div>
        <h1>Page Not Found</h1>
        <p>The page you're looking for doesn't exist or the SQL query returned no results.</p>
        <pre class="sql-error">SELECT * FROM pages WHERE url = '{{ url }}';
-- Error: 0 rows returned</pre>
        <a routerLink="/" mat-raised-button color="primary">
          <mat-icon>home</mat-icon> Back to Home
        </a>
      </div>
    </div>
  `,
  styles: [`
    .not-found { display: flex; align-items: center; justify-content: center;
      min-height: calc(100vh - 64px); text-align: center; padding: 24px;
    }
    .error-code { font-size: 120px; font-weight: 900; color: var(--border); line-height: 1; }
    .error-emoji { font-size: 60px; margin: 16px 0; }
    h1 { font-size: 32px; font-weight: 800; margin-bottom: 12px; }
    p { color: var(--text-secondary); margin-bottom: 24px; max-width: 400px; }
    .sql-error { background: #1e1e2e; color: #e0e0e0; padding: 16px 24px; border-radius: 12px;
      font-family: 'JetBrains Mono', monospace; font-size: 13px; margin-bottom: 24px;
      text-align: left;
    }
  `]
})
export class NotFoundComponent {
  url = window.location.pathname;
}
