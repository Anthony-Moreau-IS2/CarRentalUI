import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { VehiculeService } from '../../services/vehicule.service';
import { Vehicule } from '../../models/vehicule.model';
import { LoadingSpinner } from '../../shared/loading-spinner/loading-spinner-component';

@Component({
    selector: 'app-vehicle-list',
    standalone: true,
    imports: [RouterLink, LoadingSpinner],
    templateUrl: './vehicle-list-component.html',
    styleUrl: './vehicle-list-component.css' // We'll keep the actual CSS structure the same for simplicity
})
export class VehicleList implements OnInit {
    private readonly vehiculeService = inject(VehiculeService);
    protected readonly vehicules = signal<Vehicule[]>([]);
    protected readonly loading = signal(true);

    ngOnInit(): void {
        this.vehiculeService.getVehicules().subscribe({
            next: (data) => {
                this.vehicules.set(data);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }
}
