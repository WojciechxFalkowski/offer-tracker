// src/cars/dto/response-car.dto.ts

export interface ResponseCar {
    id: number;
    externalId: string;
    title: string;
    price?: string;
    url: string;
    createdAt: Date;
    updatedAt: Date;
    trackedUrlId?: number | null;
    details: {
        brand: string;
        model: string;
        version?: string;
        color?: string;
        doorCount?: string;
        seatCount?: string;
        productionYear?: string;
        generation?: string;
        vin?: string;
    };
    specification: {
        fuelType?: string;
        engineCapacity?: string;
        power?: string;
        bodyType?: string;
        gearbox?: string;
        drive?: string;
        mileage?: string;
    };
    images: string[];
}
