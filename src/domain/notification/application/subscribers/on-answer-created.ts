import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handler';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { AnswerCreatedEvent } from '@/domain/forum/enterprise/events/answer-created';
import { SendNotificationUseCase } from '../use-cases/send-notification';

export class OnAnswerCreated implements EventHandler {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly sendNotificationUseCase: SendNotificationUseCase
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.sendNewAnswerNotification.bind(this), AnswerCreatedEvent.name);
  }

  private async sendNewAnswerNotification(event: AnswerCreatedEvent): Promise<void> {
    const question = await this.questionsRepository.findById(event.answer.questionId.toString());
    if (!question) {
      return;
    }

    await this.sendNotificationUseCase.execute({
      recipientId: question.authorId.toString(),
      title: `Nova resposta em "${question.title.substring(0, 30).concat('...')}"`,
      content: event.answer.excerpt,
    });
  }
}