import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { CreateQuestionUseCase } from './create-question';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list';
import { InMemoryQuestionsAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';

let sut: CreateQuestionUseCase;
let questionsRepository: InMemoryQuestionsRepository;
let questionAttachmentsRepository: InMemoryQuestionsAttachmentsRepository;

describe('Create Question Use Case', () => {
  beforeEach(() => {
    vi.useFakeTimers();

    questionAttachmentsRepository = new InMemoryQuestionsAttachmentsRepository();
    questionsRepository = new InMemoryQuestionsRepository(questionAttachmentsRepository);
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
      attachmentsIds: ['attachment-id-1', 'attachment-id-2'],
    };

    const result = await sut.execute(input);

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
    if (result.isRight()) {
      expect(result.value.question.id).toBeDefined();
      expect(result.value.question.title).toEqual('question-title');
      expect(result.value.question.content).toEqual('question-content');
      expect(result.value.question.authorId).toEqual(new UniqueEntityID('author-id'));
      expect(result.value.question.attachments.currentItems).toHaveLength(2);
      expect(result.value.question.attachments.currentItems).toEqual([
        expect.objectContaining({ attachmentId: new UniqueEntityID('attachment-id-1') }),
        expect.objectContaining({ attachmentId: new UniqueEntityID('attachment-id-2') }),
      ]);
    }
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
        slug: expect.anything(),
        attachments: new QuestionAttachmentList([]),
      })
    );
  });
});
