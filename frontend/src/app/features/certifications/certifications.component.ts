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
  templateUrl: './certifications.component.html',
  styleUrls: ['./certifications.component.css']
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
