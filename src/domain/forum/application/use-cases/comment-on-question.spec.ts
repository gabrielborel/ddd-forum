import { makeQuestion } from 'test/factories/make-question';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { QuestionCommentsRepository } from '../repositories/question-comments-repository';
import { CommentOnQuestionUseCase } from './comment-on-question';

let sut: CommentOnQuestionUseCase;
let questionsRepository: InMemoryQuestionsRepository;
let questionCommentsRepository: QuestionCommentsRepository;

describe('Comment On Question Use Case', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository();
    questionCommentsRepository = new InMemoryQuestionCommentsRepository();
    sut = new CommentOnQuestionUseCase(questionsRepository, questionCommentsRepository);
  });

  it('should comment on a question', async () => {
    const createdQuestion = makeQuestion({});
    await questionsRepository.create(createdQuestion);

    const { questionComment } = await sut.execute({
      questionId: createdQuestion.id.toString(),
      authorId: createdQuestion.authorId.toString(),
      content: 'comment content',
    });

    expect(questionComment.id).toBeDefined();
    expect(questionComment.questionId).toEqual(createdQuestion.id);
    expect(questionComment.authorId).toEqual(createdQuestion.authorId);
    expect(questionComment.content).toEqual('comment content');
  });

  it('should throw an error if question is not found', async () => {
    await expect(
      sut.execute({
        questionId: 'question-id',
        authorId: 'author-id',
        content: 'comment content',
      })
    ).rejects.toThrowError('Question not found');
  });
});
