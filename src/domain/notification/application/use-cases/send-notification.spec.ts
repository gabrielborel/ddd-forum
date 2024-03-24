import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository';
import { SendNotificationUseCase } from './send-notification';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let sut: SendNotificationUseCase;
let notificationsRepository: InMemoryNotificationsRepository;

describe('Send Notification Use Case', () => {
  beforeEach(() => {
    notificationsRepository = new InMemoryNotificationsRepository();
    sut = new SendNotificationUseCase(notificationsRepository);
  });

  test('should send a notification', async () => {
    const result = await sut.execute({
      recipientId: 'recipient-1',
      content: 'some-content',
      title: 'some-title',
    });

    expect(result.isLeft()).toBeFalsy();
    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value.notification.id).toBeDefined();
      expect(result.value.notification.content).toEqual('some-content');
      expect(result.value.notification.title).toEqual('some-title');
      expect(result.value.notification.recipientId).toEqual(new UniqueEntityID('recipient-1'));
      expect(result.value.notification.createdAt).toBeInstanceOf(Date);
      expect(result.value.notification.readAt).toBeUndefined();
    }
  });
});
