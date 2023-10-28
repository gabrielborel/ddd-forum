import { makeAnswer } from 'test/factories/make-answer';
import { EditAnswerUseCase } from './edit-answer';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let sut: EditAnswerUseCase;
let answersRepository: InMemoryAnswersRepository;

describe('Edit Answer Use Case', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository();
    sut = new EditAnswerUseCase(answersRepository);
  });

  it('should edit a answer', async () => {
    const createdAnswer = makeAnswer({}, new UniqueEntityID('answer-id'));
    await answersRepository.create(createdAnswer);

    const { answer } = await sut.execute({
      answerId: 'answer-id',
      authorId: createdAnswer.authorId.toString(),
      content: 'new content',
    });

    expect(answer.content).toBe('new content');
  });

  it('should throw an error if answer does not exist', async () => {
    await expect(
      sut.execute({
        answerId: 'answer-id',
        authorId: 'author-id',
        content: 'new content',
      })
    ).rejects.toThrowError('Answer not found');
  });

  it('should call answersRepository.save with the correct answer', async () => {
    const createdAnswer = makeAnswer({}, new UniqueEntityID('answer-id'));
    await answersRepository.create(createdAnswer);

    const saveSpy = vi.spyOn(answersRepository, 'save');

    const { answer: updatedAnswer } = await sut.execute({
      answerId: 'answer-id',
      authorId: createdAnswer.authorId.toString(),
      content: 'new content',
    });

    expect(saveSpy).toHaveBeenCalledWith(updatedAnswer);
  });

  it('should throw an error if the author is not the author of the answer', async () => {
    const createdAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('answer-id')
    );
    await answersRepository.create(createdAnswer);

    await expect(
      sut.execute({
        answerId: 'answer-id',
        authorId: 'other-author-id',
        content: 'new content',
      })
    ).rejects.toThrowError('Only the author can edit the answer');
  });
});
