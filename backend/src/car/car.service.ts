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

    public async getBrands(): Promise<string[]> {
        const result = await this.offerRepository
            .createQueryBuilder('car')
            .leftJoinAndSelect('car.details', 'details')
            .select('DISTINCT details.brand', 'brand')
            .orderBy('brand', 'ASC')
            .getRawMany();

        return result.map(item => item.brand);
    }

    public async getModels(brand?: string): Promise<string[]> {
        const queryBuilder = this.offerRepository
            .createQueryBuilder('car')
            .leftJoinAndSelect('car.details', 'details')
            .select('DISTINCT details.model', 'model')
            .orderBy('model', 'ASC');

        if (brand) {
            queryBuilder.where('details.brand = :brand', { brand });
        }

        const result = await queryBuilder.getRawMany();
        return result.map(item => item.model);
    }

    public async getEngineTypes(): Promise<string[]> {
        const result = await this.offerRepository
            .createQueryBuilder('car')
            .leftJoinAndSelect('car.specification', 'specification')
            .select('DISTINCT specification.engineCapacity', 'engineType')
            .orderBy('engineType', 'ASC')
            .getRawMany();

        return result.map(item => item.engineType).filter(Boolean);
    }

    public async getFuelTypes(): Promise<string[]> {
        const result = await this.offerRepository
            .createQueryBuilder('car')
            .leftJoinAndSelect('car.specification', 'specification')
            .select('DISTINCT specification.fuelType', 'fuelType')
            .orderBy('fuelType', 'ASC')
            .getRawMany();

        return result.map(item => item.fuelType).filter(Boolean);
    }

    public async getSeatCounts(): Promise<string[]> {
        const result = await this.offerRepository
            .createQueryBuilder('car')
            .leftJoinAndSelect('car.details', 'details')
            .select('DISTINCT details.seatCount', 'seatCount')
            .orderBy('seatCount', 'ASC')
            .getRawMany();

        return result.map(item => item.seatCount).filter(Boolean);
    }

    public async getDoorCounts(): Promise<string[]> {
        const result = await this.offerRepository
            .createQueryBuilder('car')
            .leftJoinAndSelect('car.details', 'details')
            .select('DISTINCT details.doorCount', 'doorCount')
            .orderBy('doorCount', 'ASC')
            .getRawMany();

        return result.map(item => item.doorCount).filter(Boolean);
    }

    public async getDriveTypes(): Promise<string[]> {
        const result = await this.offerRepository
            .createQueryBuilder('car')
            .leftJoinAndSelect('car.specification', 'specification')
            .select('DISTINCT specification.drive', 'driveType')
            .orderBy('driveType', 'ASC')
            .getRawMany();

        return result.map(item => item.driveType).filter(Boolean);
    }

    public async getColors(): Promise<string[]> {
        const result = await this.offerRepository
            .createQueryBuilder('car')
            .leftJoinAndSelect('car.details', 'details')
            .select('DISTINCT details.color', 'color')
            .orderBy('color', 'ASC')
            .getRawMany();

        return result.map(item => item.color).filter(Boolean);
    }

    public async getGearboxTypes(): Promise<string[]> {
        const result = await this.offerRepository
            .createQueryBuilder('car')
            .leftJoinAndSelect('car.specification', 'specification')
            .select('DISTINCT specification.gearbox', 'gearbox')
            .orderBy('gearbox', 'ASC')
            .getRawMany();

        return result.map(item => item.gearbox).filter(Boolean);
    }

    public async getYears(): Promise<string[]> {
        const result = await this.offerRepository
            .createQueryBuilder('car')
            .leftJoinAndSelect('car.details', 'details')
            .select('DISTINCT details.productionYear', 'year')
            .orderBy('year', 'DESC')
            .getRawMany();

        return result.map(item => item.year).filter(Boolean);
    }

    private async getAllModels(): Promise<Record<string, string[]>> {
        const brands = await this.getBrands();
        const modelsByBrand: Record<string, string[]> = {};

        for (const brand of brands) {
            modelsByBrand[brand] = await this.getModels(brand);
        }

        return modelsByBrand;
    }

    public async getFilterOptions() {
        const [
            years,
            gearboxTypes,
            colors,
            fuelTypes,
            engineTypes,
            doorCounts,
            seatCounts,
            driveTypes,
            brands,
            models
        ] = await Promise.all([
            this.getYears(),
            this.getGearboxTypes(),
            this.getColors(),
            this.getFuelTypes(),
            this.getEngineTypes(),
            this.getDoorCounts(),
            this.getSeatCounts(),
            this.getDriveTypes(),
            this.getBrands(),
            this.getAllModels()
        ]);

        return {
            years,
            gearboxTypes,
            colors,
            fuelTypes,
            engineTypes,
            doorCounts,
            seatCounts,
            driveTypes,
            brands,
            models
        };
    }

    // public async getGearboxTypes(brand?: string): Promise<string[]> {
    //     const queryBuilder = this.offerRepository
    //         .createQueryBuilder('car')
    //         .leftJoinAndSelect('car.specification', 'specification')
    //         .leftJoinAndSelect('car.details', 'details')
    //         .select('DISTINCT specification.gearbox', 'gearbox')
    //         .orderBy('gearbox', 'ASC');

    //     if (brand) {
    //         queryBuilder.where('details.brand = :brand', { brand });
    //     }

    //     const result = await queryBuilder.getRawMany();
    //     return result.map(item => item.gearbox).filter(Boolean);
    // }

    public async findAll(
        page: number = 1,
        pageSize: number = 12,
        sort: string = 'createdAt',
        order: string = 'desc',
        filters: Record<string, any> = {},
    ): Promise<{ cars: ResponseCar[]; total: number }> {
        // Przygotowanie parametrów paginacji
        const skip = (page - 1) * pageSize;
        const take = pageSize;

        // Przygotowanie parametrów sortowania
        const orderBy = {
            [sort]: order.toUpperCase()
        };

        // Przygotowanie filtrów
        const where = this.prepareFilters(filters);

        console.log('filters');
        console.log(filters);
        
        // Wykonanie zapytania z filtrami i paginacją
        const [cars, total] = await this.offerRepository.findAndCount({
            skip,
            take,
            order: orderBy,
            where,
            relations: ['details', 'specification', 'images']
        });

        return {
            cars: cars.map(mapCarToResponse),
            total
        };
    }

    private prepareFilters(filters: Record<string, any>): any {
        const where: any = {};

        // Usuwamy parametry paginacji i sortowania
        const { page, pageSize, sort, order, ...actualFilters } = filters;

        // Mapowanie filtrów z frontendu na strukturę bazy danych
        Object.entries(actualFilters).forEach(([key, value]) => {
            switch (key) {
                case 'make':
                    where.details = { ...where.details, brand: value };
                    break;
                case 'model':
                    where.details = { ...where.details, model: value };
                    break;
                case 'trim':
                    where.details = { ...where.details, version: value };
                    break;
                case 'priceFrom':
                    where.price = { ...where.price, gte: value };
                    break;
                case 'priceTo':
                    where.price = { ...where.price, lte: value };
                    break;
                case 'yearFrom':
                    where.details = { ...where.details, productionYear: { gte: value } };
                    break;
                case 'yearTo':
                    where.details = { ...where.details, productionYear: { lte: value } };
                    break;
                case 'fuel':
                    where.specification = { ...where.specification, fuelType: value };
                    break;
                // Dodaj więcej mapowań dla pozostałych filtrów
                // ...
            }
        });

        return where;
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
        offer.publishedDate = new Date(car.originalDate)
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
