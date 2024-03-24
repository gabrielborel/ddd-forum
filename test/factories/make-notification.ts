import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Notification,
  NotificationProps,
} from '@/domain/notification/enterprise/entities/notification';
import { faker } from '@faker-js/faker';

export function makeNotification(
  override: Partial<NotificationProps> = {},
  id?: UniqueEntityID
): Notification {
  const notification = Notification.create(
    {
      recipientId: new UniqueEntityID(),
      title: faker.lorem.sentence({ max: 2, min: 2 }),
      content: faker.lorem.text(),
      ...override,
    },
    id
  );
  return notification;
}
