import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [FormsModule, RouterLink],
    templateUrl: './register-component.html',
    styleUrl: './register-component.css'
})
export class Register {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private readonly notificationService = inject(NotificationService);

    protected readonly firstName = signal('');
    protected readonly lastName = signal('');
    protected readonly email = signal('');
    protected readonly password = signal('');
    protected readonly phone = signal('');
    protected readonly submitting = signal(false);

    submit(): void {
        this.submitting.set(true);
        this.authService.register({
            firstName: this.firstName(),
            lastName: this.lastName(),
            email: this.email(),
            password: this.password(),
            phone: this.phone() || undefined
        }).subscribe({
            next: () => {
                this.notificationService.success('Compte créé avec succès !');
                this.router.navigate(['/']);
            },
            error: () => {
                this.notificationService.error('Erreur lors de la création du compte.');
                this.submitting.set(false);
            }
        });
    }
}
