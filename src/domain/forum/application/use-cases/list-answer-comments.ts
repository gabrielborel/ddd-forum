import { AnswerComment } from '../../enterprise/entities/answer-comment';
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';

type ListAnswerCommentUseCaseInput = {
  answerId: string;
  page: number;
};

type ListAnswerCommentUseCaseOutput = {
  answerComments: AnswerComment[];
};

export class ListAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute(input: ListAnswerCommentUseCaseInput): Promise<ListAnswerCommentUseCaseOutput> {
    const { answerId, page } = input;
    const answerComments = await this.answerCommentsRepository.findManyByAnswerId(answerId, { page });
    return { answerComments };
  }
}
