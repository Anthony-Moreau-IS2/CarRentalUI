import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-client-form',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './client-form-component.html',
    styles: [`/* Uses global form styles */`]
})
export class ClientForm {
    private readonly router = inject(Router);
    private readonly clientService = inject(ClientService);
    private readonly notificationService = inject(NotificationService);

    protected readonly nom = signal('');
    protected readonly contact = signal('');
    protected readonly numeroPermis = signal('');
    protected readonly submitting = signal(false);

    submit(): void {
        this.submitting.set(true);

        this.clientService.createClient({
            nom: this.nom(),
            contact: this.contact(),
            numero_permis: this.numeroPermis()
        }).subscribe({
            next: () => {
                this.notificationService.success('Client créé avec succès !');
                this.router.navigate(['/clients']);
            },
            error: () => this.submitting.set(false)
        });
    }
}
