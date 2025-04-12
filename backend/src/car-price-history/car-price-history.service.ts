import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { CAR_PRICE_HISTORY_REPOSITORY } from './car-price-history.contracts';
import { CarPriceHistory } from './car-price-history.entity';
import { Car } from '@/car/car.entity';
import { MoreThan, Repository } from 'typeorm';
import { CAR_REPOSITORY } from '@/car/car.contracts';
import { CrawlerService } from '@/crawler/crawler.service';
import { SettingsService } from '@/settings/settings.service';
import { Cron } from '@nestjs/schedule';
import { SettingsKey } from '@/settings/settings-keys.enum';
import { CarService } from '@/car/car.service';

@Injectable()
export class CarPriceHistoryService {
    private readonly logger = new Logger(CarPriceHistoryService.name);

    constructor(
        @Inject(CarService)
        private carService: CarService,
        @Inject(forwardRef(() => CrawlerService))
        private crawlerService: CrawlerService,
        private settingsService: SettingsService,
        @Inject(CAR_PRICE_HISTORY_REPOSITORY)
        private carPriceHistoryRepository: Repository<CarPriceHistory>,
    ) { }

    async addPriceHistory(carId: number, oldPrice: number): Promise<CarPriceHistory> {
        const priceHistory = new CarPriceHistory();
        priceHistory.carId = carId;
        priceHistory.price = oldPrice;
        return await this.carPriceHistoryRepository.save(priceHistory);
    }


    async getCarPriceHistory(carId: number): Promise<CarPriceHistory[]> {
        return await this.carPriceHistoryRepository.find({
            where: { carId },
            order: { createdAt: 'DESC' }
        });
    }

    @Cron('0 */2 * * *') // Run every 2 hours
    async trackCarPrices() {
        await this.processNextBatch();
    }

    public async processNextBatch(): Promise<{}> {
        this.logger.log('Starting car price tracking...');
        let processedCount = 0;

        try {
            // Get last checked ID from settings
            const lastCheckedIdSetting = await this.settingsService.getSetting<{ value: number }>(SettingsKey.LAST_CHECKED_CAR_ID);
            const lastCheckedId = lastCheckedIdSetting?.value ?? 0;

            // Get next batch of 100 active cars
            const cars = await this.carService.getActiveCarsAfterId(lastCheckedId);

            if (cars.length === 0) {
                // If no cars found, reset lastCheckedId to start from beginning
                await this.settingsService.setSetting(SettingsKey.LAST_CHECKED_CAR_ID, { value: 0 });
                this.logger.log('No more cars to check. Resetting to start.');
                return { processedCount: 0, lastCheckedId: 0 };
            }

            for (const car of cars) {
                try {
                    console.time(`Processing car ${car.id}`);
                    this.logger.log(`Checking car ${car.id}`);
                    // Check if car still exists and get current price
                    const currentData = await this.crawlerService.checkCarOffer(car.url);

                    if (!currentData) {
                        // Some error occurred, but we don't know if the offer exists or not
                        this.logger.error(`Error checking car ${car.id} - skipping`);
                        continue;
                    }

                    if (!currentData.exists) {
                        // Car offer no longer exists
                        car.isActive = false;
                        await this.carService.save(car);
                        this.logger.log(`Car ${car.id} marked as inactive - offer no longer exists`);
                        continue;
                    }

                    const oldPrice = car.price;
                    const newPrice = currentData.price;
                    // If price has changed, add to history
                    if (newPrice !== oldPrice) {
                        await this.addPriceHistory(car.id, oldPrice);
                        car.price = newPrice;
                        await this.carService.save(car);
                        this.logger.log(`Updated price for car ${car.id}: old ${oldPrice} new ${newPrice}. Car offer url: ${car.url}`);
                    }
                    processedCount++;
                } catch (error) {
                    this.logger.error(`Error processing car ${car.id}: ${error.message}`);
                } finally {
                    const newLastCheckedId = car.id;
                    await this.settingsService.setSetting(SettingsKey.LAST_CHECKED_CAR_ID, { value: newLastCheckedId });
                    console.timeEnd(`Processing car ${car.id}`);
                }
            }

            return {};
        } catch (error) {
            this.logger.error('Error in car price tracking:', error);
            throw error;
        }
    }
}
