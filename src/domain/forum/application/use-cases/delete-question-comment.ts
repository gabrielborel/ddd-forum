import { Either, left, right } from '@/core/either';
import { QuestionCommentsRepository } from '../repositories/question-comments-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { NotAllowedError } from './errors/not-allowed-error';

type DeleteQuestionCommentUseCaseInput = {
  questionCommentId: string;
  authorId: string;
};

type DeleteQuestionCommentUseCaseOutput = Either<ResourceNotFoundError | NotAllowedError, void>;

export class DeleteQuestionCommentUseCase {
  constructor(private readonly questionCommentsRepository: QuestionCommentsRepository) {}

  async execute(input: DeleteQuestionCommentUseCaseInput): Promise<DeleteQuestionCommentUseCaseOutput> {
    const { questionCommentId, authorId } = input;
    const questionComment = await this.questionCommentsRepository.findById(questionCommentId);

    if (!questionComment) {
      return left(new ResourceNotFoundError());
    }

    if (questionComment.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    await this.questionCommentsRepository.delete(questionComment);
    return right(void 0);
  }
}
