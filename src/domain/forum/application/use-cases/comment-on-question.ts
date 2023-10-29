import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { QuestionComment } from '../../enterprise/entities/question-comment';
import { QuestionCommentsRepository } from '../repositories/question-comments-repository';
import { QuestionsRepository } from '../repositories/questions-repository';

type CommentOnQuestionUseCaseInput = {
  authorId: string;
  questionId: string;
  content: string;
};

type CommentOnQuestionUseCaseOutput = {
  questionComment: QuestionComment;
};

export class CommentOnQuestionUseCase {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly questionCommentsRepository: QuestionCommentsRepository
  ) {}

  async execute(input: CommentOnQuestionUseCaseInput): Promise<CommentOnQuestionUseCaseOutput> {
    const { authorId, questionId, content } = input;

    const question = await this.questionsRepository.findById(questionId);
    if (!question) {
      throw new Error('Question not found');
    }

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
      content,
    });

    await this.questionCommentsRepository.create(questionComment);

    return {
      questionComment,
    };
  }
}
