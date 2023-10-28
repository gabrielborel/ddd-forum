import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';

type AnswerQuestionUseCaseInput = {
  questionId: string;
  instructorId: string;
  content: string;
};

type AnswerQuestionUseCaseOutput = {
  answer: Answer;
};

export class AnswerQuestionUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute(
    input: AnswerQuestionUseCaseInput
  ): Promise<AnswerQuestionUseCaseOutput> {
    const { content, instructorId, questionId } = input;

    const answer = Answer.create({
      content,
      authorId: new UniqueEntityID(instructorId),
      questionId: new UniqueEntityID(questionId),
    });

    await this.answersRepository.create(answer);

    return { answer };
  }
}
