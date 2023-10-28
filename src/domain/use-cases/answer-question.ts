import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Answer } from '@/domain/entities/answer';
import { AnswersRepository } from '@/domain/repositories/answers-repository';

type AnswerQuestionUseCaseInput = {
  questionId: string;
  instructorId: string;
  content: string;
};

type AnswerQuestionUseCaseOutput = Promise<Answer>;

export class AnswerQuestionUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute(
    input: AnswerQuestionUseCaseInput
  ): AnswerQuestionUseCaseOutput {
    const { content, instructorId, questionId } = input;

    const answer = Answer.create({
      content,
      authorId: new UniqueEntityID(instructorId),
      questionId: new UniqueEntityID(questionId),
    });

    await this.answersRepository.create(answer);

    return answer;
  }
}
