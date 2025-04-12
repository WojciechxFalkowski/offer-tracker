import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Page } from 'playwright';
import { CarI, CarDetails, CarSpecification, OnlyMileageRequired } from './crawler.types';
import { createBrowserPage, handleCookieBanner } from '../utils/browser.utils';
import { TrackedUrlService } from 'src/tracked-url/tracked-url.service';
import { CarService } from 'src/car/car.service';
import { MONTHS_MAP } from 'src/utils/date.utils';
import { SettingsService } from '@/settings/settings.service';
import { SettingsKey } from '@/settings/settings-keys.enum';

@Injectable()
export class CrawlerService implements OnModuleInit {
	private readonly logger = new Logger(CrawlerService.name);
	private readonly baseUrl = 'https://www.otomoto.pl';
	private readonly maxAllowedPages = Infinity;
	private readonly maxPagesToScrape: number = 10;
	private readonly maxOffersToScrape: number = Infinity;
	private readonly CONSECUTIVE_EXISTING_OFFERS_THRESHOLD = Infinity;// 3;
	private readonly NAVIGATION_TIMEOUT = 15000;

	constructor(
		private trackedUrlService: TrackedUrlService,
		private offerService: CarService,
		private settingsService: SettingsService
	) { }

	async onModuleInit() {
		await this.scheduleNextRun();
	}

	private async scheduleNextRun() {
		const scrapingConfig = await this.settingsService.getSetting<{ frequencyInMinutes: number }>(
			SettingsKey.SCRAPING_SETTINGS,
		);

		const frequencyInMinutes = scrapingConfig?.frequencyInMinutes ?? 60;
		const milliseconds = frequencyInMinutes * 60 * 1000;

		console.log(`scheduleNextRun -> ${scrapingConfig?.frequencyInMinutes}`);

		setTimeout(async () => {
			await this.handleCron();
			await this.scheduleNextRun();
		}, milliseconds);
	}


	// @Cron(CronExpression.EVERY_HOUR)
	public async handleCron() {
		this.logger.log('Running scheduled crawler job');
		const trackedUrls = await this.trackedUrlService.findAll();

		await this.crawlAllTrackedUrls(trackedUrls.map(trackedUrl => trackedUrl.url), { autoSave: true });
	}

	public async crawlAllTrackedUrls(trackedUrls: string[], config: { autoSave: boolean }): Promise<{ offers: CarI[] }> {

		const cars: CarI[] = []
		for (const trackedUrl of trackedUrls) {
			try {
				this.logger.log(`Crawling URL: ${trackedUrl}`);

				const trackedUrlOffers = await this.scrapeAllOffers(
					trackedUrl,
					this.maxPagesToScrape,
					this.maxOffersToScrape
				);

				this.logger.log(`Found ${trackedUrlOffers.length} offers for URL: ${trackedUrl}`);

				if (config.autoSave) {
					await this.saveAllTrackedUrls(trackedUrlOffers);
				}

				cars.push(...trackedUrlOffers)

			} catch (error) {
				this.logger.error(`Error crawling URL ${trackedUrl}:`, error);
			}
		}


		return { offers: cars };
	}


	public async saveAllTrackedUrls(offers: CarI[]) {
		const newOffersCount = await this.processAndSaveOffers(offers);
		this.logger.log(`Added ${newOffersCount} new offers.`);
	}

	private async processAndSaveOffers(offers: CarI[]): Promise<number> {
		let newOffersCount = 0;

		for (const offer of offers) {
			const existingOffer = await this.offerService.findByUrl(offer.url);

			if (!existingOffer) {
				await this.offerService.createFromCar(offer);
				newOffersCount++;
				this.logger.log(
					`Added new offer: ${offer.details.brand} ${offer.details.model} from ${offer.url}`
				);
			} else {
				this.logger.debug(`Offer already exists: ${offer.url}`);
			}
		}

		return newOffersCount;
	}

