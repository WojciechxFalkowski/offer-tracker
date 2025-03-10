// src/types/tracked-url.types.ts
import { Offer } from './offer.types';

export interface TrackedUrl {
    id: number;
    url: string;
    description: string;
    offers: Offer[];
    createdAt: Date;
    updatedAt: Date;
}
