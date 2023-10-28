import { makeQuestion } from 'test/factories/make-question';
import { EditQuestionUseCase } from './edit-question';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let sut: EditQuestionUseCase;
let questionsRepository: InMemoryQuestionsRepository;

describe('Edit Question Use Case', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository();
    sut = new EditQuestionUseCase(questionsRepository);
  });

  it('should edit a question', async () => {
    const createdQuestion = makeQuestion({}, new UniqueEntityID('question-id'));
    await questionsRepository.create(createdQuestion);

    await sut.execute({
      questionId: 'question-id',
      authorId: createdQuestion.authorId.toString(),
      title: 'new title',
      content: 'new content',
    });

    const question = await questionsRepository.findById('question-id');
    expect(question?.title).toBe('new title');
    expect(question?.content).toBe('new content');
  });

  it('should throw an error if question does not exist', async () => {
    await expect(
      sut.execute({
        questionId: 'question-id',
        authorId: 'author-id',
        title: 'new title',
        content: 'new content',
      })
    ).rejects.toThrowError('Question not found');
  });

  it('should call questionsRepository.save with the correct question', async () => {
    const createdQuestion = makeQuestion({}, new UniqueEntityID('question-id'));
    await questionsRepository.create(createdQuestion);

    const saveSpy = vi.spyOn(questionsRepository, 'save');

    await sut.execute({
      questionId: 'question-id',
      authorId: createdQuestion.authorId.toString(),
      title: 'new title',
      content: 'new content',
    });

    /**
     * In the test environment, due to the way the InMemoryQuestionsRepository
     * is implemented, the question is referenced by the items array, so
     * the question is already updated in the repository.
     * So thats why we using toHaveBeenCalledWith(createdQuestion)
     */
    expect(saveSpy).toHaveBeenCalledWith(createdQuestion);
  });

  it('should throw an error if the author is not the author of the question', async () => {
    const createdQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('question-id')
    );
    await questionsRepository.create(createdQuestion);

    await expect(
      sut.execute({
        questionId: 'question-id',
        authorId: 'other-author-id',
        title: 'new title',
        content: 'new content',
      })
    ).rejects.toThrowError('Only the author can edit the question');
  });
});
