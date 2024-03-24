import { Either, right } from '@/core/either';
import { Notification } from '../../enterprise/entities/notification';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotificationsRepository } from '../repositories/notifications-repository';

type SendNotificationUseCaseInput = {
  recipientId: string;
  title: string;
  content: string;
};

type SendNotificationUseCaseOutput = Either<
  null,
  {
    notification: Notification;
  }
>;

export class SendNotificationUseCase {
  constructor(private readonly notificationsRepoistory: NotificationsRepository) {}

  async execute(input: SendNotificationUseCaseInput): Promise<SendNotificationUseCaseOutput> {
    const notification = Notification.create({
      recipientId: new UniqueEntityID(input.recipientId),
      title: input.title,
      content: input.content,
    });

    await this.notificationsRepoistory.create(notification);

    return right({ notification });
  }
}
