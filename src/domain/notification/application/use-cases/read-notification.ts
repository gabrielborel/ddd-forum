import { Either, left, right } from '@/core/either';
import { NotificationsRepository } from '../repositories/notifications-repository';
import { Notification } from '../../enterprise/entities/notification';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

type ReadNotificationUseCaseInput = {
  recipientId: string;
  notificationId: string;
};

type ReadNotificationUseCaseOutput = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    notification: Notification;
  }
>;

export class ReadNotificationUseCase {
  constructor(private readonly notificationsRepository: NotificationsRepository) {}

  async execute(input: ReadNotificationUseCaseInput): Promise<ReadNotificationUseCaseOutput> {
    const notification = await this.notificationsRepository.findById(input.notificationId);

    if (!notification) {
      return left(new ResourceNotFoundError());
    }

    if (input.recipientId !== notification.recipientId.toString()) {
      return left(new NotAllowedError());
    }

    notification.read();

    await this.notificationsRepository.save(notification);

    return right({ notification });
  }
}
