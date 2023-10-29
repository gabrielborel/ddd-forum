import { Either, left, right } from '@/core/either';
import { Answer } from '../../enterprise/entities/answer';
import { AnswersRepository } from '../repositories/answers-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { NotAllowedError } from './errors/not-allowed-error';

type EditAnswerUseCaseInput = {
  authorId: string;
  answerId: string;
  content: string;
};

type EditAnswerUseCaseOutput = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer;
  }
>;

export class EditAnswerUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute(input: EditAnswerUseCaseInput): Promise<EditAnswerUseCaseOutput> {
    const answer = await this.answersRepository.findById(input.answerId);
    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    if (answer.authorId.toString() !== input.authorId) {
      return left(new NotAllowedError());
    }

    answer.content = input.content;
    await this.answersRepository.save(answer);

    return right({ answer });
  }
}
