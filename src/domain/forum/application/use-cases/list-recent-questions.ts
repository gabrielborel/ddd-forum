import { Either, right } from '@/core/either';
import { Question } from '../../enterprise/entities/question';
import { QuestionsRepository } from '../repositories/questions-repository';

type ListRecentQuestionsUseCaseInput = {
  page: number;
};

type ListRecentQuestionsUseCaseOutput = Either<
  null,
  {
    questions: Question[];
  }
>;

export class ListRecentQuestionsUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute(input: ListRecentQuestionsUseCaseInput): Promise<ListRecentQuestionsUseCaseOutput> {
    const { page } = input;
    const questions = await this.questionsRepository.findManyRecent({ page });
    return right({ questions });
  }
}
