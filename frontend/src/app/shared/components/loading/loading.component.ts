import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  template: `
    @if (loadingService.isLoading()) {
    <mat-progress-bar
      mode="indeterminate" class="global-loader">
    </mat-progress-bar>
    }
  `,
  styles: [`.global-loader { position: fixed; top: 0; left: 0; right: 0; z-index: 9999; }`]
})
export class LoadingComponent {
  constructor(public loadingService: LoadingService) {}
}
