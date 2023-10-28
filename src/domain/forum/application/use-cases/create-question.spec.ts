import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { QuestionsRepository } from '../repositories/questions-repository';
import { CreateQuestionUseCase } from './create-question';

const makeQuestionsRepositoryStub = (): QuestionsRepository => {
  class QuestionsRepositoryStub implements QuestionsRepository {
    async create(): Promise<void> {}
  }
  return new QuestionsRepositoryStub();
};

type SutType = {
  sut: CreateQuestionUseCase;
  questionsRepositoryStub: QuestionsRepository;
};

const makeSut = (): SutType => {
  const questionsRepositoryStub = makeQuestionsRepositoryStub();
  const sut = new CreateQuestionUseCase(questionsRepositoryStub);
  return { sut, questionsRepositoryStub };
};

describe('CreateQuestionUseCase', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should create a question', async () => {
    const { sut } = makeSut();

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
    const { sut, questionsRepositoryStub } = makeSut();

    const input = {
      authorId: 'author-id',
      title: 'question-title',
      content: 'question-content',
    };

    const createSpy = vi.spyOn(questionsRepositoryStub, 'create');

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
