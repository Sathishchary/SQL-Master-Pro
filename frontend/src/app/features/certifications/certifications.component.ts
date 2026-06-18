import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../core/services/api.service';
import { Certificate } from '../../core/models/models';

@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  template: `
    <div class="certs-container">
      <div class="certs-header">
        <h1>🎓 My Certificates</h1>
        <p>Your earned SQL certifications. Share them on LinkedIn and showcase your skills.</p>
      </div>
      @if (!certificates.length) {
        <div class="empty-state">
          <div class="empty-icon">🎓</div>
          <h3>No certificates yet</h3>
          <p>Complete a full SQL module to earn your first certificate!</p>
          <a routerLink="/learn" mat-raised-button color="primary">Start Learning</a>
        </div>
      }
      <div class="certs-grid">
        @for (cert of certificates; track cert.certificateNumber) {
          <div class="cert-card">
            <div class="cert-preview">
              <div class="cert-logo">⚡ SQL Master Pro</div>
              <div class="cert-title">Certificate of Completion</div>
              <div class="cert-course">{{ cert.course?.title }}</div>
              <div class="cert-number">{{ cert.certificateNumber }}</div>
              <div class="cert-date">Issued: {{ cert.issuedAt | date:'longDate' }}</div>
            </div>
            <div class="cert-actions">
              <button mat-raised-button color="primary" (click)="downloadCert(cert)">
                <mat-icon>download</mat-icon> Download PDF
              </button>
              <button mat-stroked-button (click)="verifyCert(cert.certificateNumber)">
                <mat-icon>verified</mat-icon> Verify
              </button>
              <button mat-stroked-button (click)="shareLinkedIn(cert)">
                <mat-icon>share</mat-icon> LinkedIn
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .certs-container { max-width: 1000px; margin: 0 auto; padding: 40px 24px; }
    .certs-header { text-align: center; margin-bottom: 40px;
      h1 { font-size: 36px; font-weight: 900; } p { color: var(--text-secondary); }
    }
    .empty-state { text-align: center; padding: 60px 24px;
      .empty-icon { font-size: 64px; margin-bottom: 16px; }
      h3 { font-size: 20px; font-weight: 700; color: var(--text-primary); } p { color: var(--text-secondary); margin-bottom: 24px; }
    }
    .certs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 24px; }
    .cert-card { border: 2px solid var(--border); border-radius: 16px; overflow: hidden; }
    .cert-preview { background: linear-gradient(135deg, #0f0c29, #302b63);
      color: white; padding: 40px; text-align: center;
      .cert-logo { font-size: 18px; font-weight: 800; color: #667eea; margin-bottom: 12px; }
      .cert-title { font-size: 14px; letter-spacing: 2px; text-transform: uppercase; opacity: 0.7; margin-bottom: 20px; }
      .cert-course { font-size: 22px; font-weight: 800; margin-bottom: 16px; }
      .cert-number { font-family: monospace; font-size: 13px; color: #a0aec0; margin-bottom: 8px; }
      .cert-date { font-size: 12px; color: #a0aec0; }
    }
    .cert-actions { padding: 16px 20px; display: flex; gap: 8px; background: var(--surface);
      button { flex: 1; border-radius: 8px !important; }
    }
  `]
})
export class CertificationsComponent implements OnInit {
  certificates: Certificate[] = [];

  constructor(private apiService: ApiService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.apiService.getMyCertificates().subscribe({
      next: (res) => { if (res.success) this.certificates = res.data; }
    });
  }

  downloadCert(cert: Certificate): void {
    this.snackBar.open('Generating PDF certificate...', 'Close', { duration: 3000 });
  }

  verifyCert(certNumber: string): void {
    window.open(`/certificates/verify/${certNumber}`, '_blank');
  }

  shareLinkedIn(cert: Certificate): void {
    const url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.origin + '/certificates/verify/' + cert.certificateNumber)}&title=${encodeURIComponent('SQL Certification - SQL Master Pro')}`;
    window.open(url, '_blank');
  }
}
