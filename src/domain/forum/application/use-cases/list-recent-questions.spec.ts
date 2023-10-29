import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { ListRecentQuestionsUseCase } from './list-recent-questions';
import { makeQuestion } from 'test/factories/make-question';

let sut: ListRecentQuestionsUseCase;
let questionsRepository: InMemoryQuestionsRepository;

describe('List Recent Questions Use Case', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository();
    sut = new ListRecentQuestionsUseCase(questionsRepository);
  });

  it('should list recent questions', async () => {
    await questionsRepository.create(makeQuestion({ createdAt: new Date(2023, 0, 23) }));
    await questionsRepository.create(makeQuestion({ createdAt: new Date(2023, 0, 20) }));
    await questionsRepository.create(makeQuestion({ createdAt: new Date(2023, 0, 18) }));

    const { questions } = await sut.execute({ page: 1 });

    expect(questions.length).toBe(3);
    expect(questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2023, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2023, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2023, 0, 18) }),
    ]);
  });

  it('should list recent questions with pagination', async () => {
    for (let i = 0; i <= 22; i++) {
      await questionsRepository.create(makeQuestion());
    }

    const { questions: questionPageOne } = await sut.execute({ page: 1 });
    expect(questionPageOne.length).toBe(20);

    const { questions: questionsPageTwo } = await sut.execute({ page: 2 });
    expect(questionsPageTwo.length).toBe(3);
  });

  it('should return an empty array if there are no questions', async () => {
    const { questions } = await sut.execute({ page: 1 });
    expect(questions.length).toBe(0);
  });
});
