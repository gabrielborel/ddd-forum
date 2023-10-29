import { Either, left, right } from '@/core/either';
import { Question } from '../../enterprise/entities/question';
import { QuestionsRepository } from '../repositories/questions-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

type GetQuestionBySlugUseCaseInput = {
  slug: string;
};

type GetQuestionBySlugUseCaseOutput = Either<
  ResourceNotFoundError,
  {
    question: Question;
  }
>;

export class GetQuestionBySlugUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute(input: GetQuestionBySlugUseCaseInput): Promise<GetQuestionBySlugUseCaseOutput> {
    const question = await this.questionsRepository.findBySlug(input.slug);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    return right({ question });
  }
}
