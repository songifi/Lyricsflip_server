import { PartialType } from '@nestjs/mapped-types';
import { CreateSettingsDto } from './create-settings.dto';

export class UpdateSettingsDto extends PartialType(CreateSettingsDto) {}

// src/settings/settings.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Settings } from './entities/settings.entity';
import { CreateSettingsDto } from './dto/create-settings.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsRepository {
  constructor(
    @InjectRepository(Settings)
    private readonly settingsRepository: Repository<Settings>,
  ) {}

  async findByUserId(userId: string): Promise<Settings> {
    return this.settingsRepository.findOne({ where: { userId } });
  }

  async create(userId: string, createSettingsDto: CreateSettingsDto): Promise<Settings> {
    const settings = this.settingsRepository.create({
      userId,
      ...createSettingsDto,
    });
    return this.settingsRepository.save(settings);
  }

  async update(userId: string, updateSettingsDto: UpdateSettingsDto): Promise<Settings> {
    const settings = await this.findByUserId(userId);
    
    // Update settings if they exist
    if (settings) {
      const updatedSettings = { 
        ...settings,
        ...updateSettingsDto,
        updatedAt: new Date()
      };
      return this.settingsRepository.save(updatedSettings);
    }
    
    // Create new settings if they don't exist
    return this.create(userId, updateSettingsDto);
  }

  async delete(userId: string): Promise<void> {
    await this.settingsRepository.delete({ userId });
  }
}