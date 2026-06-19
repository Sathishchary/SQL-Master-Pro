import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './core/services/auth.service';
import { FooterComponent } from './shared/components/footer/footer.component';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

const THEMES = ['light', 'dark'];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavbarComponent, FooterComponent, LoadingComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currentTheme = 'light';
  showFooter = true;
  showNavbar = true;

  get themeClass(): string {
    return this.currentTheme === 'light' ? '' : `${this.currentTheme}-theme`;
  }

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    const saved = localStorage.getItem('sql-master-theme') || 'light';
    this.currentTheme = THEMES.includes(saved) ? saved : 'light';
    this.applyTheme();

    this.updateLayout(this.router.url);
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e) => {
      this.updateLayout((e as NavigationEnd).urlAfterRedirects);
    });
  }

  selectTheme(theme: string): void {
    if (!THEMES.includes(theme)) return;
    this.currentTheme = theme;
    localStorage.setItem('sql-master-theme', theme);
    this.applyTheme();
  }

  private updateLayout(url: string): void {
    this.showNavbar = !url.startsWith('/admin');
    this.showFooter = !url.startsWith('/playground') && !url.startsWith('/admin');
  }

  private applyTheme(): void {
    document.body.className = '';
    if (this.currentTheme !== 'light') {
      document.body.classList.add(`${this.currentTheme}-theme`);
    }
  }
}
