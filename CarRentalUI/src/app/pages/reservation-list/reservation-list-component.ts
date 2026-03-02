import { Component, inject, OnInit, signal } from '@angular/core';
import { ReservationService } from '../../services/reservation.service';
import { Reservation } from '../../models/reservation.model';
import { LoadingSpinner } from '../../shared/loading-spinner/loading-spinner-component';

@Component({
    selector: 'app-reservation-list',
    standalone: true,
    imports: [LoadingSpinner],
    templateUrl: './reservation-list-component.html',
    styleUrl: './reservation-list-component.css'
})
export class ReservationList implements OnInit {
    private readonly reservationService = inject(ReservationService);
    protected readonly reservations = signal<Reservation[]>([]);
    protected readonly loading = signal(true);

    ngOnInit(): void {
        this.reservationService.getReservations().subscribe({
            next: (data) => {
                this.reservations.set(data);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    cancelReservation(id: number): void {
        this.reservationService.cancelReservation(id).subscribe({
            next: () => {
                this.reservations.update(list =>
                    list.map(r => r.id === id ? { ...r, status: 'annulee' as const } : r)
                );
            }
        });
    }
}
