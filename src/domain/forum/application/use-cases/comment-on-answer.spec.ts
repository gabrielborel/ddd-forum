import { makeAnswer } from 'test/factories/make-answer';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';
import { CommentOnAnswerUseCase } from './comment-on-answer';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';

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

    const { answerComment } = await sut.execute({
      answerId: createdAnswer.id.toString(),
      authorId: createdAnswer.authorId.toString(),
      content: 'comment content',
    });

    expect(answerComment.id).toBeDefined();
    expect(answerComment.answerId).toEqual(createdAnswer.id);
    expect(answerComment.authorId).toEqual(createdAnswer.authorId);
    expect(answerComment.content).toEqual('comment content');
  });

  it('should throw an error if answer is not found', async () => {
    await expect(
      sut.execute({
        answerId: 'answer-id',
        authorId: 'author-id',
        content: 'comment content',
      })
    ).rejects.toThrowError('Answer not found');
  });
});
