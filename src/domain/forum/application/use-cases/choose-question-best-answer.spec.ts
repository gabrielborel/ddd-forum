import { makeAnswer } from 'test/factories/make-answer';
import { makeQuestion } from 'test/factories/make-question';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { NotAllowedError } from './errors/not-allowed-error';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';

let sut: ChooseQuestionBestAnswerUseCase;
let questionsRepository: InMemoryQuestionsRepository;
let answersRepository: InMemoryAnswersRepository;
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;

describe('Choose Question Best Answer Use Case', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
    questionsRepository = new InMemoryQuestionsRepository(questionAttachmentsRepository);
    answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository);
    sut = new ChooseQuestionBestAnswerUseCase(answersRepository, questionsRepository);
  });

  it('should choose the best answer for a question', async () => {
    const createdQuestion = makeQuestion();
    await questionsRepository.create(createdQuestion);

    const answer = makeAnswer({ questionId: createdQuestion.id });
    await answersRepository.create(answer);

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: createdQuestion.authorId.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
    if (result.isRight()) {
      expect(result.value.question.bestAnswerId).toEqual(answer.id);
    }
  });

  it('should throw an error if the question does not exist', async () => {
    const answer = makeAnswer();
    await answersRepository.create(answer);

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: 'any_author_id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should throw an error if the answer does not exist', async () => {
    const question = makeQuestion();
    await questionsRepository.create(question);

    const result = await sut.execute({
      answerId: 'any_answer_id',
      authorId: question.authorId.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should throw an error if the user is not the author of the question', async () => {
    const question = makeQuestion();
    await questionsRepository.create(question);

    const answer = makeAnswer({ questionId: question.id });
    await answersRepository.create(answer);

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: 'any_author_id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
