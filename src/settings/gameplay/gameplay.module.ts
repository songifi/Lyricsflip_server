import { Module } from '@nestjs/common';
import { GameplayController } from './gameplay.controller';
import { GameplayService } from './gameplay.service';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [SettingsModule],
  controllers: [GameplayController],
  providers: [GameplayService],
  exports: [GameplayService],
})
export class GameplayModule {}

// Example usage in notification service
// src/notifications/notification.service.ts
import { Injectable } from '@nestjs/common';
import { GameplayService } from '../gameplay/gameplay.service';

@Injectable()
export class NotificationService {
  constructor(private readonly gameplayService: GameplayService) {}

  async sendGameInvitation(userId: string, invitationData: any) {
    // Check if user wants to receive this type of notification
    const shouldSendEmail = await this.gameplayService.shouldSendNotification(userId, 'email');
    const shouldSendPush = await this.gameplayService.shouldSendNotification(userId, 'push');
    
    if (shouldSendEmail) {
      // Send email notification logic
      console.log(`Sending email notification to user ${userId}`);
      // emailService.send(...)
    }
    
    if (shouldSendPush) {
      // Send push notification logic
      console.log(`Sending push notification to user ${userId}`);
      // pushService.send(...)
    }
    
    return {
      notificationSent: shouldSendEmail || shouldSendPush,
      channels: {
        email: shouldSendEmail,
        push: shouldSendPush,
      }
    };
  }
}