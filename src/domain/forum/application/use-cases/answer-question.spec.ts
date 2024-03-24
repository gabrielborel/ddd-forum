import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { AnswerQuestionUseCase } from './answer-question';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';

let answersRepository: InMemoryAnswersRepository;
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: AnswerQuestionUseCase;

describe('Answer Question Use Case', () => {
  beforeEach(() => {
    vi.useFakeTimers();

    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
    answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository);
    sut = new AnswerQuestionUseCase(answersRepository);
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should create an answer', async () => {
    const result = await sut.execute({
      questionId: 'question-id',
      instructorId: 'instructor-id',
      content: 'answer-content',
      attachmentsIds: ['attachment-1', 'attachment-2'],
    });

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
    if (result.isRight()) {
      expect(result.value.answer.content).toEqual('answer-content');
      expect(result.value.answer.questionId).toEqual(new UniqueEntityID('question-id'));
      expect(result.value.answer.authorId).toEqual(new UniqueEntityID('instructor-id'));
      expect(result.value.answer.id).toBeDefined();
      expect(result.value.answer.attachments.currentItems).toHaveLength(2);
      expect(result.value.answer.attachments.currentItems).toEqual([
        expect.objectContaining({
          attachmentId: new UniqueEntityID('attachment-1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID('attachment-2'),
        }),
      ]);
    }
  });

  it('should call AnswersRepository.create with correct values', async () => {
    const createSpy = vi.spyOn(answersRepository, 'create');

    await sut.execute({
      questionId: 'question-id',
      instructorId: 'instructor-id',
      content: 'answer-content',
      attachmentsIds: [],
    });

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