	public async scrapeAllOffers(
		startUrl: string,
		maxPages: number,
		maxOffers: number
	): Promise<CarI[]> {
		this.validateUrl(startUrl);
		console.time('scrapeAllOffers');
		console.time('collectUrls');
		const { browser, page } = await createBrowserPage();

		let offerUrls: string[] = [];
		try {
			await page.goto(startUrl, { waitUntil: 'networkidle', timeout: this.NAVIGATION_TIMEOUT });

			const totalAvailablePages = await this.getMaxPage(page);
			const pagesToScrape = this.calculatePagesToScrape(maxPages, totalAvailablePages);

			this.logger.log(`Scraping up to ${pagesToScrape} pages out of ${totalAvailablePages} available`);

			offerUrls = await this.collectOfferUrls(startUrl, pagesToScrape, page);
		} catch (error) {
			this.logger.error(`Timeout or navigation error on URL: ${startUrl}`, error);
			return [];
		} finally {
			await browser.close(); // konieczne zamknięcie po zebraniu URL-i
			console.timeEnd('collectUrls');
		}

		console.time('filterUrls');
		const filteredOfferUrls = await this.filterExistingOfferUrls(offerUrls);
		console.timeEnd('filterUrls');

		const offersToScrape = this.calculateOffersToScrape(maxOffers, filteredOfferUrls.length);
		const offers: CarI[] = [];

		console.time('scrapeOfferDetails');
		const batchSize = 5;

		for (let i = 0; i < offersToScrape; i += batchSize) {
			const batchUrls = filteredOfferUrls.slice(i, i + batchSize);

			const batchResults = await Promise.all(
				batchUrls.map(async (url, idx) => {
					console.time(`offer-${i + idx}`);
					try {
						return await this.scrapeOfferDetails(url);
					} catch (error) {
						this.logger.error(`Failed to scrape offer at URL: ${url}`, error);
						return null;
					} finally {
						console.timeEnd(`offer-${i + idx}`);
					}
				})
			);

			offers.push(...batchResults.filter(Boolean) as CarI[]);
		}

		console.timeEnd('scrapeOfferDetails');
		console.timeEnd('scrapeAllOffers');

		return offers;
	}



	// public async scrapeAllOffers(
	//     startUrl: string,
	//     maxPages: number,
	//     maxOffers: number
	// ): Promise<CarI[]> {
	//     this.validateUrl(startUrl);
	//     console.time('scrapeAllOffers');
	//     const { browser, page } = await createBrowserPage();

	//     try {
	//         console.time('collectUrls');
	//         console.log('v1');
	//         await page.goto(startUrl, { waitUntil: 'networkidle' });

	//         const totalAvailablePages = await this.getMaxPage(page);
	//         const pagesToScrape = this.calculatePagesToScrape(maxPages, totalAvailablePages);

	//         this.logger.log(`Scraping up to ${pagesToScrape} pages out of ${totalAvailablePages} available`);

	//         const offerUrls: string[] = await this.collectOfferUrls(startUrl, pagesToScrape, page);

	//         console.timeEnd('collectUrls');

	//         console.time('filterUrls');
	//         // Filtruj URL-e ofert, usuwając te, które już istnieją w bazie danych
	//         const filteredOfferUrls = await this.filterExistingOfferUrls(offerUrls);
	//         console.timeEnd('filterUrls');

	//         const offersToScrape = this.calculateOffersToScrape(maxOffers, filteredOfferUrls.length);
	//         const offers: CarI[] = [];

	//         console.time('scrapeOfferDetails');
	//         for (let i = 0; i < offersToScrape; i++) {
	//             if (i % 10 === 0) {
	//                 this.logger.log(`Processing offer ${i}/${offersToScrape}`);
	//             }

	//             console.time(`offer-${i}`);
	//             offers.push(await this.scrapeOfferDetails(filteredOfferUrls[i]));
	//             console.timeEnd(`offer-${i}`);
	//         }

	//         console.timeEnd('scrapeOfferDetails');
	//         return offers;
	//     } finally {
	//         await browser.close();

	//         console.timeEnd('scrapeAllOffers');
	//     }
	// }

	/**
	 * Filters offer URLs by removing those that already exist in the database.
	 * Stops checking after finding CONSECUTIVE_EXISTING_OFFERS_THRESHOLD consecutive existing offers to optimize performance.
	 * 
	 * @param offerUrls Array of offer URLs to check
	 * @returns Filtered array of offer URLs that don't exist in the database
	 */
	private async filterExistingOfferUrls(offerUrls: string[]): Promise<string[]> {
		if (!offerUrls.length) return [];

		const filteredUrls: string[] = [];
		let consecutiveExistingOffers = 0;

		for (let i = 0; i < offerUrls.length; i++) {
			// Check if offer exists in database
			const existingOffer = await this.offerService.findByUrl(offerUrls[i]);

			if (existingOffer) {
				// Offer already exists, increment counter
				consecutiveExistingOffers++;
				this.logger.debug(`Offer already exists: ${offerUrls[i]}`);

				// If we found 3 consecutive existing offers, stop processing
				if (consecutiveExistingOffers >= this.CONSECUTIVE_EXISTING_OFFERS_THRESHOLD) {
					this.logger.log(`Found ${this.CONSECUTIVE_EXISTING_OFFERS_THRESHOLD} consecutive existing offers, stopping further checks`);
					break;
				}
			} else {
				// Offer doesn't exist, add to filtered list and reset counter
				filteredUrls.push(offerUrls[i]);
				consecutiveExistingOffers = 0;
			}
		}

		this.logger.log(`Filtered ${offerUrls.length - filteredUrls.length} existing offers out of ${offerUrls.length}`);
		return filteredUrls;
	}


	private validateUrl(url: string): void {
		if (!url.startsWith(this.baseUrl)) {
			throw new Error('Invalid URL. It must start with the base URL.');
		}
	}

