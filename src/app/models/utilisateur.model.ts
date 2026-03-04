export interface Utilisateur {
    id_utilisateur: number;
    identifiant: string;
}

export interface LoginRequest {
    identifiant: string;
    mot_de_passe: string;
}

export interface LoginResponse {
    message: string;
    utilisateur: Utilisateur;
}
