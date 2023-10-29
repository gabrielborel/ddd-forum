import { Either, left, right } from '@/core/either';
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { NotAllowedError } from './errors/not-allowed-error';

type DeleteAnswerCommentUseCaseInput = {
  answerCommentId: string;
  authorId: string;
};

type DeleteAnswerCommentUseCaseOutput = Either<ResourceNotFoundError | NotAllowedError, void>;

export class DeleteAnswerCommentUseCase {
  constructor(private readonly answerCommentsRepository: AnswerCommentsRepository) {}

  async execute(input: DeleteAnswerCommentUseCaseInput): Promise<DeleteAnswerCommentUseCaseOutput> {
    const { answerCommentId, authorId } = input;
    const answerComment = await this.answerCommentsRepository.findById(answerCommentId);

    if (!answerComment) {
      return left(new ResourceNotFoundError());
    }

    if (answerComment.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    await this.answerCommentsRepository.delete(answerComment);
    return right(void 0);
  }
}
