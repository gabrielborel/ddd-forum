import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { CreateQuestionUseCase } from './create-question';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';

let questionsRepository: InMemoryQuestionsRepository;
let sut: CreateQuestionUseCase;

describe('Create Question Use Case', () => {
  beforeEach(() => {
    vi.useFakeTimers();

    questionsRepository = new InMemoryQuestionsRepository();
    sut = new CreateQuestionUseCase(questionsRepository);
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should create a question', async () => {
    const input = {
      authorId: 'author-id',
      title: 'question-title',
      content: 'question-content',
    };

    const { question } = await sut.execute(input);
    expect(question.title).toEqual('question-title');
    expect(question.content).toEqual('question-content');
    expect(question.authorId).toEqual(new UniqueEntityID('author-id'));
    expect(question.id).toBeDefined();
  });

  it('should call QuestionsRepository.create with correct values', async () => {
    const input = {
      authorId: 'author-id',
      title: 'question-title',
      content: 'question-content',
    };

    const createSpy = vi.spyOn(questionsRepository, 'create');

    await sut.execute(input);

    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'question-title',
        content: 'question-content',
        authorId: new UniqueEntityID('author-id'),
        createdAt: expect.any(Date),
      })
    );
  });
});
