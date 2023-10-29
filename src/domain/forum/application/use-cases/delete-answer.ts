import { Either, left, right } from '@/core/either';
import { AnswersRepository } from '../repositories/answers-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { NotAllowedError } from './errors/not-allowed-error';

type DeleteAnswerUseCaseInput = {
  authorId: string;
  answerId: string;
};

type DeleteAnswerUseCaseOutput = Either<ResourceNotFoundError | NotAllowedError, void>;

export class DeleteAnswerUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute(input: DeleteAnswerUseCaseInput): Promise<DeleteAnswerUseCaseOutput> {
    const answer = await this.answersRepository.findById(input.answerId);
    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    if (answer.authorId.toString() !== input.authorId) {
      return left(new NotAllowedError());
    }

    await this.answersRepository.delete(answer);
    return right(void 0);
  }
}
