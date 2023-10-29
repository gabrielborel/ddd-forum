import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import { Question } from '../../enterprise/entities/question';
import { QuestionsRepository } from '../repositories/questions-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { NotAllowedError } from './errors/not-allowed-error';

type ChooseQuestionBestAnswerUseCaseInput = {
  authorId: string;
  answerId: string;
};

type ChooseQuestionBestAnswerUseCaseOutput = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question;
  }
>;

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private readonly answersRepository: AnswersRepository,
    private readonly questionsRepository: QuestionsRepository
  ) {}

  async execute(input: ChooseQuestionBestAnswerUseCaseInput): Promise<ChooseQuestionBestAnswerUseCaseOutput> {
    const { answerId } = input;

    const answer = await this.answersRepository.findById(answerId);
    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    const question = await this.questionsRepository.findById(answer.questionId.toString());
    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (question.authorId.toString() !== input.authorId) {
      return left(new NotAllowedError());
    }

    question.bestAnswerId = answer.id;
    await this.questionsRepository.save(question);

    return right({ question });
  }
}
