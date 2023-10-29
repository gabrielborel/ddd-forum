import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { ListQuestionCommentsUseCase } from './list-question-comments';
import { makeQuestionComment } from 'test/factories/make-question-comment';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let sut: ListQuestionCommentsUseCase;
let questionCommentsRepository: InMemoryQuestionCommentsRepository;

describe('List Question Comments Use Case', () => {
  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentsRepository();
    sut = new ListQuestionCommentsUseCase(questionCommentsRepository);
  });

  it('should return a list of question comments', async () => {
    await questionCommentsRepository.create(makeQuestionComment({ questionId: new UniqueEntityID('question-id') }));
    await questionCommentsRepository.create(makeQuestionComment({ questionId: new UniqueEntityID('question-id') }));
    await questionCommentsRepository.create(makeQuestionComment({ questionId: new UniqueEntityID('question-id-2') }));

    const result = await sut.execute({
      questionId: 'question-id',
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
    if (result.isRight()) {
      expect(result.value.questionComments.length).toBe(2);
      expect(result.value.questionComments).toEqual([
        expect.objectContaining({
          questionId: new UniqueEntityID('question-id'),
        }),
        expect.objectContaining({
          questionId: new UniqueEntityID('question-id'),
        }),
      ]);
    }
  });

  it('should return a list of question comments with pagination', async () => {
    for (let i = 0; i <= 22; i++) {
      await questionCommentsRepository.create(makeQuestionComment({ questionId: new UniqueEntityID('question-id') }));
    }

    const firstPageResult = await sut.execute({
      questionId: 'question-id',
      page: 1,
    });
    expect(firstPageResult.isRight()).toBe(true);
    expect(firstPageResult.isLeft()).toBe(false);
    if (firstPageResult.isRight()) {
      expect(firstPageResult.value.questionComments.length).toBe(20);
    }

    const secondPageResult = await sut.execute({
      questionId: 'question-id',
      page: 2,
    });
    expect(secondPageResult.isRight()).toBe(true);
    expect(secondPageResult.isLeft()).toBe(false);
    if (secondPageResult.isRight()) {
      expect(secondPageResult.value.questionComments.length).toBe(3);
    }
  });

  it('should return an empty list if no question comments are found', async () => {
    const result = await sut.execute({
      questionId: 'question-id',
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
    if (result.isRight()) {
      expect(result.value.questionComments.length).toBe(0);
    }
  });
});
