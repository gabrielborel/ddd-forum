import { DeleteAnswerUseCase } from './delete-answer';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeAnswer } from 'test/factories/make-answer';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { NotAllowedError } from './errors/not-allowed-error';

let sut: DeleteAnswerUseCase;
let answersRepository: InMemoryAnswersRepository;

describe('Delete Answer Use Case', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository();
    sut = new DeleteAnswerUseCase(answersRepository);
  });

  it('should delete a answer', async () => {
    const createdAnswer = makeAnswer({}, new UniqueEntityID('answer-id'));
    await answersRepository.create(createdAnswer);

    const result = await sut.execute({
      answerId: 'answer-id',
      authorId: createdAnswer.authorId.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
    const answer = await answersRepository.findById('answer-id');
    expect(answer).toBeNull();
  });

  it('should throw an error if answer does not exist', async () => {
    const result = await sut.execute({ answerId: 'answer-id', authorId: 'author-id' });
    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should call answersRepository.delete with the correct answer', async () => {
    const createdAnswer = makeAnswer({}, new UniqueEntityID('answer-id'));
    await answersRepository.create(createdAnswer);

    const deleteSpy = vi.spyOn(answersRepository, 'delete');

    await sut.execute({
      answerId: 'answer-id',
      authorId: createdAnswer.authorId.toString(),
    });

    expect(deleteSpy).toHaveBeenCalledWith(createdAnswer);
  });

  it('should throw an error if the author is not the author of the answer', async () => {
    const createdAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('answer-id')
    );
    await answersRepository.create(createdAnswer);

    const result = await sut.execute({ answerId: 'answer-id', authorId: 'other-author-id' });
    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
