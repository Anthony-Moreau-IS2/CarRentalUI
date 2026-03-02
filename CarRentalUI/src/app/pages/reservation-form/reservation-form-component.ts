import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from '../../services/reservation.service';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-reservation-form',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './reservation-form-component.html',
    styleUrl: './reservation-form-component.css'
})
export class ReservationForm {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly reservationService = inject(ReservationService);
    private readonly notificationService = inject(NotificationService);

    protected readonly carId = signal(Number(this.route.snapshot.queryParamMap.get('carId') || 0));
    protected readonly startDate = signal('');
    protected readonly endDate = signal('');
    protected readonly submitting = signal(false);

    submit(): void {
        if (!this.startDate() || !this.endDate()) return;
        this.submitting.set(true);

        this.reservationService.createReservation({
            carId: this.carId(),
            startDate: this.startDate(),
            endDate: this.endDate()
        }).subscribe({
            next: () => {
                this.notificationService.success('Réservation créée avec succès !');
                this.router.navigate(['/reservations']);
            },
            error: () => this.submitting.set(false)
        });
    }
}
