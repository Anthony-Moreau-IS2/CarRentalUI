import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { Utilisateur, LoginRequest, LoginResponse } from '../models/utilisateur.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly router = inject(Router);
    private readonly apiUrl = `${environment.apiUrl}/auth`;

    private readonly currentUser = signal<Utilisateur | null>(null);
    readonly user = this.currentUser.asReadonly();
    readonly isAuthenticated = computed(() => !!this.currentUser());

    constructor() {
        this.loadUserFromStorage();
    }

    login(credentials: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
            tap(response => {
                // Pour simplifier, on stocke un token fictif si le backend n'en renvoie pas,
                // ou on pourrait adapter l'interceptor pour ne plus envoyer de Bearer token s'il utilise des cookies.
                // Dans le cas de cette API, on dirait qu'elle retourne {message, utilisateur}.
                localStorage.setItem('token', 'dummy-token');
                localStorage.setItem('user', JSON.stringify(response.utilisateur));
                this.currentUser.set(response.utilisateur);
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

    getCurrentUser(): Utilisateur | null {
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
