# Frontend — Endpoints, Routing & Interconnexion avec le Backend

> Ce document décrit les routes Angular (pages), les services HTTP, les modèles de données
> et leur correspondance avec les endpoints du backend Flask.

---

## 1. Configuration Réseau

| Environnement | `apiUrl` (environment.ts) | Base URL Backend |
|---|---|---|
| **Development** | `http://localhost:5000/api` | Flask `localhost:5000` |
| **Production** | `http://localhost:5000/api` | Flask `localhost:5000` (Temporaire pour test) |


### Intercepteurs HTTP

| Intercepteur | Rôle |
|---|---|
| `authInterceptor` | Ajoute `Authorization: Bearer <token>` à chaque requête si un token est présent |
| `errorInterceptor` | Gère les erreurs globales : `401` → redirect `/login` · `403` / `404` / `500` → notification |

### Guard

| Guard | Rôle | Routes protégées |
|---|---|---|
| `authGuard` | Vérifie `isAuthenticated()`, sinon redirect `/login` | `/locations`, `/locations/new`, `/profile` |

---

## 2. Routing Angular — Pages

| Route FE | Composant | Guard | Description | Endpoint(s) BE consommé(s) |
|---|---|---|---|---|
| `/` | `Home` | ❌ | Page d'accueil | — |
| `/login` | `Login` | ❌ | Formulaire de connexion | `POST /auth/login` |
| `/vehicles` | `VehicleList` | ❌ | Liste des véhicules | `GET /vehicles` |
| `/vehicles/:id` | `VehicleDetail` | ❌ | Détail d'un véhicule | `GET /vehicles/{id}` |
| `/vehicles/new` | `VehicleForm` | ✅ | Ajouter un véhicule | `POST /vehicles` |
| `/vehicles/:id/edit` | `VehicleForm` | ✅ | Modifier un véhicule | `PUT /vehicles/{id}` |
| `/clients` | `ClientList` | ✅ | Liste des clients | `GET /clients` |
| `/clients/:id` | `ClientDetail` | ✅ | Détail d'un client | `GET /clients/{id}` |
| `/clients/new` | `ClientForm` | ✅ | Ajouter un client | `POST /clients` |
| `/clients/:id/edit` | `ClientForm` | ✅ | Modifier un client | `PUT /clients/{id}` |
| `/locations` | `LocationList` | ✅ | Liste des locations | `GET /locations` |
| `/locations/new` | `LocationForm` | ✅ | Créer une location | `POST /locations` |
| `/locations/:id` | `LocationDetail` | ✅ | Détail d'une location | `GET /locations/{id}` |
| `/profile` | `Profile` | ✅ | Profil utilisateur | `GET /users/{id}` |
| `**` | `NotFound` | ❌ | Page 404 | — |

---

## 3. Services Angular — Appels HTTP vers le Backend

### 3.1 `AuthService` → `/api/auth`

| Méthode Angular | Méthode HTTP | Endpoint BE | Input (Body) | Output |
|---|---|---|---|---|
| `login(credentials)` | `POST` | `/auth/login` | `{ identifiant, mot_de_passe }` | `{ message, utilisateur: { id_utilisateur, identifiant } }` |
| `logout()` | — | — | — | Supprime token du `localStorage`, redirect `/login` |
| `getToken()` | — | — | — | `string \| null` depuis `localStorage` |
| `isAuthenticated()` | — | — | — | `boolean` (signal computed) |

**Stockage local** : le token et les infos utilisateur sont stockés dans le `localStorage`.

---

### 3.2 `VehicleService` → `/api/vehicles`

| Méthode Angular | Méthode HTTP | Endpoint BE | Input | Output |
|---|---|---|---|---|
| `getVehicles()` | `GET` | `/vehicles` | — | `Vehicule[]` |
| `getVehicleById(id)` | `GET` | `/vehicles/{id}` | Path: `id` | `Vehicule` |
| `createVehicle(data)` | `POST` | `/vehicles` | Body: `Vehicule` (sans id) | `Vehicule` |
| `updateVehicle(id, data)` | `PUT` | `/vehicles/{id}` | Body: `Partial<Vehicule>` | `Vehicule` |
| `deleteVehicle(id)` | `DELETE` | `/vehicles/{id}` | Path: `id` | `void` (204) |

---

### 3.3 `ClientService` → `/api/clients`

| Méthode Angular | Méthode HTTP | Endpoint BE | Input | Output |
|---|---|---|---|---|
| `getClients()` | `GET` | `/clients` | — | `Client[]` |
| `getClientById(id)` | `GET` | `/clients/{id}` | Path: `id` | `Client` |
| `createClient(data)` | `POST` | `/clients` | Body: `Client` (sans id) | `Client` |
| `updateClient(id, data)` | `PUT` | `/clients/{id}` | Body: `Partial<Client>` | `Client` |
| `deleteClient(id)` | `DELETE` | `/clients/{id}` | Path: `id` | `void` (204) |

---

### 3.4 `LocationService` → `/api/locations`