	private calculatePagesToScrape(maxPages: number, totalAvailablePages: number): number {
		return maxPages === -1
			? Math.min(totalAvailablePages, this.maxAllowedPages)
			: Math.min(maxPages, totalAvailablePages);
	}

	private calculateOffersToScrape(maxOffers: number, availableOffers: number): number {
		return maxOffers === -1
			? availableOffers
			: Math.min(maxOffers, availableOffers);
	}

	private async collectOfferUrls(
		baseUrl: string,
		pagesToScrape: number,
		page: Page
	): Promise<string[]> {
		const offerUrls: string[] = []
		for (let pageNum = 1; pageNum <= pagesToScrape; pageNum++) {
			const pageUrl = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}page=${pageNum}`;
			this.logger.log(`Scraping page: ${pageUrl}`);

			await page.goto(pageUrl, { waitUntil: 'networkidle' });
			const links = await this.extractOfferLinks(page);
			offerUrls.push(...links)
		}
		return offerUrls
	}

	private async getMaxPage(page: Page): Promise<number> {
		try {
			// Szukamy elementów paginacji po ich roli i strukturze, a nie po klasach
			const paginationItems = await page.$$('main div div div div ul li[aria-disabled="false"]');

			if (!paginationItems || paginationItems.length === 0) {
				return 1; // Jeśli nie ma elementów paginacji, zwróć 1
			}

			// Zbieramy wszystkie numery stron
			const pageNumbers: number[] = [];
			for (const item of paginationItems) {
				const text = await item.textContent();
				if (text) {
					const num = parseInt(text.trim(), 10);
					if (!isNaN(num)) {
						pageNumbers.push(num);
					}
				}
			}

			// Zwracamy największy numer strony lub 1 jeśli nie znaleziono żadnego
			return pageNumbers.length > 0 ? Math.max(...pageNumbers) : 1;
		} catch (error) {
			this.logger.warn(`Error getting max page: ${error.message}`);
			return 1; // W przypadku błędu zwróć 1
		}
	}

	public async scrapeOfferDetails(offerUrl: string): Promise<CarI> {
		const { browser, page } = await createBrowserPage();
		console.log(`scrapeOfferDetails url: ${offerUrl}`);

		try {
			try {
				await page.goto(offerUrl, { waitUntil: 'networkidle', timeout: this.NAVIGATION_TIMEOUT });
			} catch (error) {
				this.logger.error(`Timeout or navigation error for offer URL: ${offerUrl}`, error);
				throw error;
			}

			await handleCookieBanner(page);
			let successCount = 0;
			let errorCount = 0;

			const { date: offerDate, id: offerId, errorCount: formattedDateErrorCount, successCount: formattedDateSuccessCount } = await this.extractFormattedDate(page);

			const { images, errorCount: imagesErrorCount, successCount: imagesSuccessCount } = await this.extractOfferImages(page);

			const { specification: specificationDetails, errorCount: specificationErrorCount, successCount: specificationSuccessCount } = await this.extractOfferSpecification(page);

			const { mainDetails, errorCount: mainDetailsErrorCount, successCount: mainDetailsSuccessCount } = await this.extractOfferMainDetails(page);

			const specification = { mileage: mainDetails.mileage, ...specificationDetails };

			const { details, errorCount: offerBasicDetailsErrorCount, successCount: offerBasicDetailsSuccessCount } = await this.extractOfferBasicDetails(page);

			// const offerId = await this.extractOfferId(page);
			const { date: originalDate, errorCount: originalDateErrorCount, successCount: originalDateSuccessCount } = await this.extractOfferDate(page);

			const { price, errorCount: priceErrorCount, successCount: priceSuccessCount } = await this.extractOfferPrice(page);

			// Sumujemy liczniki z metod, by uzyskać globalny wynik
			successCount += formattedDateSuccessCount + imagesSuccessCount + offerBasicDetailsSuccessCount + specificationSuccessCount + mainDetailsSuccessCount + originalDateSuccessCount
				+ priceSuccessCount;
			errorCount += formattedDateErrorCount + imagesErrorCount + offerBasicDetailsErrorCount + specificationErrorCount + mainDetailsErrorCount + originalDateErrorCount + priceErrorCount;

			console.log(`✅ Udało się pobrać ${successCount} z ${successCount + errorCount} pól.`);
			console.log(`❌ Wystąpiły błędy przy ${errorCount} polach.`);

			return {
				publishedDate: offerDate,
				url: offerUrl,
				details,
				specification,
				images,
				offerId,
				originalDate,
				price
			};
		} catch (error) {
			this.logger.error(`Error while scraping details for URL: ${offerUrl}`, error);
			throw error; // Ponowne rzucenie wyjątku, by wyżej go obsłużyć
		} finally {
			await browser.close(); // ✅ Zawsze zamykaj przeglądarkę
		}
	}

	private async extractOfferImages(page: Page): Promise<{ images: string[], errorCount: number, successCount: number }> {
		let errorCount = 0;
		let successCount = 0;
		try {
			const imagesLocator = page.locator('.embla__viewport > .embla__container > [data-testid="photo-gallery-item"] > div > img');
			const srcList = await imagesLocator.evaluateAll((imgs) =>
				imgs.map((img) => img.getAttribute('src')).filter((src): src is string => src !== null)
			);
			if (srcList.length > 0) {
				successCount++;
			} else {
				console.error('Brak obrazów');
				errorCount++;
			}
			return { images: srcList, errorCount, successCount };
		} catch {
			console.error('Błąd obrazów');
			errorCount++;
			return { images: [], errorCount, successCount };
		}
	}


	// private async extractOfferMainDetails(page: Page): Promise<Record<string, string>> {
	//     const details: Record<string, string> = {};
	//     const elements = await page.$$('[data-testid="main-details-section"] [data-testid="detail"]');

	//     for (const element of elements) {
	//         const label = await element.$eval('p:first-of-type', el => el.textContent?.trim() || '');
	//         const value = await element.$eval('p:last-of-type', el => el.textContent?.trim() || '');
	//         if (label && value) details[label] = value;
	//     }

	//     return details;
	// }


	private async extractOfferMainDetails(page: Page): Promise<{ mainDetails: OnlyMileageRequired, errorCount: number, successCount: number }> {
		let errorCount = 0;
		let successCount = 0;
		let mileage = '';
		try {
			const mainDetailsWrapperLocator = page.getByTestId('main-details-section');
			const mileageWrapperLocator = mainDetailsWrapperLocator
				.getByTestId('detail')
				.locator('p:has-text("Przebieg") + p');
			const mileageText = await mileageWrapperLocator.textContent();
			mileage = mileageText ?? '';
			if (mileage) {
				successCount++;
			} else {
				console.error("Brak przebiegu");
				errorCount++;
			}
			return { mainDetails: { mileage }, errorCount, successCount };
		} catch (error: any) {
			console.error("Błąd przy pobieraniu przebiegu:", error.message);
			errorCount++;
			return { mainDetails: { mileage: '' }, errorCount, successCount };
		}
	}

	// private async extractOfferMainDetails(page: Page): Promise<OnlyMileageRequired> {

	// 	const mainDetailsWrapperLocator = await page.getByTestId('main-details-section')
	// 	const mileageWrapperLocator = await mainDetailsWrapperLocator.getByTestId('detail').locator('p:has-text("Przebieg") + p')
	// 	const mileage = await mileageWrapperLocator.textContent() ?? '';

	// 	return { mileage }
	// }

	private async extractOfferSpecification(page: Page): Promise<{ specification: Omit<CarSpecification, 'mileage'>, errorCount: number, successCount: number }> {
		let errorCount = 0;
		let successCount = 0;
		try {
			const specificationWrapperLocator = page.getByText('SpecyfikacjaRodzaj');
			const specificationLocator = specificationWrapperLocator.getByRole('button', { name: 'Specyfikacja' });
			if (await specificationLocator.count() > 0) {
				await specificationLocator.click();
			}

			const fuelType = await specificationWrapperLocator
				.getByTestId('fuel_type')
				.locator('p:has-text("Rodzaj paliwa") + p')
				.textContent() ?? '';
			fuelType ? successCount++ : errorCount++;

			const engineCapacity = await specificationWrapperLocator
				.getByTestId('engine_capacity')
				.locator('p:has-text("Pojemność skokowa") + p')
				.textContent() ?? '';
			engineCapacity ? successCount++ : errorCount++;

			const power = await specificationWrapperLocator
				.getByTestId('engine_power')
				.locator('p:has-text("Moc") + p')
				.textContent() ?? '';
			power ? successCount++ : errorCount++;

			const bodyType = await specificationWrapperLocator
				.getByTestId('body_type')
				.locator('p:has-text("Typ nadwozia") + p')
				.textContent() ?? '';
			bodyType ? successCount++ : errorCount++;

			const gearbox = await specificationWrapperLocator
				.getByTestId('gearbox')
				.locator('p:has-text("Skrzynia biegów") + p')
				.textContent() ?? '';
			gearbox ? successCount++ : errorCount++;

			const drive = await specificationWrapperLocator
				.getByTestId('transmission')
				.locator('p:has-text("Napęd") + p')
				.textContent() ?? '';
			drive ? successCount++ : errorCount++;

			const specification: Omit<CarSpecification, 'mileage'> = {
				fuelType,
				engineCapacity,
				power,
				bodyType,
				gearbox,
				drive,
			};

			return { specification, errorCount, successCount };
		} catch (error: any) {
			console.warn(`Error extracting offer 'extractOfferSpecification': ${error.message}`);
			errorCount++;
			return {
				specification: { fuelType: '', engineCapacity: '', power: '', bodyType: '', gearbox: '', drive: '' },
				errorCount,
				successCount
			};
		}
	}


	// private async extractOfferSpecification(page: Page): Promise<Omit<CarSpecification, 'mileage'>> {
	// 	try {
	// 		const specificationWrapperLocator = await page.getByText('SpecyfikacjaRodzaj')
	// 		const specificationLocator = await specificationWrapperLocator.getByRole('button', { name: 'Specyfikacja' })
	// 		if (specificationLocator) {
	// 			specificationLocator.click();
	// 		}

	// 		const fuelType = await specificationWrapperLocator.getByTestId('fuel_type').locator('p:has-text("Rodzaj paliwa") + p').textContent() ?? ''
	// 		const engineCapacity = await specificationWrapperLocator.getByTestId('engine_capacity').locator('p:has-text("Pojemność skokowa") + p').textContent() ?? ''
	// 		const power = await specificationWrapperLocator.getByTestId('engine_power').locator('p:has-text("Moc") + p').textContent() ?? ''
	// 		const bodyType = await specificationWrapperLocator.getByTestId('body_type').locator('p:has-text("Typ nadwozia") + p').textContent() ?? ''
	// 		const gearbox = await specificationWrapperLocator.getByTestId('gearbox').locator('p:has-text("Skrzynia biegów") + p').textContent() ?? ''
	// 		const drive = await specificationWrapperLocator.getByTestId('transmission').locator('p:has-text("Napęd") + p').textContent() ?? ''

	// 		const mainDetails: Omit<CarSpecification, 'mileage'> = {
	// 			fuelType,
	// 			engineCapacity,
	// 			power,
	// 			bodyType,
	// 			gearbox,
	// 			drive
	// 		};
	// 		return mainDetails
	// 	} catch (error) {
	// 		console.warn(`Error extracting offer 'extractOfferSpecification': ${error.message}`);
	// 		throw error;
	// 	}
	// }

	private async extractVin(page: Page): Promise<{ vin: string | null, errorCount: number, successCount: number }> {
		let errorCount = 0;
		let successCount = 0;
		try {
			const advertVin = page.getByTestId('advert-vin');
			const vinButton = advertVin.locator('button');
			if (await vinButton.count() === 0) {
				console.error('Nie znaleziono przycisku VIN');
				errorCount++;
				return { vin: null, errorCount, successCount };
			}
			await vinButton.click();

			const vinParagraph = advertVin.locator('p');
			await vinParagraph.waitFor({ timeout: 10000 });

			if (await vinParagraph.count() === 0) {
				console.error('Nie znaleziono elementu VIN');
				errorCount++;
				return { vin: null, errorCount, successCount };
			}
			const vinText = await vinParagraph.textContent();
			if (vinText) {
				successCount++;
			}
			return { vin: vinText, errorCount, successCount };
		} catch {
			console.error('Błąd VIN');
			errorCount++;
			return { vin: null, errorCount, successCount };
		}
	}

	private async extractOfferBasicDetails(page: Page): Promise<{ details: CarDetails, errorCount: number, successCount: number }> {
		// Extract VIN along with its error count
		const { vin, successCount: vinSuccessCount, errorCount: vinErrorCount } = await this.extractVin(page);

		const basicInfoWrapperLocator = page.getByTestId('combined-details-and-equipment-section');

		// Liczniki poprawnych i błędnych odczytów (VIN error count jest wliczony)
		let successCount = vinSuccessCount;
		let errorCount = vinErrorCount;

		let brand: string | null = null;
		try {
			brand = await basicInfoWrapperLocator
				.getByTestId('make')
				.locator('p:has-text("Marka pojazdu") + p')
				.textContent({ timeout: 1000 }) ?? null;
			successCount++;
		} catch {
			console.error('Błąd marki');
			errorCount++;
		}

		let model: string | null = null;
		try {
			model = await basicInfoWrapperLocator
				.getByTestId('model')
				.locator('p:has-text("Model pojazdu") + p')
				.textContent({ timeout: 1000 }) ?? null;
			successCount++;
		} catch {
			console.error('Błąd modelu');
			errorCount++;
		}

		let version: string | null = null;
		try {
			version = await basicInfoWrapperLocator
				.getByTestId('version')
				.locator('p:has-text("Wersja") + p')
				.textContent({ timeout: 1000 }) ?? null;
			successCount++;
		} catch {
			console.error('Błąd wersji');
			errorCount++;
		}

		let color: string | null = null;
		try {
			color = await basicInfoWrapperLocator
				.getByTestId('color')
				.locator('p:has-text("Kolor") + p')
				.textContent({ timeout: 1000 }) ?? null;
			successCount++;
		} catch {
			console.error('Błąd koloru');
			errorCount++;
		}

		let doorCount: string | null = null;
		try {
			doorCount = await basicInfoWrapperLocator
				.getByTestId('door_count')
				.locator('p:has-text("Liczba drzwi") + p')
				.textContent({ timeout: 1000 }) ?? null;
			successCount++;
		} catch {
			console.error('Błąd drzwi');
			errorCount++;
		}

		let seatCount: string | null = null;
		try {
			seatCount = await basicInfoWrapperLocator
				.getByTestId('nr_seats')
				.locator('p:has-text("Liczba miejsc") + p')
				.textContent({ timeout: 1000 }) ?? null;
			successCount++;
		} catch {
			console.error('Błąd miejsc');
			errorCount++;
		}

		let productionYear: string | null = null;
		try {
			productionYear = await basicInfoWrapperLocator
				.getByTestId('year')
				.locator('p:has-text("Rok produkcji") + p')
				.textContent({ timeout: 1000 }) ?? null;
			successCount++;
		} catch {
			console.error('Błąd roku');
			errorCount++;
		}

		let generation: string | null = null;
		try {
			generation = await basicInfoWrapperLocator
				.getByTestId('generation')
				.locator('p:has-text("Generacja") + p')
				.textContent({ timeout: 1000 }) ?? null;
			successCount++;
		} catch {
			console.error('Błąd generacji');
			errorCount++;
		}

		const details: CarDetails = {
			brand,
			model,
			version,
			color,
			doorCount,
			seatCount,
			productionYear,
			generation,
			vin: vin ?? null,
		};

		return { details, errorCount, successCount };
	}

	// private async extractOfferBasicDetailss(page: Page): Promise<CarDetails> {
	// 	// Extract VIN
	// 	const vin = await this.extractVinn(page);

	// 	console.log('po extractVinn');

	// 	// Extract other basic details
	// 	// const elements = await page.$$('[data-testid="basic_information"] [data-testid]');
	// 	const basicInfoWrapperLocator = page.getByTestId('combined-details-and-equipment-section')
	// 	const brand = await basicInfoWrapperLocator.getByTestId('make').locator('p:has-text("Marka pojazdu") + p').textContent() ?? ''
	// 	const model = await basicInfoWrapperLocator.getByTestId('model').locator('p:has-text("Model pojazdu") + p').textContent() ?? ''
	// 	const version = await basicInfoWrapperLocator.getByTestId('version').locator('p:has-text("Wersja") + p').textContent() ?? ''
	// 	const color = await basicInfoWrapperLocator.getByTestId('color').locator('p:has-text("Kolor") + p').textContent() ?? ''
	// 	const doorCount = await basicInfoWrapperLocator.getByTestId('door_count').locator('p:has-text("Liczba drzwi") + p').textContent() ?? ''
	// 	const seatCount = await basicInfoWrapperLocator.getByTestId('nr_seats').locator('p:has-text("Liczba miejsc") + p').textContent() ?? ''
	// 	const productionYear = await basicInfoWrapperLocator.getByTestId('year').locator('p:has-text("Rok produkcji") + p').textContent() ?? ''
	// 	try {
	// 		const generation = await basicInfoWrapperLocator.getByTestId('generation').locator('p:has-text("Generacja") + p').textContent() ?? ''
	// 	} catch (error) {

	// 	}

	// 	const details: CarDetails = {
	// 		brand,
	// 		model,
	// 		version,
	// 		color,
	// 		doorCount,
	// 		seatCount,
	// 		productionYear,
	// 		generation,
	// 		vin: vin ?? null
	// 	};
	// 	return details;
	// }

	// private async extractOfferBasicDetails(page: Page): Promise<CarDetails> {
	// 	const details: CarDetails = {
	// 		brand: "",
	// 		model: "",
	// 		version: "",
	// 		color: "",
	// 		doorCount: "",
	// 		seatCount: "",
	// 		productionYear: "",
	// 		generation: "",
	// 		vin: null
	// 	};

	// 	// Extract VIN
	// 	await this.extractVin(page, details);

	// 	// Extract other basic details
	// 	const elements = await page.$$('[data-testid="basic_information"] [data-testid]');

	// 	for (const element of elements) {
	// 		const labelHandle = await element.$('p:first-of-type');
	// 		if (!labelHandle) continue;

	// 		const valueHandle = await element.$('p:last-of-type');
	// 		if (!valueHandle) continue;

	// 		const label = (await labelHandle.textContent())?.trim().toLowerCase() || '';
	// 		const value = (await valueHandle.textContent())?.trim() || '';

	// 		this.mapBasicDetailField(label, value, details);
	// 	}

	// 	return details;
	// }

	// private async extractVin(page: Page, details: CarDetails): Promise<void> {
	// 	try {
	// 		const advertVin = page.getByTestId('advert-vin');
	// 		const vinButton = advertVin.locator('button');
	// 		if (await vinButton.count() === 0) {
	// 			console.error('Nie znaleziono przycisku VIN');
	// 			return;
	// 		}
	// 		await vinButton.click();

	// 		const vinParagraph = advertVin.locator('p');
	// 		await vinParagraph.waitFor({ timeout: 5000 });

	// 		if (await vinParagraph.count() === 0) {
	// 			console.error('Nie znaleziono elementu VIN');
	// 			return;
	// 		}
	// 		details.vin = await vinParagraph.textContent() || null;
	// 	} catch (error) {
	// 		console.error('Błąd podczas pobierania VIN:', error);
	// 	}
	// }


	private mapBasicDetailField(label: string, value: string, details: CarDetails): void {
		switch (label) {
			case "marka pojazdu":
				details.brand = value;
				break;
			case "model pojazdu":
				details.model = value;
				break;
			case "wersja":
				details.version = value;
				break;
			case "kolor":
				details.color = value;
				break;
			case "liczba drzwi":
				details.doorCount = value;
				break;
			case "liczba miejsc":
				details.seatCount = value;
				break;
			case "rok produkcji":
				details.productionYear = value;
				break;
			case "generacja":
				details.generation = value;
				break;
		}
	}

	private async extractOfferLinks(page: Page): Promise<string[]> {
		// '[data-testid="search-results"] div article h2 a',

		return await page.$$eval(
			'[data-testid="search-results"] > div > article > section > div > div > h2 > a',
			anchors => anchors.map(anchor => anchor.getAttribute('href') || '')
		);
	}

	// private async extractOfferId(page: Page): Promise<string> {
	// 	try {
	// 		const idElement = await page.$('button.ooa-flcs6l p.ooa-a4miog');
	// 		if (!idElement) return '';

	// 		const idText = await idElement.textContent() || '';
	// 		// Wyciągnięcie samego numeru ID z tekstu "ID: 6131838085"
	// 		const match = idText.match(/ID:\s*(\d+)/);
	// 		return match ? match[1] : '';
	// 	} catch (error) {
	// 		console.warn(`Error extracting offer ID: ${error.message}`);
	// 		return '';
	// 	}
	// }

	private async extractOfferPrice(page: Page): Promise<{ price: number, errorCount: number, successCount: number }> {
		let errorCount = 0;
		let successCount = 0;
		let extractedPrice = 0;
		try {
			const summaryInfoArea = page.getByTestId('summary-info-area');
			const priceLocator = summaryInfoArea.locator('.offer-price__number');
			const priceText = await priceLocator.textContent();
			if (!priceText) {
				throw new Error("Price is empty")
			}
			const integerPart = priceText.split(',')[0].replace(/\D/g, '');
			const intPrice = parseInt(integerPart, 10);

			extractedPrice = intPrice ?? 0;

			if (extractedPrice) {
				successCount++;
			} else {
				console.error('Brak ceny');
				errorCount++;
			}
			return { price: extractedPrice, errorCount, successCount };
		} catch (error: any) {
			console.warn(`Error extracting offer price: ${error.message}`);
			errorCount++;
			return { price: 0, errorCount, successCount };
		}
	}


	// private async extractOfferPrice(page: Page): Promise<string> {
	// 	try {
	// 		const summaryInfoArea = page.getByTestId('summary-info-area')
	// 		const priceLocator = summaryInfoArea.locator('.offer-price__number');
	// 		const price = await priceLocator.textContent() ?? ''

	// 		return price;

	// 	} catch (error) {
	// 		console.warn(`Error extracting offer price: ${error.message}`);
	// 		return '';
	// 	}
	// }

	private async extractOfferDate(page: Page): Promise<{ date: string, errorCount: number, successCount: number }> {
		let errorCount = 0;
		let successCount = 0;
		let extractedDate = '';
		try {
			const dateElement = await page.$('.ooa-vtq6wn p.ooa-15e01y2');
			if (!dateElement) {
				console.error("Brak elementu daty");
				errorCount++;
				return { date: '', errorCount, successCount };
			}

			const dateText = await dateElement.textContent() || '';
			if (!dateText) {
				console.error("Pusty tekst daty");
				errorCount++;
			} else {
				extractedDate = dateText;
				successCount++;
			}

			return { date: extractedDate, errorCount, successCount };
		} catch (error: any) {
			console.warn(`Error extracting offer date: ${error.message}`);
			errorCount++;
			return { date: '', errorCount, successCount };
		}
	}


	// private async extractOfferDate(page: Page): Promise<string> {
	// 	try {
	// 		const dateElement = await page.$('.ooa-vtq6wn p.ooa-15e01y2');
	// 		if (!dateElement) return '';

	// 		const dateText = await dateElement.textContent() || '';
	// 		// Możesz użyć istniejącej funkcji extractFormattedDate do przetworzenia daty
	// 		// lub zmodyfikować ją, aby obsługiwała ten format
	// 		return dateText;
	// 	} catch (error) {
	// 		console.warn(`Error extracting offer date: ${error.message}`);
	// 		return '';
	// 	}
	// }

	private async blockUnnecessaryResources(page: Page) {
		await page.route('**/*', (route) => {
			const request = route.request();
			const resourceType = request.resourceType();
			const url = request.url();

			// Zablokuj obrazy, style CSS, czcionki, media oraz określone domeny
			if (
				['image', 'stylesheet', 'font', 'media'].includes(resourceType) ||
				url.includes('google-analytics.com') ||
				url.includes('doubleclick.net')
			) {
				route.abort();
			} else {
				route.continue();
			}
		});
	}

	private async extractFormattedDate(page: Page): Promise<{ date: string, id: string, errorCount: number, successCount: number }> {
		let errorCount = 0;
		let successCount = 0;
		let formattedDate = '';
		let extractedId = '';
		try {
			// Pobierz elementy – oczekujemy 2 elementów: pierwszy z datą, drugi z ID
			const elements = page.locator('[data-testid="content-description-section"] > div:last-child > div');
			const count = await elements.count();
			if (count !== 2) {
				throw new Error(`Oczekiwano 2 elementów, a znaleziono ${count}`);
			}

			// Pierwszy element – tag <p> z datą
			const dateText = await elements.nth(0).textContent();
			if (!dateText) {
				console.error('Brak daty');
				errorCount++;
			}

			// Drugi element – button zawierający <p> oraz <svg>; z <p> wyciągamy ID
			const idTextRaw = await elements.nth(1).locator('p').textContent();
			extractedId = idTextRaw?.replace('ID:', '').trim() || '';
			if (!extractedId) {
				console.error('Brak ID');
				errorCount++;
			}

			// Parsowanie daty z tekstu, np. "30 stycznia 2025 9:35"
			const match = dateText?.match(/(\d{1,2})\s(\w+)\s(\d{4})\s(\d{1,2}:\d{2})/);
			if (match) {
				const day = match[1];
				const paddedDay = day.padStart(2, '0'); // Dodaj zero przed dniem, jeśli jest jednocyfrowy
				const month = MONTHS_MAP[match[2]];
				const year = match[3];
				const time = match[4];
				if (month) {
					formattedDate = `${year}-${month}-${paddedDay} ${time}`;
					successCount++;
				} else {
					console.error('Błędny miesiąc');
					errorCount++;
				}
			} else {
				console.error('Brak daty w formacie');
				errorCount++;
			}
		} catch {
			console.error('Błąd daty');
			errorCount++;
		}
		return { date: formattedDate, id: extractedId, errorCount, successCount };
	}

	public async getCarsWithMissingDates(): Promise<{ urls: string[] }> {
		const cars = await this.offerService.findCarsWithMissingDates();
		return {
			urls: cars.map(car => car.url)
		};
	}

	public async updateMissingDates(): Promise<{ updated: number }> {
		console.time('updateMissingDates');
		const cars = await this.offerService.findCarsWithMissingDates();
		const limitedCars = cars.slice(0, 100); // Limit to first 100 cars
		let updatedCount = 0;
		let offersCount = 0;
		for (const car of limitedCars) {
			offersCount++;
			console.log(`Updating data for car ${offersCount} of ${limitedCars.length}`);
			try {
				const { browser, page } = await createBrowserPage();
				try {
					console.time('updateMissingData');
					await page.goto(car.url, { waitUntil: 'networkidle', timeout: this.NAVIGATION_TIMEOUT });
					await handleCookieBanner(page);

					const { date: formattedDate, id: offerId } = await this.extractFormattedDate(page);
					
					if (formattedDate && !car.publishedDate) {
						await this.offerService.updateCarDate(car.id, formattedDate);
						updatedCount++;
					}

					if (offerId && !car.externalId) {
						car.externalId = offerId;
						car.shortenedUrl = car.url.split('/').pop() || '';
						await this.offerService.save(car);
						updatedCount++;
					}

					console.timeEnd('updateMissingData');
				} finally {
					await browser.close();
					console.log(`Updated data for car ${offersCount} of ${limitedCars.length}`);
				}
			} catch (error) {
				this.logger.error(`Error updating data for car ${car.id}:`, error);
			}
		}
		console.timeEnd('updateMissingDates');
		return { updated: updatedCount };
	}

	public async checkCarOffer(url: string): Promise<{ price: number, exists: boolean } | null> {
		const { browser, page } = await createBrowserPage();
		this.logger.log(`Checking car offer: ${url}`);

		try {
			try {
				await page.goto(url, { waitUntil: 'networkidle', timeout: this.NAVIGATION_TIMEOUT });
			} catch (error) {
				this.logger.error(`Timeout or navigation error for offer URL: ${url}`, error);
				return null; // Strona nie istnieje lub jest niedostępna
			}

			await handleCookieBanner(page);

			// Sprawdź czy strona zawiera komunikat o nieistnieniu oferty
			const notFoundElement = await page.$('text="Przykro nam, nie możemy znaleźć tej strony."');
			if (notFoundElement) {
				this.logger.log(`Offer no longer exists: ${url}`);
				return { price: 0, exists: false };
			}

			// Pobierz cenę
			const { price } = await this.extractOfferPrice(page);
			if (!price) {
				this.logger.error(`Could not extract price for offer: ${url}`);
				return null;
			}

			return { price, exists: true };
		} catch (error) {
			this.logger.error(`Error checking car offer ${url}:`, error);
			return null;
		} finally {
			await browser.close();
		}
	}

}
