import { makeQuestion } from 'test/factories/make-question';
import { DeleteQuestionUseCase } from './delete-question';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { makeQuestionAttachment } from 'test/factories/make-question-attachment';

let sut: DeleteQuestionUseCase;
let questionsRepository: InMemoryQuestionsRepository;
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;

describe('Delete Question Use Case', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    questionsRepository = new InMemoryQuestionsRepository(questionAttachmentsRepository);
    sut = new DeleteQuestionUseCase(questionsRepository);
  });

  it('should delete a question', async () => {
    const createdQuestion = makeQuestion({}, new UniqueEntityID('question-id'));
    await questionsRepository.create(createdQuestion);

    questionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: createdQuestion.id,
        attachmentId: new UniqueEntityID('attachment-1'),
      }),
      makeQuestionAttachment({
        questionId: createdQuestion.id,
        attachmentId: new UniqueEntityID('attachment-2'),
      })
    );

    const result = await sut.execute({
      questionId: 'question-id',
      authorId: createdQuestion.authorId.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
    const question = await questionsRepository.findById('question-id');
    expect(question).toBeNull();
    expect(questionAttachmentsRepository.items).toHaveLength(0);
  });

  it('should throw an error if question does not exist', async () => {
    const result = await sut.execute({ questionId: 'question-id', authorId: 'author-id' });
    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should call questionsRepository.delete with the correct question', async () => {
    const createdQuestion = makeQuestion({}, new UniqueEntityID('question-id'));
    await questionsRepository.create(createdQuestion);

    const deleteSpy = vi.spyOn(questionsRepository, 'delete');

    await sut.execute({
      questionId: 'question-id',
      authorId: createdQuestion.authorId.toString(),
    });

    expect(deleteSpy).toHaveBeenCalledWith(createdQuestion);
  });

  it('should throw an error if the author is not the author of the question', async () => {
    const createdQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('question-id')
    );
    await questionsRepository.create(createdQuestion);

    const result = await sut.execute({ questionId: 'question-id', authorId: 'other-author-id' });

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
