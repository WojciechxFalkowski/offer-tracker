// src/offer/offer.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './car.entity';
import { CarI } from 'src/crawler/crawler.types';
import { CAR_REPOSITORY } from './car.contracts';
import { CarDetails } from './car-details.entity';
import { CarImage } from './car-image.entity';
import { CarSpecification } from './car-specification.entity';
import { mapCarToResponse } from './mappers/car.mapper';
import { ResponseCar } from './dto/response-car.dto';

@Injectable()
export class CarService {
    constructor(
        @Inject(CAR_REPOSITORY)
        private offerRepository: Repository<Car>,
    ) { }

    public async findAll(limit: number = 500, sort: string = 'createdAt,DESC'): Promise<ResponseCar[]> {
        const [sortField, sortOrder] = sort.split(',');

        const cars = await this.offerRepository.find({
            take: limit,
            order: {
                [sortField]: sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'
            }
        });

        return cars.map(mapCarToResponse);
    }

    public async findByUrl(url: string): Promise<ResponseCar | null> {
        const car = await this.offerRepository.findOne({ where: { url } });
        if (!car) {
            return null
        }

        return mapCarToResponse(car);
    }

    public async createFromCar(car: CarI): Promise<Car> {
        const offer = new Car();

        offer.url = car.url;
        offer.title = `${car.details.brand} ${car.details.model} ${car.details.version}`.trim();
        offer.externalId = car.url.split('/').pop() || '';
        offer.price = car.price;

        // Tworzenie szczegółów samochodu
        const carDetails = new CarDetails();
        Object.assign(carDetails, car.details);
        offer.details = carDetails;

        // Tworzenie specyfikacji samochodu
        const carSpecification = new CarSpecification();
        Object.assign(carSpecification, car.specification);
        offer.specification = carSpecification;

        // Tworzenie obrazów samochodu
        offer.images = car.images.map((imageUrl) => {
            const image = new CarImage();
            image.imageUrl = imageUrl;
            return image;
        });

        return await this.offerRepository.save(offer);
    }
}
