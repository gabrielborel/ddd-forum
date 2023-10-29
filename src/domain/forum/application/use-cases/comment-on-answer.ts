import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { AnswerComment } from '../../enterprise/entities/answer-comment';
import { AnswersRepository } from '../repositories/answers-repository';
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';

type CommentOnAnswerUseCaseInput = {
  authorId: string;
  answerId: string;
  content: string;
};

type CommentOnAnswerUseCaseOutput = {
  answerComment: AnswerComment;
};

export class CommentOnAnswerUseCase {
  constructor(
    private readonly answersRepository: AnswersRepository,
    private readonly answerCommentsRepository: AnswerCommentsRepository
  ) {}

  async execute(input: CommentOnAnswerUseCaseInput): Promise<CommentOnAnswerUseCaseOutput> {
    const { authorId, answerId, content } = input;

    const answer = await this.answersRepository.findById(answerId);
    if (!answer) {
      throw new Error('Answer not found');
    }

    const answerComment = AnswerComment.create({
      authorId: new UniqueEntityID(authorId),
      answerId: new UniqueEntityID(answerId),
      content,
    });

    await this.answerCommentsRepository.create(answerComment);

    return {
      answerComment,
    };
  }
}