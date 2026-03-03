import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule, RouterLink],
    templateUrl: './login-component.html',
    styleUrl: './login-component.css'
})
export class Login {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private readonly notificationService = inject(NotificationService);

    protected readonly email = signal('');
    protected readonly password = signal('');
    protected readonly submitting = signal(false);

    submit(): void {
        this.submitting.set(true);
        this.authService.login({
            email: this.email(),
            password: this.password()
        }).subscribe({
            next: () => {
                this.notificationService.success('Connexion réussie !');
                this.router.navigate(['/']);
            },
            error: () => {
                this.notificationService.error('Email ou mot de passe incorrect.');
                this.submitting.set(false);
            }
        });
    }
}
