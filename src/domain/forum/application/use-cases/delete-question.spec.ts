import { makeQuestion } from 'test/factories/make-question';
import { DeleteQuestionUseCase } from './delete-question';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let sut: DeleteQuestionUseCase;
let questionsRepository: InMemoryQuestionsRepository;

describe('Delete Question Use Case', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository();
    sut = new DeleteQuestionUseCase(questionsRepository);
  });

  it('should delete a question', async () => {
    const createdQuestion = makeQuestion({}, new UniqueEntityID('question-id'));
    await questionsRepository.create(createdQuestion);

    await sut.execute({
      questionId: 'question-id',
      authorId: createdQuestion.authorId.toString(),
    });

    const question = await questionsRepository.findById('question-id');

    expect(question).toBeNull();
  });

  it('should throw an error if question does not exist', async () => {
    await expect(sut.execute({ questionId: 'question-id', authorId: 'author-id' })).rejects.toThrowError(
      'Question not found'
    );
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

    await expect(sut.execute({ questionId: 'question-id', authorId: 'other-author-id' })).rejects.toThrowError(
      'Only the author can delete the question'
    );
  });
});
