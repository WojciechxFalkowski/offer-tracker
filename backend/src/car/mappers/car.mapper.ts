// src/cars/mappers/car.mapper.ts

import { Car } from '../car.entity';
import { ResponseCar } from '../dto/response-car.dto';

export const mapCarToResponse = (car: Car): ResponseCar => {
    return {
        id: car.id,
        externalId: car.externalId,
        title: car.title,
        price: car.price,
        url: car.url,
        createdAt: car.createdAt,
        updatedAt: car.updatedAt,
        publishedDate: car.publishedDate ?? null,
        details: {
            brand: car.details.brand,
            model: car.details.model,
            version: car.details.version,
            color: car.details.color,
            doorCount: car.details.doorCount,
            seatCount: car.details.seatCount,
            productionYear: car.details.productionYear,
            generation: car.details.generation,
            vin: car.details.vin,
        },
        specification: {
            fuelType: car.specification.fuelType,
            engineCapacity: car.specification.engineCapacity,
            power: car.specification.power,
            bodyType: car.specification.bodyType,
            gearbox: car.specification.gearbox,
            drive: car.specification.drive,
            mileage: car.specification.mileage,
        },
        images: car.images.map((image) => image.imageUrl), // Płaska lista URL-i
    };
};
