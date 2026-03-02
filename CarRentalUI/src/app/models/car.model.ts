export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  category: string;
  pricePerDay: number;
  imageUrl: string;
  available: boolean;
  description: string;
  fuelType: 'essence' | 'diesel' | 'electrique' | 'hybride';
  transmission: 'manuelle' | 'automatique';
  seats: number;
}
