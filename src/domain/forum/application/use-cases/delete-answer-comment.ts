import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';

type DeleteAnswerCommentUseCaseInput = {
  answerCommentId: string;
  authorId: string;
};

type DeleteAnswerCommentUseCaseOutput = void;

export class DeleteAnswerCommentUseCase {
  constructor(private readonly answerCommentsRepository: AnswerCommentsRepository) {}

  async execute(input: DeleteAnswerCommentUseCaseInput): Promise<DeleteAnswerCommentUseCaseOutput> {
    const { answerCommentId, authorId } = input;
    const answerComment = await this.answerCommentsRepository.findById(answerCommentId);

    if (!answerComment) {
      throw new Error('Answer comment not found');
    }

    if (answerComment.authorId.toString() !== authorId) {
      throw new Error('Only the author can delete a answer comment');
    }

    await this.answerCommentsRepository.delete(answerComment);
  }
}
