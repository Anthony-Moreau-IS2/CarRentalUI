export interface Location {
    id_location: number;
    id_client: number;
    id_vehicule: number;
    id_utilisateur: number;
    date_debut: string;
    date_fin: string;
    prix_total: number;
    statut: 'active' | 'terminee';
}
