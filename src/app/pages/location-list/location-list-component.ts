import { Component, inject, OnInit, signal } from '@angular/core';
import { LocationService } from '../../services/location.service';
import { Location } from '../../models/location.model';
import { LoadingSpinner } from '../../shared/loading-spinner/loading-spinner-component';

@Component({
    selector: 'app-location-list',
    standalone: true,
    imports: [LoadingSpinner],
    templateUrl: './location-list-component.html',
    styles: [`/* Using global styles */`]
})
export class LocationList implements OnInit {
    private readonly locationService = inject(LocationService);
    protected readonly locations = signal<Location[]>([]);
    protected readonly loading = signal(true);

    ngOnInit(): void {
        this.locationService.getLocations().subscribe({
            next: (data) => {
                this.locations.set(data);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    closeLocation(id: number): void {
        if (confirm('Voulez-vous vraiment clôturer cette location ?')) {
            this.locationService.closeLocation(id).subscribe({
                next: () => {
                    this.locations.update(list =>
                        list.map(r => r.id_location === id ? { ...r, statut: 'terminee' as const } : r)
                    );
                }
            });
        }
    }
}
