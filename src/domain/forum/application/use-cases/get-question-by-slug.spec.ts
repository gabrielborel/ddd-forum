import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { GetQuestionBySlugUseCase } from './get-question-by-slug';
import { Slug } from '../../enterprise/entities/value-objects/slug';
import { makeQuestion } from 'test/factories/make-question';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

let sut: GetQuestionBySlugUseCase;
let questionsRepository: InMemoryQuestionsRepository;

describe('Get Question By Slug Use Case', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository();
    sut = new GetQuestionBySlugUseCase(questionsRepository);
  });

  it('should find a question by slug', async () => {
    const createdQuestion = makeQuestion({
      slug: Slug.create('question-slug'),
    });
    await questionsRepository.create(createdQuestion);

    const result = await sut.execute({ slug: 'question-slug' });

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
    if (result.isRight()) {
      expect(result.value.question.id).toBeDefined();
      expect(result.value.question.slug.value).toEqual('question-slug');
      expect(result.value.question.title).toEqual(createdQuestion.title);
      expect(result.value.question.content).toEqual(createdQuestion.content);
      expect(result.value.question.authorId).toEqual(createdQuestion.authorId);
    }
  });

  it('should throw an error if question is not found', async () => {
    const result = await sut.execute({ slug: 'question-slug' });
    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    if (result.isRight()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });

  it('should call QuestionsRepository.findBySlug with correct values', async () => {
    const createdQuestion = makeQuestion({
      slug: Slug.create('question-slug'),
    });
    await questionsRepository.create(createdQuestion);

    const findBySlugSpy = vi.spyOn(questionsRepository, 'findBySlug');
    await sut.execute({ slug: 'question-slug' });

    expect(findBySlugSpy).toHaveBeenCalledWith('question-slug');
  });
});
