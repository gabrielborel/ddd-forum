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

    const result = await sut.execute({
      answerId: 'answer-id',
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
    if (result.isRight()) {
      expect(result.value.answerComments.length).toBe(2);
    }
  });

  it('should return a list of answer comments with pagination', async () => {
    for (let i = 0; i <= 22; i++) {
      await answerCommentsRepository.create(makeAnswerComment({ answerId: new UniqueEntityID('answer-id') }));
    }

    const firstPageResult = await sut.execute({
      answerId: 'answer-id',
      page: 1,
    });
    expect(firstPageResult.isRight()).toBe(true);
    expect(firstPageResult.isLeft()).toBe(false);
    if (firstPageResult.isRight()) {
      expect(firstPageResult.value.answerComments.length).toBe(20);
    }

    const secondPageResult = await sut.execute({
      answerId: 'answer-id',
      page: 2,
    });
    expect(secondPageResult.isRight()).toBe(true);
    expect(secondPageResult.isLeft()).toBe(false);
    if (secondPageResult.isRight()) {
      expect(secondPageResult.value.answerComments.length).toBe(3);
    }
  });

  it('should return an empty list if no answer comments are found', async () => {
    const result = await sut.execute({
      answerId: 'answer-id',
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
    if (result.isRight()) {
      expect(result.value.answerComments.length).toBe(0);
    }
  });
});
