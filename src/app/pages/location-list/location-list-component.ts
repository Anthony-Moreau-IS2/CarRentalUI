import { Component, inject, OnInit, signal } from '@angular/core';
import { LocationService } from '../../services/location.service';
import { ClientService } from '../../services/client.service';
import { VehiculeService } from '../../services/vehicule.service';
import { Location } from '../../models/location.model';
import { Client } from '../../models/client.model';
import { Vehicule } from '../../models/vehicule.model';
import { LoadingSpinner } from '../../shared/loading-spinner/loading-spinner-component';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-location-list',
    standalone: true,
    imports: [LoadingSpinner],
    templateUrl: './location-list-component.html',
    styleUrl: './location-list-component.css'
})
export class LocationList implements OnInit {
    private readonly locationService = inject(LocationService);
    private readonly clientService = inject(ClientService);
    private readonly vehiculeService = inject(VehiculeService);

    protected readonly locations = signal<Location[]>([]);
    protected readonly clients = signal<Client[]>([]);
    protected readonly vehicules = signal<Vehicule[]>([]);

    protected readonly loading = signal(true);
    protected readonly showDeleteModal = signal(false);
    protected readonly locationToDelete = signal<number | null>(null);

    ngOnInit(): void {
        forkJoin({
            locations: this.locationService.getLocations(),
            clients: this.clientService.getClients(),
            vehicules: this.vehiculeService.getVehicules()
        }).subscribe({
            next: (data) => {
                this.locations.set(data.locations);
                this.clients.set(data.clients);
                this.vehicules.set(data.vehicules);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    getClientName(id: number): string {
        const client = this.clients().find((c: Client) => c.id_client === id);
        return client ? client.nom : `Client #${id}`;
    }

    getVehiculeModel(id: number): string {
        const v = this.vehicules().find((v: Vehicule) => v.id_vehicule === id);
        return v ? `${v.marque} ${v.modele}` : `Véhicule #${id}`;
    }

    closeLocation(id: number): void {
        if (confirm('Voulez-vous vraiment clôturer cette location ?')) {
            this.locationService.closeLocation(id).subscribe({
                next: () => {
                    this.locations.update((list: Location[]) =>
                        list.map((r: Location) => r.id_location === id ? { ...r, statut: 'terminee' as const } : r)
                    );
                }
            });
        }
    }

    openDeleteModal(id: number): void {
        this.locationToDelete.set(id);
        this.showDeleteModal.set(true);
    }

    closeDeleteModal(): void {
        this.showDeleteModal.set(false);
        this.locationToDelete.set(null);
    }

    confirmDelete(): void {
        const id = this.locationToDelete();
        if (id) {
            this.locationService.deleteLocation(id).subscribe({
                next: () => {
                    this.locations.update((list: Location[]) => list.filter((loc: Location) => loc.id_location !== id));
                    this.closeDeleteModal();
                }
            });
        }
    }
}
