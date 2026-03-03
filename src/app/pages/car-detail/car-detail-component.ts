import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CarService } from '../../services/car.service';
import { Car } from '../../models/car.model';
import { LoadingSpinner } from '../../shared/loading-spinner/loading-spinner-component';

@Component({
    selector: 'app-car-detail',
    standalone: true,
    imports: [RouterLink, LoadingSpinner],
    templateUrl: './car-detail-component.html',
    styleUrl: './car-detail-component.css'
})
export class CarDetail implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly carService = inject(CarService);
    protected readonly car = signal<Car | null>(null);
    protected readonly loading = signal(true);

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.carService.getCarById(id).subscribe({
            next: (car) => {
                this.car.set(car);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }
}
