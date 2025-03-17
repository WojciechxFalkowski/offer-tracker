// src/types/offer.types.ts
export interface Offer {
    id: number;
    externalId: string;
    title: string;
    price: number;
    images: string[]; // Zmienione z string na string[]
    url: string;
    specification: CarSpecification;
    details: CarDetails;
    publishedDate: Date | null | undefined;
    createdAt: Date;
    updatedAt: Date;
    trackedUrlId: number | null; // Dodane pole
}

export interface CarDetails {
    brand: string;
    model: string;
    version: string;
    color: string;
    doorCount: string;
    seatCount: string;
    productionYear: string;
    generation: string;
    vin: string;
}

export interface CarSpecification {
    fuelType: string;
    engineCapacity: string;
    power: string;
    bodyType: string;
    gearbox: string;
    drive: string;
    mileage: string; // Dodane pole
}