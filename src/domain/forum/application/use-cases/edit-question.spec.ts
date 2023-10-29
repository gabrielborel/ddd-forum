import { makeQuestion } from 'test/factories/make-question';
import { EditQuestionUseCase } from './edit-question';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { NotAllowedError } from './errors/not-allowed-error';

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

    const result = await sut.execute({
      questionId: 'question-id',
      authorId: createdQuestion.authorId.toString(),
      title: 'new title',
      content: 'new content',
    });

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
    if (result.isRight()) {
      expect(result.value.question.title).toEqual('new title');
      expect(result.value.question.content).toEqual('new content');
    }
  });

  it('should throw an error if question does not exist', async () => {
    const result = await sut.execute({
      questionId: 'question-id',
      authorId: 'author-id',
      title: 'new title',
      content: 'new content',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should call questionsRepository.save with the correct question', async () => {
    const createdQuestion = makeQuestion({}, new UniqueEntityID('question-id'));
    await questionsRepository.create(createdQuestion);

    const saveSpy = vi.spyOn(questionsRepository, 'save');

    const result = await sut.execute({
      questionId: 'question-id',
      authorId: createdQuestion.authorId.toString(),
      title: 'new title',
      content: 'new content',
    });

    expect(result.isLeft()).toBe(false);
    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(saveSpy).toHaveBeenCalledWith(result.value.question);
    }
  });

  it('should throw an error if the author is not the author of the question', async () => {
    const createdQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('question-id')
    );
    await questionsRepository.create(createdQuestion);

    const result = await sut.execute({
      questionId: 'question-id',
      authorId: 'other-author-id',
      title: 'new title',
      content: 'new content',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
