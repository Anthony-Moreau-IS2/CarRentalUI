import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/home/home-component').then(m => m.Home)
    },
    {
        path: 'vehicles',
        loadComponent: () => import('./pages/vehicle-list/vehicle-list-component').then(m => m.VehicleList)
    },
    {
        path: 'vehicles/:id',
        loadComponent: () => import('./pages/vehicle-detail/vehicle-detail-component').then(m => m.VehicleDetail)
    },
    {
        path: 'locations',
        loadComponent: () => import('./pages/location-list/location-list-component').then(m => m.LocationList),
        canActivate: [authGuard]
    },
    {
        path: 'locations/new',
        loadComponent: () => import('./pages/location-form/location-form-component').then(m => m.LocationForm),
        canActivate: [authGuard]
    },
    {
        path: 'clients',
        loadComponent: () => import('./pages/client-list/client-list-component').then(m => m.ClientList),
        canActivate: [authGuard]
    },
    {
        path: 'clients/new',
        loadComponent: () => import('./pages/client-form/client-form-component').then(m => m.ClientForm),
        canActivate: [authGuard]
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login-component').then(m => m.Login)
    },
    {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile-component').then(m => m.Profile),
        canActivate: [authGuard]
    },
    {
        path: '**',
        loadComponent: () => import('./pages/not-found/not-found-component').then(m => m.NotFound)
    }
];
