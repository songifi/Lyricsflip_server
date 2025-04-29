import { Injectable } from '@nestjs/common';
import { SettingsService } from '../settings/settings.service';
import { NotificationType } from '../settings/entities/settings.entity';

interface GameSessionOptions {
  userId: string;
  categories?: string[];
  difficulty?: string;
}

@Injectable()
export class GameplayService {
  constructor(private readonly settingsService: SettingsService) {}

  async startGameSession(options: GameSessionOptions) {
    const userId = options.userId;
    const settings = await this.settingsService.getOrCreateSettings(userId);
    
    // Apply user preferences to gameplay
    const availableCategories = options.categories || ['sports', 'history', 'science', 'entertainment', 'art'];
    
    // Filter categories based on user preferences if they have any
    const filteredCategories = settings.preferredCategories?.length 
      ? availableCategories.filter(cat => settings.preferredCategories.includes(cat))
      : availableCategories;
    
    // Use user's language preference
    const language = settings.language || 'en';
    
    // Apply auto-play settings
    const autoPlay = settings.autoPlayEnabled;
    
    return {
      userId,
      categories: filteredCategories,
      language,
      autoPlay,
      soundEnabled: settings.soundEnabled,
      itemsPerPage: settings.itemsPerPage,
      sessionStarted: new Date(),
    };
  }

  async shouldSendNotification(userId: string, notificationType: 'email' | 'push'): Promise<boolean> {
    const settings = await this.settingsService.getOrCreateSettings(userId);
    
    switch (settings.notificationPreferences) {
      case NotificationType.NONE:
        return false;
      case NotificationType.EMAIL:
        return notificationType === 'email';
      case NotificationType.PUSH:
        return notificationType === 'push';
      case NotificationType.ALL:
      default:
        return true;
    }
  }
}