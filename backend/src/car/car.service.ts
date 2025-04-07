// src/offer/offer.service.ts
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Car } from './car.entity';
import { CarI } from 'src/crawler/crawler.types';
import { CAR_REPOSITORY } from './car.contracts';
import { CarDetails } from './car-details.entity';
import { CarImage } from './car-image.entity';
import { CarSpecification } from './car-specification.entity';
import { mapCarToResponse } from './mappers/car.mapper';
import { ResponseCar } from './dto/response-car.dto';
import { IsNull } from 'typeorm';

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

    private async getAllModels(): Promise<{ id: string, models }[]> {
        const brands = await this.getBrands();
        const modelsByBrand: { id: string, models }[] = [];

        for (const brand of brands) {
            // modelsByBrand[brand] = await this.getModels(brand);
            const models = await this.getModels(brand);
            modelsByBrand.push({ id: brand, models })
        }

        return modelsByBrand;
    }

    private async getMinMaxPrice(): Promise<{ min: number; max: number }> {
        const result = await this.offerRepository
            .createQueryBuilder('car')
            .select('MIN(car.price)', 'min')
            .addSelect('MAX(car.price)', 'max')
            .where('car.price IS NOT NULL')
            .getRawOne();

        return {
            min: Number(result.min),
            max: Number(result.max)
        };
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
            models,
            priceRange
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
            this.getAllModels(),
            this.getMinMaxPrice()
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
            models,
            priceRange
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
        sort: string = 'publishedDate',
        order: string = 'desc',
        filters: Record<string, any> = {},
    ): Promise<{ cars: ResponseCar[]; total: number }> {
        const skip = (page - 1) * pageSize;

        const queryBuilder = this.offerRepository.createQueryBuilder('car')
            .leftJoinAndSelect('car.details', 'details')
            .leftJoinAndSelect('car.specification', 'specification')
            .leftJoinAndSelect('car.images', 'images');

        // Przygotowanie filtrów (opcjonalnie)
        const where = this.prepareFilters(filters);
        if (Object.keys(where).length > 0) {
            queryBuilder.where(where);
        }

        // Mapowanie sortowania do odpowiednich tabel
        let sortColumn: string;
        if (['brand', 'model', 'productionYear'].includes(sort)) {
            sortColumn = `details.${sort}`;
        } else if (['fuelType', 'engineCapacity'].includes(sort)) {
            sortColumn = `specification.${sort}`;
        } else {
            sortColumn = `car.${sort}`;
        }

        queryBuilder.orderBy(sortColumn, order.toUpperCase() as 'ASC' | 'DESC');

        const [cars, total] = await queryBuilder.skip(skip).take(pageSize).getManyAndCount();

        return {
            cars: cars.map(mapCarToResponse),
            total
        };
    }

    private prepareFilters(filters: Record<string, any>): any {
        const where: any = {};

        // Usuwamy parametry paginacji i sortowania

        const { page, pageSize, sort, order, priceFrom, priceTo, ...actualFilters } = filters;
        // Obsługa filtru ceny
        if (priceFrom && priceTo) {
            where.price = Between(Number(priceFrom), Number(priceTo));
        } else if (priceFrom) {
            where.price = MoreThanOrEqual(Number(priceFrom));
        } else if (priceTo) {
            where.price = LessThanOrEqual(Number(priceTo));
        }

        // Mapowanie filtrów z frontendu na strukturę bazy danych
        Object.entries(actualFilters).forEach(([key, value]) => {
            switch (key) {
                case 'make':
                    // Jeśli value jest tablicą, używamy operatora In, w przeciwnym razie przypisujemy wartość bez zmian
                    where.details = {
                        ...where.details,
                        brand: Array.isArray(value) ? In(value) : value
                    };
                    break;
                case 'model':
                    where.details = {
                        ...where.details,
                        model: Array.isArray(value) ? In(value) : value
                    };
                    break;
                case 'trim':
                    where.details = { ...where.details, version: value };
                    break;
                // case 'priceFrom':
                //     where.price = { ...where.price, gte: Number(value) };
                //     break;
                // case 'priceTo':
                //     where.price = { ...where.price, lte: Number(value) };
                //     break;
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

    private convertPolishDateToJSDate(polishDate: string): Date {
        const months = {
            'stycznia': '01', 'lutego': '02', 'marca': '03', 'kwietnia': '04',
            'maja': '05', 'czerwca': '06', 'lipca': '07', 'sierpnia': '08',
            'września': '09', 'października': '10', 'listopada': '11', 'grudnia': '12'
        };

        // Zamień polskie nazwy miesięcy na numery
        let dateStr = polishDate;
        for (const [polishMonth, monthNumber] of Object.entries(months)) {
            dateStr = dateStr.replace(polishMonth, monthNumber);
        }

        // Zamień na format YYYY-MM-DD HH:mm
        const [day, month, year, time] = dateStr.split(' ');
        const formattedDate = `${year}-${month}-${day.padStart(2, '0')} ${time}`;

        return new Date(formattedDate);
    }

    public async createFromCar(car: CarI): Promise<Car> {
        const offer = new Car();

        offer.url = car.url;
        offer.title = `${car.details.brand} ${car.details.model} ${car.details.version}`.trim();
        offer.externalId = car.url.split('/').pop() || '';
        offer.price = car.price;
        offer.publishedDate = this.convertPolishDateToJSDate(car.originalDate);

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

    public async getBrandsAndModels(): Promise<{ brands: string[]; models: { id: string, models }[] }> {
        const [brands, models] = await Promise.all([
            this.getBrands(),
            this.getAllModels()
        ]);
        return { brands, models };
    }

    public async remove(id: number): Promise<void> {
        const car = await this.offerRepository.findOne({
            where: { id },
            relations: ['details', 'specification', 'images']
        });

        if (!car) {
            throw new NotFoundException(`Car with ID ${id} not found`);
        }

        // First remove the images
        if (car.images && car.images.length > 0) {
            await this.offerRepository
                .createQueryBuilder()
                .delete()
                .from('car_images')
                .where('offerId = :id', { id })
                .execute();
        }

        // Then remove the car (which will cascade delete details and specification)
        await this.offerRepository.remove(car);
    }

    public async findCarsWithMissingDates(): Promise<Car[]> {
        return await this.offerRepository.find({
            where: { publishedDate: IsNull() },
            select: ['id', 'url']
        });
    }

    public async updateCarDate(id: number, date: string): Promise<void> {
        const car = await this.offerRepository.findOne({
            where: { id }
        });

        if (!car) {
            throw new NotFoundException(`Car with ID ${id} not found`);
        }

        car.publishedDate = new Date(date);
        await this.offerRepository.save(car);
    }
}
