import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

export interface ConfirmOptions {
  title?: string;
  text: string;
  confirmText?: string;
  cancelText?: string;
  icon?: SweetAlertIcon;
  danger?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {

  async confirm(options: ConfirmOptions): Promise<boolean> {
    const danger = options.danger ?? false;
    const result = await Swal.fire({
      title: options.title ?? 'Are you sure?',
      text: options.text,
      icon: options.icon ?? (danger ? 'warning' : 'question'),
      width: 380,
      showCancelButton: true,
      confirmButtonText: options.confirmText ?? 'Yes, continue',
      cancelButtonText: options.cancelText ?? 'Cancel',
      confirmButtonColor: danger ? '#ef4444' : '#667eea',
      cancelButtonColor: '#9ca3af',
      reverseButtons: true,
      focusCancel: danger,
      customClass: {
        popup: 'smp-swal-popup',
        icon: 'smp-swal-icon',
        title: 'smp-swal-title',
        htmlContainer: 'smp-swal-text',
        actions: 'smp-swal-actions',
        confirmButton: 'smp-swal-btn',
        cancelButton: 'smp-swal-btn'
      }
    });
    return result.isConfirmed;
  }

  confirmDelete(itemName: string, extraText?: string): Promise<boolean> {
    return this.confirm({
      title: `Delete "${itemName}"?`,
      text: extraText ?? 'This cannot be undone.',
      icon: 'warning',
      confirmText: 'Delete',
      danger: true
    });
  }

  async toast(message: string, icon: SweetAlertIcon = 'success'): Promise<void> {
    await Swal.fire({
      toast: true,
      position: 'top-end',
      icon,
      title: message,
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true
    });
  }
}
