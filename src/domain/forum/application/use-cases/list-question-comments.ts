import { Either, right } from '@/core/either';
import { QuestionComment } from '../../enterprise/entities/question-comment';
import { QuestionCommentsRepository } from '../repositories/question-comments-repository';

type ListQuestionCommentUseCaseInput = {
  questionId: string;
  page: number;
};

type ListQuestionCommentUseCaseOutput = Either<
  null,
  {
    questionComments: QuestionComment[];
  }
>;

export class ListQuestionCommentsUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute(input: ListQuestionCommentUseCaseInput): Promise<ListQuestionCommentUseCaseOutput> {
    const { questionId, page } = input;
    const questionComments = await this.questionCommentsRepository.findManyByQuestionId(questionId, { page });
    return right({ questionComments });
  }
}
