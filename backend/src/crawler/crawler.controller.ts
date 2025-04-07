import { Controller, Post, Logger, Body, BadRequestException, InternalServerErrorException, NotFoundException, HttpException, Get } from '@nestjs/common';
import { CrawlerService } from './crawler.service';

@Controller('crawler')
export class CrawlerController {
  private readonly logger = new Logger(CrawlerController.name);

  constructor(private readonly crawlerService: CrawlerService) { }

  @Post('run')
  public async runCrawler() {
    this.logger.log('Manually triggered crawler job');
    await this.crawlerService.handleCron();
    return { message: 'Crawler job started successfully' };
  }

  @Post('offer')
  async scrapeOfferByUrl(@Body() body: { url: string }) {
    this.logger.log(`Manually scraping single offer: ${body.url}`);

    if (!body.url) {
      throw new BadRequestException('URL is required');
    }

    try {
      const offerDetails = await this.crawlerService.scrapeOfferDetails(body.url);
      return offerDetails;
    } catch (error) {
      this.logger.error(`Error scraping offer from URL: ${body.url}`, error);
      throw new BadRequestException('Failed to scrape offer details.');
    }
  }

  /**
   * Crawls provided tracked URLs and returns offers from the first successfully processed URL.
   * 
   * @param body Object containing tracked URLs to crawl
   * @returns An object containing the list of car offers and the ID of the tracked URL
   */
  @Post('crawl-urls')
  async crawlTrackedUrls(@Body() body: { trackedUrls: string[] }) {
    this.logger.log('Manually triggered crawling of provided tracked URLs');

    try {
      if (!body.trackedUrls || body.trackedUrls.length === 0) {
        throw new BadRequestException('No tracked URLs provided in the request body');
      }

      this.logger.log(`Processing ${body.trackedUrls.length} tracked URLs from request`);

      const result = await this.crawlerService.crawlAllTrackedUrls(body.trackedUrls, { autoSave: false });

      this.logger.log(`Successfully crawled URL ID: ${result}, found ${result.offers.length} offers`);

      return {
        success: true,
        offersCount: result.offers.length,
        offers: result.offers
      };
    } catch (error) {
      this.logger.error(`Failed to crawl tracked URLs: ${error.message}`);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to crawl tracked URLs',
        error: error.message
      });
    }
  }

  @Get('missing-dates')
  async getCarsWithMissingDates(): Promise<{ urls: string[] }> {
    return await this.crawlerService.getCarsWithMissingDates();
  }

  @Post('update-dates')
  async updateMissingDates(): Promise<{ updated: number }> {
    return await this.crawlerService.updateMissingDates();
  }
}
