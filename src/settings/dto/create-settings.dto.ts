import { IsEnum, IsArray, IsString, IsOptional, IsBoolean, IsInt, Min, Max } from 'class-validator';
import { NotificationType } from '../entities/settings.entity';

export class CreateSettingsDto {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  preferredCategories?: string[];

  @IsEnum(NotificationType)
  @IsOptional()
  notificationPreferences?: NotificationType;

  @IsBoolean()
  @IsOptional()
  soundEnabled?: boolean;

  @IsString()
  @IsOptional()
  language?: string;

  @IsInt()
  @IsOptional()
  @Min(5)
  @Max(50)
  itemsPerPage?: number;

  @IsBoolean()
  @IsOptional()
  autoPlayEnabled?: boolean;
}