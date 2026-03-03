import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReservationService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/reservations`;

    getReservations(): Observable<Reservation[]> {
        return this.http.get<Reservation[]>(this.apiUrl);
    }

    getReservationById(id: number): Observable<Reservation> {
        return this.http.get<Reservation>(`${this.apiUrl}/${id}`);
    }

    createReservation(reservation: Partial<Reservation>): Observable<Reservation> {
        return this.http.post<Reservation>(this.apiUrl, reservation);
    }

    cancelReservation(id: number): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}/cancel`, {});
    }
}
