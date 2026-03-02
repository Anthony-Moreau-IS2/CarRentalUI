# Instructions — Création de l'Architecture Standalone Angular 21

Guide complet et reproductible de toutes les étapes suivies pour construire l'architecture frontend du projet **CarRentalUI**.

---

## Prérequis

- Node.js v18+ installé
- Angular CLI v21+
- Un projet Angular initialisé avec `ng new CarRentalUI` (standalone par défaut)

---

## Étape 1 — Créer la structure de dossiers

Dans `src/app/`, créer les dossiers suivants :

```
mkdir src/app/models
mkdir src/app/services
mkdir src/app/guards
mkdir src/app/interceptors
mkdir src/app/layout/header
mkdir src/app/layout/footer
mkdir src/app/layout/sidebar
mkdir src/app/pages/home
mkdir src/app/pages/car-list
mkdir src/app/pages/car-detail
mkdir src/app/pages/reservation-form
mkdir src/app/pages/reservation-list
mkdir src/app/pages/login
mkdir src/app/pages/register
mkdir src/app/pages/profile
mkdir src/app/pages/not-found
mkdir src/app/shared/loading-spinner
mkdir src/app/shared/confirm-dialog
mkdir src/environments
```

---

## Étape 2 — Créer les modèles (interfaces TypeScript)

### `src/app/models/car.model.ts`
```typescript
export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  category: string;
  pricePerDay: number;
  imageUrl: string;
  available: boolean;
  description: string;
  fuelType: 'essence' | 'diesel' | 'electrique' | 'hybride';
  transmission: 'manuelle' | 'automatique';
  seats: number;
}
```

### `src/app/models/reservation.model.ts`
```typescript
export interface Reservation {
  id: number;
  carId: number;
  userId: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'en_attente' | 'confirmee' | 'annulee' | 'terminee';
  createdAt?: string;
}
```

### `src/app/models/user.model.ts`
```typescript
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'client' | 'admin';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
```

---

## Étape 3 — Créer les fichiers d'environnement

### `src/environments/environment.ts` (Production)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.carrental.com/api'
};
```

### `src/environments/environment.development.ts` (Développement)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

---

## Étape 4 — Créer les services

Chaque service est injectable avec `providedIn: 'root'` (singleton) et utilise `inject()` au lieu du constructeur.

### `src/app/services/car.service.ts`
```typescript
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
```

### `src/app/services/reservation.service.ts`
```typescript
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
```

### `src/app/services/auth.service.ts`
```typescript
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
```

### `src/app/services/notification.service.ts`
```typescript
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
```

---

## Étape 5 — Créer les intercepteurs (fonctionnels)

### `src/app/interceptors/auth.interceptor.ts`
```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    const clonedReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(clonedReq);
  }

  return next(req);
};
```

### `src/app/interceptors/error.interceptor.ts`
```typescript
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
```

---

## Étape 6 — Créer le guard d'authentification (fonctionnel)

### `src/app/guards/auth.guard.ts`
```typescript
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
```

---

## Étape 7 — Créer les composants Layout

Chaque composant layout a 3 fichiers : `.ts`, `.html`, `.css`.

### Header (`src/app/layout/header/`)

**header.ts**
```typescript
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  protected readonly authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
```

**header.html** — Navigation avec logo, liens, menu utilisateur conditionnel avec `@if`.

**header.css** — Header sticky, glassmorphism (`backdrop-filter: blur`), boutons stylisés.

### Footer (`src/app/layout/footer/`)

**footer.ts** — Composant simple avec `currentYear`.

**footer.html** — Logo, colonnes de liens (Navigation, Légal, Contact), copyright dynamique.

**footer.css** — Fond sombre, grille responsive avec `grid-template-columns: repeat(auto-fit, ...)`.

### Sidebar (`src/app/layout/sidebar/`)

**sidebar.ts** — Utilise `input()` et `output()` (Angular Signals) pour les filtres de catégorie.

**sidebar.html** — Panel slide-in avec boutons de filtre, utilise `@for` pour la boucle.

**sidebar.css** — Position fixe, animation `left` pour le slide-in.

---

## Étape 8 — Créer les composants de page

Chaque page est un composant standalone avec 3 fichiers (`.ts`, `.html`, `.css`).

### Pattern commun pour une page :
```typescript
import { Component, inject, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-xxx',
  standalone: true,
  imports: [/* dépendances */],
  templateUrl: './xxx.html',
  styleUrl: './xxx.css'
})
export class Xxx implements OnInit {
  private readonly service = inject(XxxService);
  protected readonly data = signal<Type[]>([]);
  protected readonly loading = signal(true);