| Méthode Angular | Méthode HTTP | Endpoint BE | Input | Output |
|---|---|---|---|---|
| `getLocations()` | `GET` | `/locations` | — | `Location[]` |
| `getLocationById(id)` | `GET` | `/locations/{id}` | Path: `id` | `Location` |
| `createLocation(data)` | `POST` | `/locations` | Body: `CreateLocationRequest` | `Location` |
| `closeLocation(id)` | `POST` | `/locations/{id}/close` | Path: `id` | `Location` |
| `deleteLocation(id)` | `DELETE` | `/locations/{id}` | Path: `id` | `void` (204) |

---

### 3.5 `UserService` → `/api/users`

| Méthode Angular | Méthode HTTP | Endpoint BE | Input | Output |
|---|---|---|---|---|
| `getUsers()` | `GET` | `/users` | — | `Utilisateur[]` |
| `getUserById(id)` | `GET` | `/users/{id}` | Path: `id` | `Utilisateur` |
| `createUser(data)` | `POST` | `/users` | Body: `CreateUserRequest` | `Utilisateur` |
| `updateUser(id, data)` | `PUT` | `/users/{id}` | Body: `Partial<Utilisateur>` | `Utilisateur` |
| `deleteUser(id)` | `DELETE` | `/users/{id}` | Path: `id` | `void` (204) |

---

## 4. Modèles TypeScript (alignés sur les entités BE)

### `Vehicule`

```typescript
export interface Vehicule {
  id_vehicule: number;
  marque: string;
  modele: string;
  immatriculation: string;
  prix_par_jour: number;
  statut: 'disponible' | 'loue';
}
```

### `Client`

```typescript
export interface Client {
  id_client: number;
  nom: string;
  contact: string;
  numero_permis: string;
}
```

### `Location`

```typescript
export interface Location {
  id_location: number;
  id_client: number;
  id_vehicule: number;
  id_utilisateur: number;
  date_debut: string;       // YYYY-MM-DD
  date_fin: string;         // YYYY-MM-DD
  prix_total: number;
  statut: 'active' | 'terminee';
}
```

### `Utilisateur`

```typescript
export interface Utilisateur {
  id_utilisateur: number;
  identifiant: string;
}
```

### `LoginRequest`

```typescript
export interface LoginRequest {
  identifiant: string;
  mot_de_passe: string;
}
```

### `LoginResponse`

```typescript
export interface LoginResponse {
  message: string;
  utilisateur: Utilisateur;
}
```

### `CreateLocationRequest`

```typescript
export interface CreateLocationRequest {
  id_client: number;
  id_vehicule: number;
  id_utilisateur: number;
  date_debut: string;       // YYYY-MM-DD
  date_fin: string;         // YYYY-MM-DD
}
```

---

## 5. Mapping Complet — Frontend ↔ Backend

| Service FE | Méthode FE | → | Méthode HTTP | Endpoint BE |
|---|---|---|---|---|
| `AuthService` | `login()` | → | `POST` | `/api/auth/login` |
| `VehicleService` | `getVehicles()` | → | `GET` | `/api/vehicles` |
| `VehicleService` | `getVehicleById()` | → | `GET` | `/api/vehicles/{id}` |
| `VehicleService` | `createVehicle()` | → | `POST` | `/api/vehicles` |
| `VehicleService` | `updateVehicle()` | → | `PUT` | `/api/vehicles/{id}` |
| `VehicleService` | `deleteVehicle()` | → | `DELETE` | `/api/vehicles/{id}` |
| `ClientService` | `getClients()` | → | `GET` | `/api/clients` |
| `ClientService` | `getClientById()` | → | `GET` | `/api/clients/{id}` |
| `ClientService` | `createClient()` | → | `POST` | `/api/clients` |
| `ClientService` | `updateClient()` | → | `PUT` | `/api/clients/{id}` |
| `ClientService` | `deleteClient()` | → | `DELETE` | `/api/clients/{id}` |
| `LocationService` | `getLocations()` | → | `GET` | `/api/locations` |
| `LocationService` | `getLocationById()` | → | `GET` | `/api/locations/{id}` |
| `LocationService` | `createLocation()` | → | `POST` | `/api/locations` |
| `LocationService` | `closeLocation()` | → | `POST` | `/api/locations/{id}/close` |
| `LocationService` | `deleteLocation()` | → | `DELETE` | `/api/locations/{id}` |
| `UserService` | `getUsers()` | → | `GET` | `/api/users` |
| `UserService` | `getUserById()` | → | `GET` | `/api/users/{id}` |
| `UserService` | `createUser()` | → | `POST` | `/api/users` |
| `UserService` | `updateUser()` | → | `PUT` | `/api/users/{id}` |
| `UserService` | `deleteUser()` | → | `DELETE` | `/api/users/{id}` |

---

## 6. Gestion des Erreurs HTTP (côté FE)

L'`errorInterceptor` gère les codes d'erreur retournés par le backend :

| Code HTTP BE | Action FE |
|---|---|
| `400` | Affichage du message d'erreur dans le composant (validation formulaire) |
| `401` | Suppression du token, redirect `/login`, notification "Session expirée" |
| `403` | Notification "Accès refusé" |
| `404` | Notification "Ressource introuvable" |
| `409` | Affichage du message d'erreur métier (ex: immatriculation déjà utilisée) |
| `500` | Notification "Erreur serveur" |
