import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';
import { ListAnswerCommentsUseCase } from './list-answer-comments';
import { makeAnswerComment } from 'test/factories/make-answer-comment';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let sut: ListAnswerCommentsUseCase;
let answerCommentsRepository: InMemoryAnswerCommentsRepository;

describe('List Answer Comments Use Case', () => {
  beforeEach(() => {
    answerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new ListAnswerCommentsUseCase(answerCommentsRepository);
  });

  it('should return a list of answer comments', async () => {
    await answerCommentsRepository.create(makeAnswerComment({ answerId: new UniqueEntityID('answer-id') }));
    await answerCommentsRepository.create(makeAnswerComment({ answerId: new UniqueEntityID('answer-id') }));
    await answerCommentsRepository.create(makeAnswerComment({ answerId: new UniqueEntityID('answer-id-2') }));

    const { answerComments } = await sut.execute({
      answerId: 'answer-id',
      page: 1,
    });

    expect(answerComments.length).toBe(2);
  });

  it('should return a list of answer comments with pagination', async () => {
    for (let i = 0; i <= 22; i++) {
      await answerCommentsRepository.create(makeAnswerComment({ answerId: new UniqueEntityID('answer-id') }));
    }

    const { answerComments: answerCommentFirstPage } = await sut.execute({
      answerId: 'answer-id',
      page: 1,
    });
    expect(answerCommentFirstPage.length).toBe(20);

    const { answerComments: answerCommentSecondPage } = await sut.execute({
      answerId: 'answer-id',
      page: 2,
    });
    expect(answerCommentSecondPage.length).toBe(3);
  });

  it('should return an empty list if no answer comments are found', async () => {
    const { answerComments } = await sut.execute({
      answerId: 'answer-id',
      page: 1,
    });

    expect(answerComments.length).toBe(0);
  });
});
