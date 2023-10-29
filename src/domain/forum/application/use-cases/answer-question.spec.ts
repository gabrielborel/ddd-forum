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

    const result = await sut.execute(input);
    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
    expect(result.value?.answer.content).toEqual('answer-content');
    expect(result.value?.answer.questionId).toEqual(new UniqueEntityID('question-id'));
    expect(result.value?.answer.authorId).toEqual(new UniqueEntityID('instructor-id'));
    expect(result.value?.answer.id).toBeDefined();
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
