import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { GetQuestionBySlugUseCase } from './get-question-by-slug';
import { Slug } from '../../enterprise/entities/value-objects/slug';
import { makeQuestion } from 'test/factories/make-question';

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

    const { question } = await sut.execute({ slug: 'question-slug' });

    expect(question.id).toBeDefined();
    expect(question.slug.value).toEqual('question-slug');
    expect(question.title).toEqual(createdQuestion.title);
    expect(question.content).toEqual(createdQuestion.content);
    expect(question.authorId).toEqual(createdQuestion.authorId);
  });

  it('should throw an error if question is not found', async () => {
    await expect(sut.execute({ slug: 'question-slug' })).rejects.toThrowError(
      'Question not found'
    );
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
