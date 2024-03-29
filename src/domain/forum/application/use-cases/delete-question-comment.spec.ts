import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { DeleteQuestionCommentUseCase } from './delete-question-comment';
import { makeQuestionComment } from 'test/factories/make-question-comment';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

let sut: DeleteQuestionCommentUseCase;
let questionCommentsRepository: InMemoryQuestionCommentsRepository;

describe('Delete Question Comment Use Case', () => {
  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentsRepository();
    sut = new DeleteQuestionCommentUseCase(questionCommentsRepository);
  });

  it('should delete a question comment', async () => {
    const questionComment = makeQuestionComment();
    await questionCommentsRepository.create(questionComment);

    const result = await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
    const deletedQuestionComment = await questionCommentsRepository.findById(
      questionComment.id.toString()
    );
    expect(deletedQuestionComment).toBeNull();
  });

  it('should throw if question comment does not exist', async () => {
    const result = await sut.execute({
      questionCommentId: 'invalid_id',
      authorId: 'any_author_id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should throw if author is not the same as the question comment author', async () => {
    const questionComment = makeQuestionComment();
    await questionCommentsRepository.create(questionComment);

    const result = await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: 'invalid_author_id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
