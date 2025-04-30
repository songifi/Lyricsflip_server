import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from './notifications.service';
import { NotificationType } from './enums/notificationType.enum';
import {
  GameInviteEvent,
  GameWonEvent,
  MilestoneEvent,
} from './events/notification.events';

@Injectable()
export class NotificationsListener {
  constructor(private readonly notificationsService: NotificationsService) {}

  @OnEvent('game.invite')
  handleGameInviteEvent(event: GameInviteEvent) {
    this.notificationsService.createNotification(
      event.invitedUserId,
      NotificationType.GAME_INVITE,
      `${event.inviterUsername} has invited you to a game!`,
    );
  }

  @OnEvent('game.won')
  handleGameWonEvent(event: GameWonEvent) {
    // Notify winner
    this.notificationsService.createNotification(
      event.winnerId,
      NotificationType.GAME_WON,
      `Congratulations! You won the game!`,
    );

    // Optionally notify loser
    this.notificationsService.createNotification(
      event.loserId,
      NotificationType.GAME_WON,
      `Game over. Better luck next time!`,
    );
  }

  @OnEvent('user.milestone')
  handleMilestoneEvent(event: MilestoneEvent) {
    this.notificationsService.createNotification(
      event.userId,
      NotificationType.MILESTONE,
      `You've achieved a new milestone: ${event.milestoneType} - ${event.milestoneValue}!`,
    );
  }
}
