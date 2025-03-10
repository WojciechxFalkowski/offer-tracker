import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TrackedUrl } from './tracked-url.entity';
import { CreateTrackedUrlDto } from './tracked-url.dto';
import { TRACKED_URL_REPOSITORY } from './tracked-url.contracts';

@Injectable()
export class TrackedUrlService {
    constructor(
        @Inject(TRACKED_URL_REPOSITORY)
        private trackedUrlRepository: Repository<TrackedUrl>,
    ) { }

    public async create(createTrackedUrlDto: CreateTrackedUrlDto) {
        if (!createTrackedUrlDto.url) return;

        const trackedUrl = this.trackedUrlRepository.create(createTrackedUrlDto);
        return this.trackedUrlRepository.save(trackedUrl);
    }

    public async findAll() {
        return this.trackedUrlRepository.find({
            order: { createdAt: 'DESC' },
            relations: ['offers'],
        });
    }

    public async findOne(id: number) {
        const trackedUrl = await this.trackedUrlRepository.findOne({
            where: { id },
            relations: ['offers'],
        });

        if (!trackedUrl) {
            throw new NotFoundException('Tracked URL not found');
        }

        return trackedUrl;
    }

    public async remove(id: number) {
        const trackedUrl = await this.trackedUrlRepository.findOne({ where: { id }, relations: ['offers'] });

        if (!trackedUrl) {
            throw new Error('Tracked URL not found');
        }

        // Sprawdzanie, czy są powiązane oferty
        if (trackedUrl.offers.length > 0) {
            throw new Error('Cannot delete Tracked URL with existing offers');
        }

        return this.trackedUrlRepository.remove(trackedUrl);
    }


    public async findAllWithOfferCount() {
        return this.trackedUrlRepository
            .createQueryBuilder('trackedUrl')
            .leftJoinAndSelect('trackedUrl.offers', 'offer')
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
