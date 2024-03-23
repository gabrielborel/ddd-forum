import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { ListRecentQuestionsUseCase } from './list-recent-questions';
import { makeQuestion } from 'test/factories/make-question';
import { InMemoryQuestionsAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';

let sut: ListRecentQuestionsUseCase;
let questionsRepository: InMemoryQuestionsRepository;
let questionAttachmentsRepository: InMemoryQuestionsAttachmentsRepository;

describe('List Recent Questions Use Case', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionsAttachmentsRepository();
    questionsRepository = new InMemoryQuestionsRepository(questionAttachmentsRepository);
    sut = new ListRecentQuestionsUseCase(questionsRepository);
  });

  it('should list recent questions', async () => {
    await questionsRepository.create(makeQuestion({ createdAt: new Date(2023, 0, 23) }));
    await questionsRepository.create(makeQuestion({ createdAt: new Date(2023, 0, 20) }));
    await questionsRepository.create(makeQuestion({ createdAt: new Date(2023, 0, 18) }));

    const result = await sut.execute({ page: 1 });

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
    if (result.isRight()) {
      expect(result.value.questions.length).toBe(3);
      expect(result.value.questions).toEqual([
        expect.objectContaining({
          createdAt: new Date(2023, 0, 23),
        }),
        expect.objectContaining({
          createdAt: new Date(2023, 0, 20),
        }),
        expect.objectContaining({
          createdAt: new Date(2023, 0, 18),
        }),
      ]);
    }
  });

  it('should list recent questions with pagination', async () => {
    for (let i = 0; i <= 22; i++) {
      await questionsRepository.create(makeQuestion());
    }

    const firstPageResult = await sut.execute({ page: 1 });
    expect(firstPageResult.isRight()).toBe(true);
    expect(firstPageResult.isLeft()).toBe(false);
    if (firstPageResult.isRight()) {
      expect(firstPageResult.value.questions.length).toBe(20);
    }

    const secondPageResult = await sut.execute({ page: 2 });
    expect(secondPageResult.isRight()).toBe(true);
    expect(secondPageResult.isLeft()).toBe(false);
    if (secondPageResult.isRight()) {
      expect(secondPageResult.value.questions.length).toBe(3);
    }
  });

  it('should return an empty array if there are no questions', async () => {
    const result = await sut.execute({ page: 1 });
    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
    if (result.isRight()) {
      expect(result.value.questions.length).toBe(0);
    }
  });
});
