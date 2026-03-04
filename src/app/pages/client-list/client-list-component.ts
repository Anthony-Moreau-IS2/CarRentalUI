import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import { LoadingSpinner } from '../../shared/loading-spinner/loading-spinner-component';

@Component({
    selector: 'app-client-list',
    standalone: true,
    imports: [RouterLink, LoadingSpinner],
    templateUrl: './client-list-component.html',
    styles: [`/* Using global classes */`]
})
export class ClientList implements OnInit {
    private readonly clientService = inject(ClientService);
    protected readonly clients = signal<Client[]>([]);
    protected readonly loading = signal(true);

    ngOnInit(): void {
        this.clientService.getClients().subscribe({
            next: (data) => {
                this.clients.set(data);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    deleteClient(id: number): void {
        if (confirm('Voulez-vous vraiment supprimer ce client ?')) {
            this.clientService.deleteClient(id).subscribe({
                next: () => {
                    this.clients.update(list => list.filter(c => c.id_client !== id));
                }
            });
        }
    }
}
