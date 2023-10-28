import { Question } from '../../enterprise/entities/question';
import { QuestionsRepository } from '../repositories/questions-repository';

type GetQuestionBySlugUseCaseInput = {
  slug: string;
};

type GetQuestionBySlugUseCaseOutput = {
  question: Question;
};

export class GetQuestionBySlugUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute(
    input: GetQuestionBySlugUseCaseInput
  ): Promise<GetQuestionBySlugUseCaseOutput> {
    const question = await this.questionsRepository.findBySlug(input.slug);

    if (!question) throw new Error('Question not found');

    return { question };
  }
}
