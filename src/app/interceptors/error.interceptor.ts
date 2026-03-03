import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const notificationService = inject(NotificationService);

    return next(req).pipe(
        catchError(error => {
            switch (error.status) {
                case 401:
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    router.navigate(['/login']);
                    notificationService.error('Session expirée. Veuillez vous reconnecter.');
                    break;
                case 403:
                    notificationService.error('Accès refusé.');
                    break;
                case 404:
                    notificationService.error('Ressource introuvable.');
                    break;
                case 500:
                    notificationService.error('Erreur serveur. Veuillez réessayer plus tard.');
                    break;
                default:
                    notificationService.error('Une erreur est survenue.');
            }
            return throwError(() => error);
        })
    );
};
