import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationType } from './enums/notificationType.enum';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
  ) {}

  async createNotification(
    userId: string,
    type: NotificationType,
    message: string,
  ): Promise<Notification> {
    const notification = this.notificationsRepository.create({
      userId,
      type,
      message,
      read: false,
    });

    return this.notificationsRepository.save(notification);
  }

  async findAllForUser(userId: string): Promise<Notification[]> {
    return this.notificationsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(id: string): Promise<Notification> {
    await this.notificationsRepository.update(id, { read: true });

    const notification = await this.notificationsRepository.findOne({
      where: { id },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    return notification;
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationsRepository.update(
      { userId, read: false },
      { read: true },
    );
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationsRepository.count({
      where: { userId, read: false },
    });
  }
}