  ngOnInit(): void {
    this.service.getData().subscribe({
      next: (d) => { this.data.set(d); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}
```

### Pages créées :

| Page | Dossier | Description |
|---|---|---|
| **Home** | `pages/home/` | Hero section + grille de fonctionnalités |
| **CarList** | `pages/car-list/` | Grille de cartes véhicules avec loading/empty state |
| **CarDetail** | `pages/car-detail/` | Détails véhicule, specs, prix, bouton réserver |
| **ReservationForm** | `pages/reservation-form/` | Formulaire avec `FormsModule` + `ngModel` |
| **ReservationList** | `pages/reservation-list/` | Tableau des réservations + bouton annuler |
| **Login** | `pages/login/` | Formulaire email/mot de passe |
| **Register** | `pages/register/` | Formulaire inscription complet |
| **Profile** | `pages/profile/` | Avatar initiales + infos utilisateur |
| **NotFound** | `pages/not-found/` | Page 404 avec lien retour accueil |

---

## Étape 9 — Créer les composants partagés

### `src/app/shared/loading-spinner/loading-spinner.ts`
Composant inline (template + styles dans le `.ts`) — spinner CSS avec `@keyframes spin`.

### `src/app/shared/confirm-dialog/confirm-dialog.ts`
Dialog modal avec overlay, utilise `input()` et `output()` signals.

---

## Étape 10 — Configurer le routage (lazy loading)

### `src/app/app.routes.ts`
```typescript
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.Home)
  },
  {
    path: 'cars',
    loadComponent: () => import('./pages/car-list/car-list').then(m => m.CarList)
  },
  {
    path: 'cars/:id',
    loadComponent: () => import('./pages/car-detail/car-detail').then(m => m.CarDetail)
  },
  {
    path: 'reservations',
    loadComponent: () => import('./pages/reservation-list/reservation-list').then(m => m.ReservationList),
    canActivate: [authGuard]
  },
  {
    path: 'reservations/new',
    loadComponent: () => import('./pages/reservation-form/reservation-form').then(m => m.ReservationForm),
    canActivate: [authGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then(m => m.Register)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile').then(m => m.Profile),
    canActivate: [authGuard]
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFound)
  }
];
```

> **Important** : `loadComponent` avec `import()` permet le lazy loading — chaque page est un chunk JS séparé.

---

## Étape 11 — Configurer l'application

### `src/app/app.config.ts`
```typescript
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor]))
  ]
};
```

---

## Étape 12 — Configurer le composant racine

### `src/app/app.ts`
```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
```

### `src/app/app.html`
```html
<app-header />
<main class="main-content">
  <router-outlet />
