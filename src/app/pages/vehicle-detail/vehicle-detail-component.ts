import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { VehiculeService } from '../../services/vehicule.service';
import { Vehicule } from '../../models/vehicule.model';
import { LoadingSpinner } from '../../shared/loading-spinner/loading-spinner-component';

@Component({
    selector: 'app-vehicle-detail',
    standalone: true,
    imports: [RouterLink, LoadingSpinner],
    templateUrl: './vehicle-detail-component.html',
    styleUrl: './vehicle-detail-component.css'
})
export class VehicleDetail implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly vehiculeService = inject(VehiculeService);
    protected readonly vehicule = signal<Vehicule | null>(null);
    protected readonly loading = signal(true);

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.vehiculeService.getVehiculeById(id).subscribe({
            next: (data) => {
                this.vehicule.set(data);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }
}
