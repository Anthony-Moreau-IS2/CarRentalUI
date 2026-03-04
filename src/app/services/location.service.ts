import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Location } from '../models/location.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LocationService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/locations`;

    getLocations(): Observable<Location[]> {
        return this.http.get<Location[]>(this.apiUrl);
    }

    getLocationById(id: number): Observable<Location> {
        return this.http.get<Location>(`${this.apiUrl}/${id}`);
    }

    createLocation(location: Partial<Location>): Observable<Location> {
        return this.http.post<Location>(this.apiUrl, location);
    }

    closeLocation(id: number): Observable<Location> {
        return this.http.post<Location>(`${this.apiUrl}/${id}/close`, {});
    }

    deleteLocation(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
