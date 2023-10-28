import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { makeQuestion } from 'test/factories/make-question';
import { makeAnswer } from 'test/factories/make-answer';

let sut: ChooseQuestionBestAnswerUseCase;
let questionsRepository: InMemoryQuestionsRepository;
let answersRepository: InMemoryAnswersRepository;

describe('Choose Question Best Answer Use Case', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository();
    answersRepository = new InMemoryAnswersRepository();
    sut = new ChooseQuestionBestAnswerUseCase(
      answersRepository,
      questionsRepository
    );
  });

  it('should choose the best answer for a question', async () => {
    const createdQuestion = makeQuestion();
    await questionsRepository.create(createdQuestion);

    const answer = makeAnswer({ questionId: createdQuestion.id });
    await answersRepository.create(answer);

    const { question } = await sut.execute({
      answerId: answer.id.toString(),
      authorId: createdQuestion.authorId.toString(),
    });

    expect(question.bestAnswerId).toEqual(answer.id);
  });

  it('should throw an error if the question does not exist', async () => {
    const answer = makeAnswer();
    await answersRepository.create(answer);

    const promise = sut.execute({
      answerId: answer.id.toString(),
      authorId: 'any_author_id',
    });

    await expect(promise).rejects.toThrow('Question not found');
  });

  it('should throw an error if the answer does not exist', async () => {
    const question = makeQuestion();
    await questionsRepository.create(question);

    const promise = sut.execute({
      answerId: 'any_answer_id',
      authorId: question.authorId.toString(),
    });

    await expect(promise).rejects.toThrow('Answer not found');
  });

  it('should throw an error if the user is not the author of the question', async () => {
    const question = makeQuestion();
    await questionsRepository.create(question);

    const answer = makeAnswer({ questionId: question.id });
    await answersRepository.create(answer);

    const promise = sut.execute({
      answerId: answer.id.toString(),
      authorId: 'any_author_id',
    });

    await expect(promise).rejects.toThrow(
      'Only the author of the question can choose the best answer'
    );
  });
});
