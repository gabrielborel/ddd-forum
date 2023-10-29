import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { DeleteQuestionCommentUseCase } from './delete-question-comment';
import { makeQuestionComment } from 'test/factories/make-question-comment';

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

    await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
    });

    const deletedQuestionComment = await questionCommentsRepository.findById(questionComment.id.toString());
    expect(deletedQuestionComment).toBeNull();
  });

  it('should throw if question comment does not exist', async () => {
    await expect(
      sut.execute({
        questionCommentId: 'invalid_id',
        authorId: 'any_author_id',
      })
    ).rejects.toThrow('Question comment not found');
  });

  it('should throw if author is not the same as the question comment author', async () => {
    const questionComment = makeQuestionComment();
    await questionCommentsRepository.create(questionComment);

    await expect(
      sut.execute({
        questionCommentId: questionComment.id.toString(),
        authorId: 'invalid_author_id',
      })
    ).rejects.toThrow('Only the author can delete a question comment');
  });
});
