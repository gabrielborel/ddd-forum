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

    const { answers } = await sut.execute({
      questionId: 'question-id-1',
      page: 1,
    });

    expect(answers.length).toBe(2);
    expect(answers).toEqual([
      expect.objectContaining({
        questionId: new UniqueEntityID('question-id-1'),
      }),
      expect.objectContaining({
        questionId: new UniqueEntityID('question-id-1'),
      }),
    ]);
  });

  it('should list question answers with pagination', async () => {
    for (let i = 0; i <= 22; i++) {
      await answersRepository.create(makeAnswer({ questionId: new UniqueEntityID('question-id') }));
    }

    const { answers: answersPageOne } = await sut.execute({
      questionId: 'question-id',
      page: 1,
    });
    expect(answersPageOne.length).toBe(20);

    const { answers: answersPageTwo } = await sut.execute({
      questionId: 'question-id',
      page: 2,
    });
    expect(answersPageTwo.length).toBe(3);
  });

  it('should return empty array if no answers are found', async () => {
    const { answers } = await sut.execute({
      questionId: 'question-id',
      page: 1,
    });

    expect(answers.length).toBe(0);
  });
});
