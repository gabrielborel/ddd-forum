import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { ListQuestionCommentsUseCase } from './list-question-comments';
import { makeQuestionComment } from 'test/factories/make-question-comment';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let sut: ListQuestionCommentsUseCase;
let questionCommentsRepository: InMemoryQuestionCommentsRepository;

describe('List Question Comments Use Case', () => {
  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentsRepository();
    sut = new ListQuestionCommentsUseCase(questionCommentsRepository);
  });

  it('should return a list of question comments', async () => {
    await questionCommentsRepository.create(makeQuestionComment({ questionId: new UniqueEntityID('question-id') }));
    await questionCommentsRepository.create(makeQuestionComment({ questionId: new UniqueEntityID('question-id') }));
    await questionCommentsRepository.create(makeQuestionComment({ questionId: new UniqueEntityID('question-id-2') }));

    const { questionComments } = await sut.execute({
      questionId: 'question-id',
      page: 1,
    });

    expect(questionComments.length).toBe(2);
  });

  it('should return a list of question comments with pagination', async () => {
    for (let i = 0; i <= 22; i++) {
      await questionCommentsRepository.create(makeQuestionComment({ questionId: new UniqueEntityID('question-id') }));
    }

    const { questionComments: questionCommentFirstPage } = await sut.execute({
      questionId: 'question-id',
      page: 1,
    });
    expect(questionCommentFirstPage.length).toBe(20);

    const { questionComments: questionCommentSecondPage } = await sut.execute({
      questionId: 'question-id',
      page: 2,
    });
    expect(questionCommentSecondPage.length).toBe(3);
  });

  it('should return an empty list if no question comments are found', async () => {
    const { questionComments } = await sut.execute({
      questionId: 'question-id',
      page: 1,
    });

    expect(questionComments.length).toBe(0);
  });
});
