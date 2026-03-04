import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LocationService } from '../../services/location.service';
import { ClientService } from '../../services/client.service';
import { VehiculeService } from '../../services/vehicule.service';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { Client } from '../../models/client.model';
import { Vehicule } from '../../models/vehicule.model';

@Component({
    selector: 'app-location-form',
    standalone: true,
    imports: [FormsModule, RouterLink],
    templateUrl: './location-form-component.html',
    styleUrl: './location-form-component.css'
})
export class LocationForm implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly locationService = inject(LocationService);
    private readonly clientService = inject(ClientService);
    private readonly vehiculeService = inject(VehiculeService);
    private readonly authService = inject(AuthService);
    private readonly notificationService = inject(NotificationService);

    protected readonly clients = signal<Client[]>([]);
    protected readonly vehicules = signal<Vehicule[]>([]);

    protected readonly vehiculeId = signal<number | null>(null);
    protected readonly clientId = signal<number | null>(null);
    protected readonly dateDebut = signal('');
    protected readonly dateFin = signal('');
    protected readonly submitting = signal(false);

    ngOnInit() {
        this.fetchData();
        const queryCarId = this.route.snapshot.queryParamMap.get('vehiculeId');
        if (queryCarId) {
            this.vehiculeId.set(Number(queryCarId));
        }
    }

    private fetchData(): void {
        this.clientService.getClients().subscribe({
            next: (data) => this.clients.set(data)
        });

        this.vehiculeService.getVehicules().subscribe({
            next: (data) => {
                // On ne montre que les véhicules disponibles
                this.vehicules.set(data.filter(v => v.statut === 'disponible'));
            }
        });
    }

    getTotalPrice(): number {
        const vId = this.vehiculeId();
        const debut = this.dateDebut();
        const fin = this.dateFin();

        if (!vId || !debut || !fin) return 0;

        const vehicle = this.vehicules().find(v => v.id_vehicule === vId);
        if (!vehicle) return 0;

        const start = new Date(debut);
        const end = new Date(fin);
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // On compte le jour de début

        if (diffDays <= 0) return 0;
        return diffDays * vehicle.prix_par_jour;
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
            id_client: Number(cId),
            id_vehicule: Number(vId),
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
