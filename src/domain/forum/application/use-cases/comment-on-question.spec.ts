import { makeQuestion } from 'test/factories/make-question';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { QuestionCommentsRepository } from '../repositories/question-comments-repository';
import { CommentOnQuestionUseCase } from './comment-on-question';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { InMemoryQuestionsAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';

let sut: CommentOnQuestionUseCase;
let questionsRepository: InMemoryQuestionsRepository;
let questionCommentsRepository: QuestionCommentsRepository;
let questionAttachmentsRepository: InMemoryQuestionsAttachmentsRepository;

describe('Comment On Question Use Case', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionsAttachmentsRepository();
    questionsRepository = new InMemoryQuestionsRepository(questionAttachmentsRepository);
    questionCommentsRepository = new InMemoryQuestionCommentsRepository();
    sut = new CommentOnQuestionUseCase(questionsRepository, questionCommentsRepository);
  });

  it('should comment on a question', async () => {
    const createdQuestion = makeQuestion({});
    await questionsRepository.create(createdQuestion);

    const result = await sut.execute({
      questionId: createdQuestion.id.toString(),
      authorId: createdQuestion.authorId.toString(),
      content: 'comment content',
    });

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
    if (result.isRight()) {
      expect(result.value.questionComment.id).toBeDefined();
      expect(result.value.questionComment.questionId).toEqual(createdQuestion.id);
      expect(result.value.questionComment.authorId).toEqual(createdQuestion.authorId);
      expect(result.value.questionComment.content).toEqual('comment content');
    }
  });

  it('should throw an error if question is not found', async () => {
    const result = await sut.execute({
      questionId: 'question-id',
      authorId: 'author-id',
      content: 'comment content',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