</main>
<app-footer />
```

### `src/app/app.css`
```css
:host {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
}
```

---

## Étape 13 — Créer le Design System CSS global

Le fichier `src/styles.css` contient un **design system complet** avec 17 sections de CSS réutilisable. Les composants n'ont plus besoin de redéfinir les styles communs.

### `src/styles.css` — Structure

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

:root {
  /* 1. COULEURS — avec variantes RGB pour rgba() dynamique */
  --color-primary: #4f46e5;
  --color-primary-rgb: 79, 70, 229;           /* → utilisable : rgba(var(--color-primary-rgb), 0.1) */
  --color-primary-dark: #3730a3;
  --color-primary-light: rgba(var(--color-primary-rgb), 0.1);
  --color-primary-hover: rgba(var(--color-primary-rgb), 0.08);
  --color-accent: #8b5cf6;
  --color-background: #f8f9fc;
  --color-surface: #ffffff;
  --color-surface-rgb: 255, 255, 255;
  --color-surface-dark: #1a1a2e;
  --color-hover: #f1f3f8;
  --color-border: #e2e5ee;
  --color-overlay: rgba(0, 0, 0, 0.5);
  --color-text: #1e1e2e;
  --color-text-secondary: #6b7280;
  --color-text-inverse: #ffffff;
  --color-success: #10b981;      --color-success-rgb: 16, 185, 129;
  --color-danger: #ef4444;       --color-danger-rgb: 239, 68, 68;
  --color-warning: #f59e0b;      --color-warning-rgb: 245, 158, 11;
  --color-info: #3b82f6;         --color-info-rgb: 59, 130, 246;

  /* 2. SPACING SCALE */
  --space-xs: 0.25rem;   --space-sm: 0.5rem;    --space-md: 1rem;
  --space-lg: 1.5rem;    --space-xl: 2rem;       --space-2xl: 3rem;
  --space-3xl: 4rem;     --space-4xl: 6rem;

  /* 3. BORDER RADIUS */
  --radius-xs: 4px;  --radius-sm: 6px;   --radius-md: 8px;
  --radius-lg: 12px; --radius-xl: 16px;  --radius-pill: 9999px;

  /* 4. SHADOWS */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 15px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 12px 30px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 60px rgba(0, 0, 0, 0.15);
  --shadow-primary: 0 4px 15px rgba(var(--color-primary-rgb), 0.3);

  /* 5. TRANSITIONS */
  --transition-fast: 0.15s ease;
  --transition-base: 0.2s ease;
  --transition-slow: 0.3s ease;

  /* 6. TYPOGRAPHY */
  --font-family: 'Inter', -apple-system, sans-serif;
  --font-size-xs: 0.75rem;   --font-size-sm: 0.8rem;    --font-size-base: 0.875rem;
  --font-size-md: 0.9rem;    --font-size-lg: 1rem;      --font-size-xl: 1.125rem;
  --font-size-2xl: 1.25rem;  --font-size-3xl: 1.5rem;   --font-size-4xl: 2rem;
  --font-size-5xl: 2.75rem;

  /* 7. LAYOUT */
  --container-max: 1280px;
  --container-narrow: 640px;
  --container-form: 480px;
  --header-height: 64px;
  --page-padding: var(--space-lg);

  /* 8. Z-INDEX */
  --z-sidebar: 90;  --z-header: 100;  --z-overlay: 200;  --z-toast: 300;
}
```

### Classes utilitaires globales disponibles

| Catégorie | Classes | Usage |
|---|---|---|
| **Layout** | `.page-container`, `.page-container--narrow`, `.page-container--form`, `.page-center` | Wrapper de page |
| **Titres** | `.page-title`, `.page-subtitle` | En-tête de page |
| **Cards** | `.card`, `.card--hoverable`, `.card__title`, `.card__subtitle` | Conteneur carte |
| **Boutons** | `.btn`, `.btn--primary`, `--secondary`, `--danger`, `--ghost` | Boutons |
| **Tailles btn** | `.btn--sm`, `.btn--lg`, `.btn--full`, `.btn--pill` | Modificateurs taille |
| **Formulaires** | `.form-group`, `.form-label`, `.form-input`, `.form-row`, `.form-link`, `.form-error` | Champs de formulaire |
| **Badges** | `.badge`, `.badge--primary`, `--soft`, `--success`, `--danger`, `--warning`, `--neutral` | Étiquettes |
| **Tags** | `.tag` | Petit chip metadata |
| **Tables** | `.table-wrapper`, `.table` | Tableau stylisé |
| **Avatar** | `.avatar`, `.avatar--sm`, `.avatar--lg` | Avatar dynamique (`--avatar-size`) |
| **Info Grid** | `.info-grid`, `.info-grid--cols-2`, `.info-item`, `.info-label`, `.info-value` | Grille specs |
| **Prix** | `.price`, `.price--sm`, `.price__unit` | Affichage prix |
| **Vide** | `.empty-state` | État vide |
| **Animations** | `.animate-fade-in`, `.animate-slide-up` | Animations d'entrée |
| **Responsive** | `.hide-mobile`, `.hide-desktop` | Visibilité responsive |

### Exemple d'utilisation dans un template :
```html
<!-- Avant (CSS dupliqué dans chaque composant) -->
<div class="auth-page">
  <div class="auth-card">
    <button class="btn-submit">...</button>
  </div>
</div>

<!-- Après (0 CSS local, tout via le design system) -->
<div class="page-center">
  <div class="card">
    <h2 class="card__title">Connexion</h2>
    <input class="form-input" />
    <button class="btn btn--primary btn--lg btn--full">Se connecter</button>
    <p class="form-link">Pas de compte ? <a routerLink="/register">Créer un compte</a></p>
  </div>
</div>
```

---

## Étape 14 — Vérification

