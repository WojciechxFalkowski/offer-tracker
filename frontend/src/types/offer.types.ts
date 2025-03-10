// src/types/offer.types.ts
export interface Offer {
    id: number;
    externalId: string;
    title: string;
    price: string;
    images: string;
    url: string;
    specification: CarSpecification;
    details: CarDetails;
    createdAt: Date;
    updatedAt: Date;
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
}