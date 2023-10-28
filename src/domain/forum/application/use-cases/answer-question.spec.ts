import { AnswerQuestionUseCase } from './answer-question';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

const makeAnswersRepositoryStub = (): AnswersRepository => {
  class AnswersRepositoryStub implements AnswersRepository {
    async create(): Promise<void> {}
  }
  return new AnswersRepositoryStub();
};

type SutTypes = {
  sut: AnswerQuestionUseCase;
  answersRepositoryStub: AnswersRepository;
};

const makeSut = (): SutTypes => {
  const answersRepositoryStub = makeAnswersRepositoryStub();
  const sut = new AnswerQuestionUseCase(answersRepositoryStub);
  return {
    sut,
    answersRepositoryStub,
  };
};

describe('AnswerQuestionUseCase', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  test('should create an answer', async () => {
    const { sut } = makeSut();

    const input = {
      questionId: 'question-id',
      instructorId: 'instructor-id',
      content: 'answer-content',
    };

    const answer = await sut.execute(input);
    expect(answer.content).toEqual('answer-content');
    expect(answer.questionId).toEqual(new UniqueEntityID('question-id'));
    expect(answer.authorId).toEqual(new UniqueEntityID('instructor-id'));
    expect(answer.id).toBeDefined();
  });

  test('should call AnswersRepository.create with correct values', async () => {
    const { sut, answersRepositoryStub } = makeSut();

    const input = {
      questionId: 'question-id',
      instructorId: 'instructor-id',
      content: 'answer-content',
    };

    const createSpy = vi.spyOn(answersRepositoryStub, 'create');

    const answer = await sut.execute(input);

    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: answer.id,
        props: {
          content: 'answer-content',
          questionId: new UniqueEntityID('question-id'),
          authorId: new UniqueEntityID('instructor-id'),
          createdAt: new Date(),
        },
      })
    );
  });
});
