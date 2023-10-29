import { Either, left, right } from '@/core/either';
import { QuestionsRepository } from '../repositories/questions-repository';
import { NotAllowedError } from './errors/not-allowed-error';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

type DeleteQuestionUseCaseInput = {
  authorId: string;
  questionId: string;
};

type DeleteQuestionUseCaseOutput = Either<ResourceNotFoundError | NotAllowedError, void>;

export class DeleteQuestionUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute(input: DeleteQuestionUseCaseInput): Promise<DeleteQuestionUseCaseOutput> {
    const question = await this.questionsRepository.findById(input.questionId);
    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (question.authorId.toString() !== input.authorId) {
      return left(new NotAllowedError());
    }

    await this.questionsRepository.delete(question);
    return right(void 0);
  }
}
