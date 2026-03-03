import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarService } from '../../services/car.service';
import { Car } from '../../models/car.model';
import { LoadingSpinner } from '../../shared/loading-spinner/loading-spinner-component';

@Component({
    selector: 'app-car-list',
    standalone: true,
    imports: [RouterLink, LoadingSpinner],
    templateUrl: './car-list-component.html',
    styleUrl: './car-list-component.css'
})
export class CarList implements OnInit {
    private readonly carService = inject(CarService);
    protected readonly cars = signal<Car[]>([]);
    protected readonly loading = signal(true);

    ngOnInit(): void {
        this.carService.getCars().subscribe({
            next: (cars) => {
                this.cars.set(cars);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }
}
