export interface Reservation {
    id: number;
    carId: number;
    userId: number;
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: 'en_attente' | 'confirmee' | 'annulee' | 'terminee';
    createdAt?: string;
}
