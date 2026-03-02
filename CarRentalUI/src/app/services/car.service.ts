import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Car } from '../models/car.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CarService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/cars`;

    getCars(): Observable<Car[]> {
        return this.http.get<Car[]>(this.apiUrl);
    }

    getCarById(id: number): Observable<Car> {
        return this.http.get<Car>(`${this.apiUrl}/${id}`);
    }

    searchCars(filters: {
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        available?: boolean;
        transmission?: string;
        fuelType?: string;
    }): Observable<Car[]> {
        let params = new HttpParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                params = params.set(key, value.toString());
            }
        });
        return this.http.get<Car[]>(`${this.apiUrl}/search`, { params });
    }

    getCategories(): Observable<string[]> {
        return this.http.get<string[]>(`${this.apiUrl}/categories`);
    }
}
