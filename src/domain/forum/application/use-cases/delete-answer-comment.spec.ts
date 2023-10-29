import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';
import { DeleteAnswerCommentUseCase } from './delete-answer-comment';
import { makeAnswerComment } from 'test/factories/make-answer-comment';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { NotAllowedError } from './errors/not-allowed-error';

let sut: DeleteAnswerCommentUseCase;
let answerCommentsRepository: InMemoryAnswerCommentsRepository;

describe('Delete Answer Comment Use Case', () => {
  beforeEach(() => {
    answerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new DeleteAnswerCommentUseCase(answerCommentsRepository);
  });

  it('should delete a answer comment', async () => {
    const answerComment = makeAnswerComment();
    await answerCommentsRepository.create(answerComment);

    const result = await sut.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: answerComment.authorId.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
    const deletedAnswerComment = await answerCommentsRepository.findById(answerComment.id.toString());
    expect(deletedAnswerComment).toBeNull();
  });

  it('should throw if answer comment does not exist', async () => {
    const result = await sut.execute({
      answerCommentId: 'invalid_id',
      authorId: 'any_author_id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should throw if author is not the same as the answer comment author', async () => {
    const answerComment = makeAnswerComment();
    await answerCommentsRepository.create(answerComment);

    const result = await sut.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: 'invalid_author_id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
