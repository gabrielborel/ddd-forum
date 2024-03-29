import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository';
import { Notification } from '@/domain/notification/enterprise/entities/notification';

export class InMemoryNotificationsRepository implements NotificationsRepository {
  public items: Notification[] = [];

  async create(notification: Notification): Promise<void> {
    this.items.push(notification);
    return Promise.resolve();
  }

  async findById(notificationId: string): Promise<Notification | null> {
    const notification = this.items.find((i) => i.id.toString() === notificationId);

    if (!notification) {
      return null;
    }

    return Promise.resolve(notification);
  }

  async save(notification: Notification): Promise<void> {
    const itemIndex = this.items.findIndex((i) => i.id === notification.id);
    this.items[itemIndex] = notification;
  }
}
