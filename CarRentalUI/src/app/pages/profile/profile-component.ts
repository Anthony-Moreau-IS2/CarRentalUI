import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-profile',
    standalone: true,
    templateUrl: './profile-component.html',
    styleUrl: './profile-component.css'
})
export class Profile {
    protected readonly authService = inject(AuthService);
}
