import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicule } from '../models/vehicule.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class VehiculeService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/vehicles`;

    getVehicules(): Observable<Vehicule[]> {
        return this.http.get<Vehicule[]>(this.apiUrl);
    }

    getVehiculeById(id: number): Observable<Vehicule> {
        return this.http.get<Vehicule>(`${this.apiUrl}/${id}`);
    }

    createVehicule(vehicule: Partial<Vehicule>): Observable<Vehicule> {
        return this.http.post<Vehicule>(this.apiUrl, vehicule);
    }

    updateVehicule(id: number, vehicule: Partial<Vehicule>): Observable<Vehicule> {
        return this.http.put<Vehicule>(`${this.apiUrl}/${id}`, vehicule);
    }

    deleteVehicule(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
