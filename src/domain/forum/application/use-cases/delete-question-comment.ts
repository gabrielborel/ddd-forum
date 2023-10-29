import { QuestionCommentsRepository } from '../repositories/question-comments-repository';

type DeleteQuestionCommentUseCaseInput = {
  questionCommentId: string;
  authorId: string;
};

type DeleteQuestionCommentUseCaseOutput = void;

export class DeleteQuestionCommentUseCase {
  constructor(private readonly questionCommentsRepository: QuestionCommentsRepository) {}

  async execute(input: DeleteQuestionCommentUseCaseInput): Promise<DeleteQuestionCommentUseCaseOutput> {
    const { questionCommentId, authorId } = input;
    const questionComment = await this.questionCommentsRepository.findById(questionCommentId);

    if (!questionComment) {
      throw new Error('Question comment not found');
    }

    if (questionComment.authorId.toString() !== authorId) {
      throw new Error('Only the author can delete a question comment');
    }

    await this.questionCommentsRepository.delete(questionComment);
  }
}
