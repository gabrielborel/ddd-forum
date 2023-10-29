import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';
import { DeleteAnswerCommentUseCase } from './delete-answer-comment';
import { makeAnswerComment } from 'test/factories/make-answer-comment';

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

    await sut.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: answerComment.authorId.toString(),
    });

    const deletedAnswerComment = await answerCommentsRepository.findById(answerComment.id.toString());
    expect(deletedAnswerComment).toBeNull();
  });

  it('should throw if answer comment does not exist', async () => {
    await expect(
      sut.execute({
        answerCommentId: 'invalid_id',
        authorId: 'any_author_id',
      })
    ).rejects.toThrow('Answer comment not found');
  });

  it('should throw if author is not the same as the answer comment author', async () => {
    const answerComment = makeAnswerComment();
    await answerCommentsRepository.create(answerComment);

    await expect(
      sut.execute({
        answerCommentId: answerComment.id.toString(),
        authorId: 'invalid_author_id',
      })
    ).rejects.toThrow('Only the author can delete a answer comment');
  });
});
