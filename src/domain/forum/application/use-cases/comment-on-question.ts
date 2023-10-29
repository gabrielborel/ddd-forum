import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { QuestionComment } from '../../enterprise/entities/question-comment';
import { QuestionCommentsRepository } from '../repositories/question-comments-repository';
import { QuestionsRepository } from '../repositories/questions-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

type CommentOnQuestionUseCaseInput = {
  authorId: string;
  questionId: string;
  content: string;
};

type CommentOnQuestionUseCaseOutput = Either<
  ResourceNotFoundError,
  {
    questionComment: QuestionComment;
  }
>;

export class CommentOnQuestionUseCase {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly questionCommentsRepository: QuestionCommentsRepository
  ) {}

  async execute(input: CommentOnQuestionUseCaseInput): Promise<CommentOnQuestionUseCaseOutput> {
    const { authorId, questionId, content } = input;

    const question = await this.questionsRepository.findById(questionId);
    if (!question) {
      return left(new ResourceNotFoundError());
    }

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
      content,
    });

    await this.questionCommentsRepository.create(questionComment);

    return right({
      questionComment,
    });
  }
}
