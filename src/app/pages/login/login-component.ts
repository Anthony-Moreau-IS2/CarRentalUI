import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './login-component.html',
    styleUrl: './login-component.css'
})
export class Login {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private readonly notificationService = inject(NotificationService);

    protected readonly identifiant = signal('');
    protected readonly motDePasse = signal('');
    protected readonly submitting = signal(false);

    submit(): void {
        this.submitting.set(true);
        this.authService.login({
            identifiant: this.identifiant(),
            mot_de_passe: this.motDePasse()
        }).subscribe({
            next: (response) => {
                this.notificationService.success(response.message || 'Connexion réussie !');
                this.router.navigate(['/']);
            },
            error: () => {
                this.notificationService.error('Identifiant ou mot de passe incorrect.');
                this.submitting.set(false);
            }
        });
    }
}
