import { makeAnswer } from 'test/factories/make-answer';
import { EditAnswerUseCase } from './edit-answer';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment';

let sut: EditAnswerUseCase;
let answersRepository: InMemoryAnswersRepository;
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;

describe('Edit Answer Use Case', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
    answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository);
    sut = new EditAnswerUseCase(answersRepository, answerAttachmentsRepository);
  });

  it('should edit a answer', async () => {
    const createdAnswer = makeAnswer({}, new UniqueEntityID('answer-id'));
    await answersRepository.create(createdAnswer);

    answerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: createdAnswer.id,
        attachmentId: new UniqueEntityID('attachment-1'),
      }),
      makeAnswerAttachment({
        answerId: createdAnswer.id,
        attachmentId: new UniqueEntityID('attachment-2'),
      })
    );

    const result = await sut.execute({
      answerId: 'answer-id',
      authorId: createdAnswer.authorId.toString(),
      content: 'new content',
      attachmentsIds: ['attachment-1', 'attachment-3'],
    });

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
    if (result.isRight()) {
      expect(result.value.answer.content).toEqual('new content');
      expect(result.value.answer.attachments.currentItems).toHaveLength(2);
      expect(result.value.answer.attachments.currentItems).toEqual([
        expect.objectContaining({
          attachmentId: new UniqueEntityID('attachment-1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID('attachment-3'),
        }),
      ]);
    }
  });

  it('should throw an error if answer does not exist', async () => {
    const result = await sut.execute({
      answerId: 'answer-id',
      authorId: 'author-id',
      content: 'new content',
      attachmentsIds: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should call answersRepository.save with the correct answer', async () => {
    const createdAnswer = makeAnswer({}, new UniqueEntityID('answer-id'));
    await answersRepository.create(createdAnswer);

    const saveSpy = vi.spyOn(answersRepository, 'save');

    const result = await sut.execute({
      answerId: 'answer-id',
      authorId: createdAnswer.authorId.toString(),
      content: 'new content',
      attachmentsIds: [],
    });

    expect(result.isLeft()).toBe(false);
    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(saveSpy).toHaveBeenCalledWith(result.value.answer);
    }
  });

  it('should throw an error if the author is not the author of the answer', async () => {
    const createdAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('answer-id')
    );
    await answersRepository.create(createdAnswer);

    const result = await sut.execute({
      answerId: 'answer-id',
      authorId: 'other-author-id',
      content: 'new content',
      attachmentsIds: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
