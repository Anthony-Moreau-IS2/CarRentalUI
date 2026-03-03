import { Component, input, output } from '@angular/core';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    templateUrl: './sidebar-component.html',
    styleUrl: './sidebar-component.css'
})
export class Sidebar {
    isOpen = input(false);
    closed = output<void>();

    readonly categories = [
        { label: 'Toutes', value: '' },
        { label: 'Économique', value: 'economique' },
        { label: 'Compacte', value: 'compacte' },
        { label: 'Berline', value: 'berline' },
        { label: 'SUV', value: 'suv' },
        { label: 'Luxe', value: 'luxe' },
        { label: 'Utilitaire', value: 'utilitaire' }
    ];

    categorySelected = output<string>();

    selectCategory(value: string): void {
        this.categorySelected.emit(value);
    }

    close(): void {
        this.closed.emit();
    }
}
