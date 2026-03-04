export interface Vehicule {
    id_vehicule: number;
    marque: string;
    modele: string;
    immatriculation: string;
    prix_par_jour: number;
    statut: 'disponible' | 'loue';
}
