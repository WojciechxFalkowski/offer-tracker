import { IsString, IsOptional } from 'class-validator';

export class CreateTrackedUrlDto {
    @IsString()
    url: string;

    @IsOptional()
    @IsString()
    description?: string;
}
