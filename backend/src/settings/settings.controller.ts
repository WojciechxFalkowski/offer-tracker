// settings.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsKey } from './settings-keys.enum';

@Controller('settings')
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) { }

    private validateKey(key: string): void {
        if (!(key in SettingsKey)) {
            throw new HttpException(`Invalid settings key: ${key}`, HttpStatus.BAD_REQUEST);
        }
    }

    @Get(':key')
    async getSetting(@Param('key') key: string) {
        this.validateKey(key);
        return this.settingsService.getSetting(SettingsKey[key]);
    }

    @Post(':key')
    async createSetting(@Param('key') key: string, @Body() value: { frequencyInMinutes: number }) {
        this.validateKey(key);
        await this.settingsService.setSetting(SettingsKey[key], value);
        return { message: 'Setting created successfully' };
    }

    @Put(':key')
    async updateSetting(@Param('key') key: string, @Body() value: { frequencyInMinutes: number }) {
        this.validateKey(key);
        await this.settingsService.setSetting(SettingsKey[key], value);
        return { message: 'Setting updated successfully' };
    }

    @Delete(':key')
    async deleteSetting(@Param('key') key: string) {
        this.validateKey(key);
        await this.settingsService.deleteSetting(SettingsKey[key]);
        return { message: 'Setting deleted successfully' };
    }
}
