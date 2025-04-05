// src/types/tracked-url.types.ts
import { Offer } from './offer.types';

export interface TrackedUrl {
    id: number;
    url: string;
    description?: string;
    brand?: string;
    model?: string;
    createdAt: string;
    matchingCarsCount: number;
    offers?: any[]; // You might want to type this properly
}
