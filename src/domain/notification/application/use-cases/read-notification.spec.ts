import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository';
import { ReadNotificationUseCase } from './read-notification';
import { makeNotification } from 'test/factories/make-notification';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

let sut: ReadNotificationUseCase;
let notificationsRepository: InMemoryNotificationsRepository;

describe('Read Notification Use Case', () => {
  beforeEach(() => {
    notificationsRepository = new InMemoryNotificationsRepository();
    sut = new ReadNotificationUseCase(notificationsRepository);
  });

  test('should read a notification', async () => {
    const notification = makeNotification();

    await notificationsRepository.create(notification);

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    });

    expect(result.isLeft()).toBeFalsy();
    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value.notification.recipientId).toEqual(notification.recipientId);
      expect(result.value.notification.id).toEqual(notification.id);
      expect(result.value.notification.readAt).toBeDefined();
      expect(result.value.notification.readAt).toEqual(expect.any(Date));
    }
  });

  test('should not be able to read a notification from another user', async () => {
    const notification = makeNotification();

    await notificationsRepository.create(notification);

    const result = await sut.execute({
      recipientId: 'another-recipient-id',
      notificationId: notification.id.toString(),
    });

    expect(result.isLeft()).toBeTruthy();
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(NotAllowedError);
    }
  });

  test('should not be able to read a notification that does not exists', async () => {
    const notification = makeNotification();

    await notificationsRepository.create(notification);

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: 'another-notification-id',
    });

    expect(result.isLeft()).toBeTruthy();
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });
});
