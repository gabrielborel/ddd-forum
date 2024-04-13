import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handler';
import { SendNotificationUseCase } from '../use-cases/send-notification';
import { QuestionBestAnswerChosenEvent } from '@/domain/forum/enterprise/events/question-best-answer-chosen';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';

export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private readonly answersRepository: AnswersRepository,
    private readonly sendNotificationUseCase: SendNotificationUseCase
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionBestAnswerChosenNotification.bind(this),
      QuestionBestAnswerChosenEvent.name
    );
  }

  private async sendQuestionBestAnswerChosenNotification(
    event: QuestionBestAnswerChosenEvent
  ): Promise<void> {
    const answer = await this.answersRepository.findById(event.bestAnswerId.toString());
    if (!answer) {
      return;
    }

    await this.sendNotificationUseCase.execute({
      recipientId: answer.authorId.toString(),
      title: 'Sua resposta foi escolhida como a melhor resposta',
      content: `Sua resposta foi escolhida como a melhor resposta na pergunta "${event.question.title
        .substring(0, 20)
        .concat('...')}"`,
    });
  }
}
