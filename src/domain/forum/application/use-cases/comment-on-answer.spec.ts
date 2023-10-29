import { makeAnswer } from 'test/factories/make-answer';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';
import { CommentOnAnswerUseCase } from './comment-on-answer';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

let sut: CommentOnAnswerUseCase;
let answersRepository: InMemoryAnswersRepository;
let answerCommentsRepository: AnswerCommentsRepository;

describe('Comment On Answer Use Case', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository();
    answerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new CommentOnAnswerUseCase(answersRepository, answerCommentsRepository);
  });

  it('should comment on a answer', async () => {
    const createdAnswer = makeAnswer({});
    await answersRepository.create(createdAnswer);

    const result = await sut.execute({
      answerId: createdAnswer.id.toString(),
      authorId: createdAnswer.authorId.toString(),
      content: 'comment content',
    });

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
    if (result.isRight()) {
      expect(result.value.answerComment.id).toBeDefined();
      expect(result.value.answerComment.answerId).toEqual(createdAnswer.id);
      expect(result.value.answerComment.authorId).toEqual(createdAnswer.authorId);
      expect(result.value.answerComment.content).toEqual('comment content');
    }
  });

  it('should throw an error if answer is not found', async () => {
    const result = await sut.execute({
      answerId: 'answer-id',
      authorId: 'author-id',
      content: 'comment content',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
