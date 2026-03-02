# Architecture Standalone - CarRentalUI

## Vue d'ensemble

Ce projet utilise **Angular 21** avec une architecture **100% standalone** (sans NgModules). Chaque composant, service, guard et intercepteur est autonome.

## Structure du projet

```
src/app/
├── guards/                   # Guards de route (fonctionnels)
│   └── auth.guard.ts
├── interceptors/             # Intercepteurs HTTP (fonctionnels)
│   ├── auth.interceptor.ts   # Ajout du token JWT
│   └── error.interceptor.ts  # Gestion globale des erreurs HTTP
├── layout/                   # Composants de mise en page
│   ├── header/               # Barre de navigation
│   ├── footer/               # Pied de page
│   └── sidebar/              # Barre latérale de filtres
├── models/                   # Interfaces TypeScript
│   ├── car.model.ts
│   ├── reservation.model.ts
│   └── user.model.ts
├── pages/                    # Composants de page (lazy-loaded)
│   ├── home/                 # Page d'accueil
│   ├── car-list/             # Liste des véhicules
│   ├── car-detail/           # Détail d'un véhicule
│   ├── reservation-form/     # Formulaire de réservation
│   ├── reservation-list/     # Liste des réservations
│   ├── login/                # Connexion
│   ├── register/             # Inscription
│   ├── profile/              # Profil utilisateur
│   └── not-found/            # Page 404
├── services/                 # Services injectables (providedIn: 'root')
│   ├── auth.service.ts
│   ├── car.service.ts
│   ├── reservation.service.ts
│   └── notification.service.ts
├── shared/                   # Composants réutilisables
│   ├── loading-spinner/
│   └── confirm-dialog/
├── app.config.ts             # Configuration de l'application
├── app.routes.ts             # Routes avec lazy loading
├── app.ts                    # Composant racine
├── app.html                  # Template racine (header + router-outlet + footer)
└── app.css
```

## Principes clés

### 1. Composants Standalone
Chaque composant déclare ses propres imports :
```typescript
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {}
```

### 2. Lazy Loading des pages
Les pages sont chargées à la demande via `loadComponent` :
```typescript
{
  path: 'cars',
  loadComponent: () => import('./pages/car-list/car-list').then(m => m.CarList)
}
```

### 3. Intercepteurs fonctionnels
Les intercepteurs utilisent le pattern `HttpInterceptorFn` :
```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => { ... };
```
Configurés dans `app.config.ts` via `provideHttpClient(withInterceptors([...]))`.

### 4. Guards fonctionnels
Les guards utilisent le pattern `CanActivateFn` :
```typescript
export const authGuard: CanActivateFn = () => { ... };
```

### 5. Angular Signals
L'état réactif utilise les Signals Angular :
```typescript
protected readonly cars = signal<Car[]>([]);
readonly isAuthenticated = computed(() => !!this.currentUser());
```

### 6. Services (providedIn: 'root')
Tous les services sont singletons, injectés via `inject()` :
```typescript
@Injectable({ providedIn: 'root' })
export class CarService {
  private readonly http = inject(HttpClient);
}
```

## Routes

| Route | Composant | Guard |
|---|---|---|
| `/` | Home | - |
| `/cars` | CarList | - |
| `/cars/:id` | CarDetail | - |
| `/reservations` | ReservationList | authGuard |
| `/reservations/new` | ReservationForm | authGuard |
| `/login` | Login | - |
| `/register` | Register | - |
| `/profile` | Profile | authGuard |
| `**` | NotFound | - |

## Configuration (`app.config.ts`)

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor]))
  ]
};
```

## Environnements

- `src/environments/environment.ts` — Production (`https://api.carrental.com/api`)
- `src/environments/environment.development.ts` — Développement (`http://localhost:8080/api`)

## Lancer le projet

```bash
cd CarRentalUI
npm install
npm start       # ng serve → http://localhost:4200
npm run build   # Build de production
```
