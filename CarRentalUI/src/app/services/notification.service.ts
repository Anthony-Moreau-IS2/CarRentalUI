import { Injectable, signal } from '@angular/core';

export interface Notification {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
    private nextId = 0;
    private readonly _notifications = signal<Notification[]>([]);
    readonly notifications = this._notifications.asReadonly();

    success(message: string): void {
        this.addNotification(message, 'success');
    }

    error(message: string): void {
        this.addNotification(message, 'error');
    }

    info(message: string): void {
        this.addNotification(message, 'info');
    }

    dismiss(id: number): void {
        this._notifications.update(list => list.filter(n => n.id !== id));
    }

    private addNotification(message: string, type: Notification['type']): void {
        const id = this.nextId++;
        this._notifications.update(list => [...list, { id, message, type }]);
        setTimeout(() => this.dismiss(id), 5000);
    }
}
