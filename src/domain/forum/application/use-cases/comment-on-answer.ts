import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { AnswerComment } from '../../enterprise/entities/answer-comment';
import { AnswersRepository } from '../repositories/answers-repository';
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

type CommentOnAnswerUseCaseInput = {
  authorId: string;
  answerId: string;
  content: string;
};

type CommentOnAnswerUseCaseOutput = Either<
  ResourceNotFoundError,
  {
    answerComment: AnswerComment;
  }
>;

export class CommentOnAnswerUseCase {
  constructor(
    private readonly answersRepository: AnswersRepository,
    private readonly answerCommentsRepository: AnswerCommentsRepository
  ) {}

  async execute(input: CommentOnAnswerUseCaseInput): Promise<CommentOnAnswerUseCaseOutput> {
    const { authorId, answerId, content } = input;

    const answer = await this.answersRepository.findById(answerId);
    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    const answerComment = AnswerComment.create({
      authorId: new UniqueEntityID(authorId),
      answerId: new UniqueEntityID(answerId),
      content,
    });

    await this.answerCommentsRepository.create(answerComment);

    return right({
      answerComment,
    });
  }
}
