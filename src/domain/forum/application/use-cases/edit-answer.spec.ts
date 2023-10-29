import { makeAnswer } from 'test/factories/make-answer';
import { EditAnswerUseCase } from './edit-answer';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { NotAllowedError } from './errors/not-allowed-error';

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

    const result = await sut.execute({
      answerId: 'answer-id',
      authorId: createdAnswer.authorId.toString(),
      content: 'new content',
    });

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
    if (result.isRight()) {
      expect(result.value.answer.content).toEqual('new content');
    }
  });

  it('should throw an error if answer does not exist', async () => {
    const result = await sut.execute({
      answerId: 'answer-id',
      authorId: 'author-id',
      content: 'new content',
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
    });

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
