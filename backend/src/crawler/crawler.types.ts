// src/crawler/crawler.types.ts
export interface CarI {
    offerId: string;
    url: string;
    date: string;
    originalDate: string;
    details: CarDetails;
    specification: CarSpecification;
    images: string[];
    price: string;
}

export interface CarDetails {
    brand: string | null;
    model: string | null;
    version: string | null;
    color: string | null;
    doorCount: string | null;
    seatCount: string | null;
    productionYear: string | null;
    generation: string | null;
    vin: string | null;
}

export interface CarSpecification {
    fuelType: string;
    engineCapacity: string;
    power: string;
    bodyType: string;
    gearbox: string;
    drive: string;
    mileage: string;
}

export type OnlyMileageRequired = Partial<CarSpecification> & Required<Pick<CarSpecification, 'mileage'>>;
