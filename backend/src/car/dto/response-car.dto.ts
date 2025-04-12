// src/cars/dto/response-car.dto.ts

export interface ResponseCar {
    id: number;
    externalId: string;
    shortenedUrl?: string;
    title: string;
    price?: number;
    url: string;
    publishedDate?: Date | null | undefined;
    createdAt: Date;
    updatedAt: Date;
    trackedUrlId?: number | null;
    isActive: boolean;
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
