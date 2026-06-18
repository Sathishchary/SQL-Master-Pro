import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule, MatButtonModule, MatIconModule, MatDividerModule],
  template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-brand">
          <div class="brand-logo">⚡ SQL Master Pro</div>
          <p>The most comprehensive SQL learning platform. From beginner to expert, master SQL with interactive lessons, real database execution, and expert guidance.</p>
          <div class="social-links">
            <a href="#" mat-icon-button title="Twitter"><mat-icon>alternate_email</mat-icon></a>
            <a href="#" mat-icon-button title="LinkedIn"><mat-icon>business</mat-icon></a>
            <a href="#" mat-icon-button title="GitHub"><mat-icon>code</mat-icon></a>
            <a href="#" mat-icon-button title="YouTube"><mat-icon>play_circle</mat-icon></a>
          </div>
        </div>

        <div class="footer-links">
          <div class="link-group">
            <h4>Learn</h4>
            <a routerLink="/learn">SQL Courses</a>
            <a routerLink="/playground">SQL Playground</a>
            <a routerLink="/quiz">Quiz Bank</a>
            <a routerLink="/challenges">Challenges</a>
            <a routerLink="/interview-prep">Interview Prep</a>
          </div>
          <div class="link-group">
            <h4>Resources</h4>
            <a routerLink="/blog">Blog</a>
            <a routerLink="/certificates">Certificates</a>
            <a routerLink="/pricing">Pricing</a>
          </div>
          <div class="link-group">
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Contact</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>

      <mat-divider></mat-divider>
      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} SQL Master Pro. All rights reserved.</p>
        <p class="tech-stack">Built with Angular 20 + Spring Boot 3 + PostgreSQL</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: #1a1a2e; color: #a0aec0; margin-top: auto;
      padding: 60px 0 24px;
    }
    .footer-content {
      max-width: 1200px; margin: 0 auto; padding: 0 24px;
      display: grid; grid-template-columns: 1fr 2fr; gap: 60px;
      @media (max-width: 768px) { grid-template-columns: 1fr; }
    }
    .brand-logo { font-size: 24px; font-weight: 800; color: white; margin-bottom: 16px; }
    p { line-height: 1.7; font-size: 14px; }
    .social-links { display: flex; gap: 8px; margin-top: 16px;
      a { color: #a0aec0; &:hover { color: #667eea; } }
    }
    .footer-links { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px;
      @media (max-width: 600px) { grid-template-columns: 1fr 1fr; }
    }
    .link-group h4 { color: white; font-size: 14px; font-weight: 600;
      margin-bottom: 16px; text-transform: uppercase; letter-spacing: 1px; }
    .link-group a { display: block; color: #a0aec0; text-decoration: none;
      font-size: 14px; margin-bottom: 10px; transition: color 0.2s;
      &:hover { color: #667eea; }
    }
    mat-divider { border-color: #2d3748; margin: 40px 24px 24px; }
    .footer-bottom { max-width: 1200px; margin: 0 auto; padding: 0 24px;
      display: flex; justify-content: space-between; align-items: center;
      font-size: 13px;
      @media (max-width: 600px) { flex-direction: column; gap: 8px; }
    }
    .tech-stack { color: #667eea; }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
