import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LocationService } from '../../services/location.service';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-location-form',
    standalone: true,
    imports: [FormsModule, RouterLink],
    templateUrl: './location-form-component.html',
    styles: [`/* Global form styles */`]
})
export class LocationForm implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly locationService = inject(LocationService);
    private readonly authService = inject(AuthService);
    private readonly notificationService = inject(NotificationService);

    protected readonly vehiculeId = signal<number | null>(null);
    protected readonly clientId = signal<number | null>(null);
    protected readonly dateDebut = signal('');
    protected readonly dateFin = signal('');
    protected readonly submitting = signal(false);

    ngOnInit() {
        const queryCarId = this.route.snapshot.queryParamMap.get('vehiculeId');
        if (queryCarId) {
            this.vehiculeId.set(Number(queryCarId));
        }
    }

    submit(): void {
        const vId = this.vehiculeId();
        const cId = this.clientId();
        const debut = this.dateDebut();
        const fin = this.dateFin();

        if (!vId || !cId || !debut || !fin) {
            this.notificationService.error('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        const user = this.authService.getCurrentUser();
        if (!user) {
            this.notificationService.error('Erreur: utilisateur non authentifié.');
            return;
        }

        this.submitting.set(true);

        this.locationService.createLocation({
            id_client: cId,
            id_vehicule: vId,
            id_utilisateur: user.id_utilisateur,
            date_debut: debut,
            date_fin: fin
        }).subscribe({
            next: () => {
                this.notificationService.success('Location créée avec succès !');
                this.router.navigate(['/locations']);
            },
            error: () => this.submitting.set(false)
        });
    }
}
