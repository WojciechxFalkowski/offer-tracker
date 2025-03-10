import { Module } from '@nestjs/common';
import { TrackedUrlService } from './tracked-url.service';
import { TrackedUrlController } from './tracked-url.controller';
import { trackedUrlProviders } from './tracked-url.providers';
import { DatabaseModule } from 'src/database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [DatabaseModule, ConfigModule],
    controllers: [TrackedUrlController],
    providers: [...trackedUrlProviders, TrackedUrlService],
    exports: [TrackedUrlService],
})
export class TrackedUrlModule { }