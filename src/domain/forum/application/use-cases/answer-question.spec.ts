import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { AnswerQuestionUseCase } from './answer-question';

let answersRepository: InMemoryAnswersRepository;
let sut: AnswerQuestionUseCase;

describe('Answer Question Use Case', () => {
  beforeEach(() => {
    vi.useFakeTimers();

    answersRepository = new InMemoryAnswersRepository();
    sut = new AnswerQuestionUseCase(answersRepository);
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should create an answer', async () => {
    const input = {
      questionId: 'question-id',
      instructorId: 'instructor-id',
      content: 'answer-content',
    };

    const { answer } = await sut.execute(input);
    expect(answer.content).toEqual('answer-content');
    expect(answer.questionId).toEqual(new UniqueEntityID('question-id'));
    expect(answer.authorId).toEqual(new UniqueEntityID('instructor-id'));
    expect(answer.id).toBeDefined();
  });

  it('should call AnswersRepository.create with correct values', async () => {
    const input = {
      questionId: 'question-id',
      instructorId: 'instructor-id',
      content: 'answer-content',
    };

    const createSpy = vi.spyOn(answersRepository, 'create');

    await sut.execute(input);

    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        content: 'answer-content',
        questionId: new UniqueEntityID('question-id'),
        authorId: new UniqueEntityID('instructor-id'),
        createdAt: expect.any(Date),
      })
    );
  });
});
