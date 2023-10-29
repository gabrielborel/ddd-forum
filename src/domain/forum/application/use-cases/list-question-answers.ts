import { Answer } from '../../enterprise/entities/answer';
import { AnswersRepository } from '../repositories/answers-repository';

type ListQuestionAnswersUseCaseInput = {
  questionId: string;
  page: number;
};

type ListQuestionAnswersUseCaseOutput = {
  answers: Answer[];
};

export class ListQuestionAnswersUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute(
    input: ListQuestionAnswersUseCaseInput
  ): Promise<ListQuestionAnswersUseCaseOutput> {
    const answers = await this.answersRepository.findManyByQuestionId(
      input.questionId,
      { page: input.page }
    );
    return { answers };
  }
}
