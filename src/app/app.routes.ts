import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/home/home-component').then(m => m.Home)
    },
    {
        path: 'cars',
        loadComponent: () => import('./pages/car-list/car-list-component').then(m => m.CarList)
    },
    {
        path: 'cars/:id',
        loadComponent: () => import('./pages/car-detail/car-detail-component').then(m => m.CarDetail)
    },
    {
        path: 'reservations',
        loadComponent: () => import('./pages/reservation-list/reservation-list-component').then(m => m.ReservationList),
        canActivate: [authGuard]
    },
    {
        path: 'reservations/new',
        loadComponent: () => import('./pages/reservation-form/reservation-form-component').then(m => m.ReservationForm),
        canActivate: [authGuard]
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login-component').then(m => m.Login)
    },
    {
        path: 'register',
        loadComponent: () => import('./pages/register/register-component').then(m => m.Register)
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
