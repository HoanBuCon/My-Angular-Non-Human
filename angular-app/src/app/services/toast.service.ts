import { Injectable } from '@angular/core';

export type ToastType = 'error' | 'success' | 'warning' | 'info';

const ICONS: Record<ToastType, string> = {
  error: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`,
  success: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`,
  warning: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  info: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
};

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private container: HTMLElement | null = null;

  private getOrCreateContainer(): HTMLElement {
    if (!this.container || !document.body.contains(this.container)) {
      let container = document.getElementById('toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
      }
      this.container = container;
    }
    return this.container;
  }

  show(message: string, type: ToastType = 'error', duration: number = 3500): void {
    const container = this.getOrCreateContainer();

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
      <div class="toast__icon-box">
        ${ICONS[type] || ICONS.error}
      </div>
      <div class="toast__content">
        <p class="toast__message">${message}</p>
      </div>
    `;

    container.appendChild(toast);

    const timer = setTimeout(() => {
      this.dismiss(toast);
    }, duration);

    toast.addEventListener('click', () => {
      clearTimeout(timer);
      this.dismiss(toast);
    });
  }

  error(message: string, duration: number = 3500): void {
    this.show(message, 'error', duration);
  }

  success(message: string, duration: number = 3500): void {
    this.show(message, 'success', duration);
  }

  warning(message: string, duration: number = 3500): void {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration: number = 3500): void {
    this.show(message, 'info', duration);
  }

  private dismiss(toast: HTMLElement): void {
    if (!toast || toast.classList.contains('toast--hiding')) return;
    toast.classList.add('toast--hiding');
    toast.addEventListener('animationend', () => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    });
  }
}
