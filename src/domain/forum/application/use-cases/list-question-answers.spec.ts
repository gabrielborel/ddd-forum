import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { ListQuestionAnswersUseCase } from './list-question-answers';
import { makeAnswer } from 'test/factories/make-answer';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let sut: ListQuestionAnswersUseCase;
let answersRepository: InMemoryAnswersRepository;

describe('List Question Answers Use Case', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository();
    sut = new ListQuestionAnswersUseCase(answersRepository);
  });

  it('should list question answers', async () => {
    await answersRepository.create(makeAnswer({ questionId: new UniqueEntityID('question-id-1') }));
    await answersRepository.create(makeAnswer({ questionId: new UniqueEntityID('question-id-1') }));
    await answersRepository.create(makeAnswer({ questionId: new UniqueEntityID('question-id-2') }));

    const result = await sut.execute({
      questionId: 'question-id-1',
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
    if (result.isRight()) {
      expect(result.value.answers.length).toBe(2);
      expect(result.value.answers).toEqual([
        expect.objectContaining({
          questionId: new UniqueEntityID('question-id-1'),
        }),
        expect.objectContaining({
          questionId: new UniqueEntityID('question-id-1'),
        }),
      ]);
    }
  });

  it('should list question answers with pagination', async () => {
    for (let i = 0; i <= 22; i++) {
      await answersRepository.create(makeAnswer({ questionId: new UniqueEntityID('question-id') }));
    }

    const firstPageResult = await sut.execute({
      questionId: 'question-id',
      page: 1,
    });
    expect(firstPageResult.isRight()).toBe(true);
    expect(firstPageResult.isLeft()).toBe(false);
    if (firstPageResult.isRight()) {
      expect(firstPageResult.value.answers.length).toBe(20);
    }

    const secondPageResult = await sut.execute({
      questionId: 'question-id',
      page: 2,
    });
    expect(secondPageResult.isRight()).toBe(true);
    expect(secondPageResult.isLeft()).toBe(false);
    if (secondPageResult.isRight()) {
      expect(secondPageResult.value.answers.length).toBe(3);
    }
  });

  it('should return empty array if no answers are found', async () => {
    const result = await sut.execute({
      questionId: 'question-id',
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
    if (result.isRight()) {
      expect(result.value.answers.length).toBe(0);
    }
  });
});
