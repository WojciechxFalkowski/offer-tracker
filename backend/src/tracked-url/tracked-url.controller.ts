import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    NotFoundException,
    Put,
} from '@nestjs/common';
import { TrackedUrlService } from './tracked-url.service';
import { CreateTrackedUrlDto, UpdateTrackedUrlDto } from './tracked-url.dto';

@Controller('tracked-urls')
export class TrackedUrlController {
    constructor(private readonly trackedUrlService: TrackedUrlService) { }

    @Post()
    async create(@Body() createTrackedUrlDto: CreateTrackedUrlDto) {
        return this.trackedUrlService.create(createTrackedUrlDto);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateTrackedUrlDto: UpdateTrackedUrlDto) {
        return this.trackedUrlService.update(+id, updateTrackedUrlDto);
    }

    @Get()
    async findAll() {
        return this.trackedUrlService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const trackedUrl = await this.trackedUrlService.findOne(+id);
        if (!trackedUrl) {
            throw new NotFoundException('Tracked URL not found');
        }
        return trackedUrl;
    }

    @Get('with-offer-count')
    async findAllWithOfferCount() {
        return this.trackedUrlService.findAllWithOfferCount();
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.trackedUrlService.remove(+id);
    }
}
