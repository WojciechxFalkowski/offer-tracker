import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TrackedUrl } from './tracked-url.entity';
import { CreateTrackedUrlDto, UpdateTrackedUrlDto } from './tracked-url.dto';
import { TRACKED_URL_REPOSITORY } from './tracked-url.contracts';
import { CarService } from '../car/car.service';

@Injectable()
export class TrackedUrlService {
    constructor(
        @Inject(TRACKED_URL_REPOSITORY)
        private trackedUrlRepository: Repository<TrackedUrl>,
        private readonly carService: CarService,
    ) { }

    public async create(createTrackedUrlDto: CreateTrackedUrlDto) {
        if (!createTrackedUrlDto.url) return;

        const trackedUrl = this.trackedUrlRepository.create(createTrackedUrlDto);
        return this.trackedUrlRepository.save(trackedUrl);
    }

    public async findAll() {
        const trackedUrls = await this.trackedUrlRepository.find({
            order: { createdAt: 'DESC' },
        });

        const trackedUrlsWithCounts = await Promise.all(
            trackedUrls.map(async (trackedUrl) => {

                let matchingCarsCount = 0;

                if (trackedUrl.brand && trackedUrl.model) {
                    const { total } = await this.carService.findAll(
                        1,
                        1,
                        'createdAt',
                        'desc',
                        {
                            make: trackedUrl.brand,
                            model: trackedUrl.model
                        }
                    );
                    matchingCarsCount = total;
                }
                return {
                    ...trackedUrl,
                    matchingCarsCount
                };
            })
        );

        return trackedUrlsWithCounts;
    }

    public async findOne(id: number) {
        const trackedUrl = await this.trackedUrlRepository.findOne({
            where: { id },
        });

        if (!trackedUrl) {
            throw new NotFoundException('Tracked URL not found');
        }

        return trackedUrl;
    }

    public async remove(id: number) {
        const trackedUrl = await this.trackedUrlRepository.findOne({ where: { id } });

        if (!trackedUrl) {
            throw new Error('Tracked URL not found');
        }

        return this.trackedUrlRepository.remove(trackedUrl);
    }

    public async update(id: number, updateTrackedUrlDto: UpdateTrackedUrlDto) {
        const trackedUrl = await this.findOne(id);

        // Validate brand if provided
        if (updateTrackedUrlDto.brand) {
            const brands = await this.carService.getBrands();
            if (!brands.includes(updateTrackedUrlDto.brand)) {
                throw new BadRequestException(`Invalid brand. Available brands: ${brands.join(', ')}`);
            }
        }

        // Validate model if provided
        if (updateTrackedUrlDto.model) {
            const models = await this.carService.getModels(updateTrackedUrlDto.brand);
            if (!models.includes(updateTrackedUrlDto.model)) {
                throw new BadRequestException(`Invalid model. Available models: ${models.join(', ')}`);
            }
        }

        Object.assign(trackedUrl, updateTrackedUrlDto);
        return this.trackedUrlRepository.save(trackedUrl);
    }

    public async findAllWithOfferCount() {
        return this.trackedUrlRepository
            .createQueryBuilder('trackedUrl')
            .select('trackedUrl.id', 'id')
            .addSelect('trackedUrl.url', 'url')
            .addSelect('trackedUrl.description', 'description')
            .addSelect('trackedUrl.createdAt', 'createdAt')
            .addSelect('COUNT(offer.id)', 'offerCount')
            .groupBy('trackedUrl.id')
            .orderBy('trackedUrl.createdAt', 'DESC')
            .getRawMany();
    }
}
