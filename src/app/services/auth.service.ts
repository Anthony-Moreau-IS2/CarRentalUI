import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly router = inject(Router);
    private readonly apiUrl = `${environment.apiUrl}/auth`;

    private readonly currentUser = signal<User | null>(null);
    readonly user = this.currentUser.asReadonly();
    readonly isAuthenticated = computed(() => !!this.currentUser());

    constructor() {
        this.loadUserFromStorage();
    }

    login(credentials: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
            tap(response => {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                this.currentUser.set(response.user);
            })
        );
    }

    register(data: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
            tap(response => {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                this.currentUser.set(response.user);
            })
        );
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.currentUser.set(null);
        this.router.navigate(['/login']);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    getCurrentUser(): User | null {
        return this.currentUser();
    }

    private loadUserFromStorage(): void {
        const userJson = localStorage.getItem('user');
        if (userJson) {
            try {
                this.currentUser.set(JSON.parse(userJson));
            } catch {
                this.logout();
            }
        }
    }
}
