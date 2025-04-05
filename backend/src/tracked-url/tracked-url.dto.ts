import { IsString, IsOptional } from 'class-validator';

export class CreateTrackedUrlDto {
    @IsString()
    url: string;

    @IsOptional()
    @IsString()
    description?: string;
}

export class UpdateTrackedUrlDto {
    @IsOptional()
    @IsString()
    url?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    brand?: string;

    @IsOptional()
    @IsString()
    model?: string;
}
