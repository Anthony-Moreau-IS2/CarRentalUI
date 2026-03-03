import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    @if (visible()) {
      <div class="dialog-overlay" (click)="cancel()">
        <div class="dialog-card animate-slide-up" (click)="$event.stopPropagation()">
          <h3>{{ title() }}</h3>
          <p>{{ message() }}</p>
          <div class="dialog-actions">
            <button class="btn btn--secondary" (click)="cancel()">Annuler</button>
            <button class="btn btn--primary" (click)="confirm()">Confirmer</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .dialog-overlay {
      position: fixed;
      inset: 0;
      background: var(--color-overlay);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: var(--z-overlay);
      backdrop-filter: blur(4px);
    }
    .dialog-card {
      background: var(--color-surface);
      border-radius: var(--radius-xl);
      padding: var(--space-xl);
      max-width: 400px;
      width: 90%;
      box-shadow: var(--shadow-xl);
    }
    h3 {
      font-size: var(--font-size-xl);
      font-weight: 700;
      margin-bottom: var(--space-sm);
      color: var(--color-text);
    }
    p {
      color: var(--color-text-secondary);
      font-size: var(--font-size-md);
      margin-bottom: var(--space-lg);
    }
    .dialog-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
    }
  `]
})
export class ConfirmDialog {
  visible = input(false);
  title = input('Confirmation');
  message = input('Êtes-vous sûr ?');
  confirmed = output<void>();
  cancelled = output<void>();

  confirm(): void {
    this.confirmed.emit();
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