```bash
# Compiler en mode développement
npx ng build --configuration development

# Ou lancer le serveur de dev
npm start
# → http://localhost:4200
```

✅ **Résultat attendu** : compilation sans erreurs, exit code 0.

---

## Étape 15 — Refactoring CSS des composants

Après la création du design system global, **tous les CSS des composants** ont été refactorisés pour utiliser les tokens et classes globales.

### Principe
- Les composants **ne redéfinissent plus** les styles de boutons, formulaires, cartes, badges, etc.
- Chaque composant CSS ne contient que les styles **spécifiques au layout** du composant
- Les templates utilisent les classes globales (`.btn--primary`, `.form-input`, `.card`, etc.)

### Fichiers dont le CSS a été vidé (100% géré par le design system) :
- `pages/login/login.css`
- `pages/register/register.css`
- `pages/reservation-form/reservation-form.css`
- `pages/reservation-list/reservation-list.css`

### Fichiers avec CSS réduit (layout seulement) :
- `pages/home/home.css` — hero + features layout
- `pages/car-list/car-list.css` — grille de cartes + image zoom hover
- `pages/car-detail/car-detail.css` — grille 2 colonnes responsive
- `pages/profile/profile.css` — layout centré
- `pages/not-found/not-found.css` — layout centré

### Templates mis à jour pour utiliser les classes globales :

| Template | Classes globales utilisées |
|---|---|
| `login.html` | `.page-center`, `.card`, `.card__title`, `.form-input`, `.btn--primary`, `.form-link` |
| `register.html` | `.page-center`, `.card`, `.form-row`, `.form-input`, `.btn--primary`, `.form-link` |
| `reservation-form.html` | `.page-container`, `.card`, `.form-input`, `.btn--primary` |
| `reservation-list.html` | `.page-container`, `.page-title`, `.table-wrapper`, `.table`, `.badge--success/warning/danger`, `.btn--danger` |
| `car-list.html` | `.page-container`, `.page-title`, `.badge--primary`, `.tag`, `.price`, `.btn--primary`, `.animate-fade-in` |
| `car-detail.html` | `.page-container`, `.badge--soft`, `.info-grid`, `.info-item`, `.price`, `.btn--primary` |
| `home.html` | `.btn`, `.card--hoverable`, `.animate-fade-in` |
| `profile.html` | `.card`, `.avatar`, `.info-grid`, `.info-item`, `.btn--danger` |
| `not-found.html` | `.btn--primary`, `.btn--pill`, `.animate-fade-in` |
| `header.html` | `.btn--primary`, `.btn--secondary`, `.btn--ghost` |

### Layout components refactorisés :
- `header.css` — tokens : `--z-header`, `--header-height`, `--container-max`, `--transition-base`
- `footer.css` — tokens : `--container-max`, `--page-padding`, `--space-*`, `--font-size-*`
- `sidebar.css` — tokens : `--z-sidebar`, `--header-height`, `--radius-md`, `--transition-slow`

### Shared components refactorisés :
- `loading-spinner.ts` — tokens : `--space-2xl`, `--color-border`, `--color-primary` + `@keyframes spin` global
- `confirm-dialog.ts` — tokens : `--color-overlay`, `--z-overlay`, `--shadow-xl` + classes `.btn--primary`, `.btn--secondary`, `.animate-slide-up`

---

## Résumé des patterns Angular 21 Standalone utilisés

| Pattern | Syntaxe |
|---|---|
| Composant standalone | `standalone: true` dans `@Component` |
| Injection de dépendance | `inject(Service)` au lieu du constructeur |
| État réactif | `signal()`, `computed()`, `.asReadonly()` |
| Inputs/Outputs | `input()`, `output()` (signal-based) |
| Control flow | `@if`, `@else`, `@for` (nouveau syntax) |
| Intercepteur fonctionnel | `HttpInterceptorFn` |
| Guard fonctionnel | `CanActivateFn` |
| Lazy loading | `loadComponent: () => import(...)` |
| Configuration app | `provideRouter()`, `provideHttpClient()` |
| Bootstrap | `bootstrapApplication(App, appConfig)` |
| Design System CSS | Custom Properties + classes globales réutilisables |
| Couleurs dynamiques | `--color-*-rgb` pour `rgba()` dynamique |
| Sizing dynamique | `--avatar-size`, `--container-*` modifiables par composant |
