import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import { Question } from '../../enterprise/entities/question';
import { QuestionsRepository } from '../repositories/questions-repository';

type ChooseQuestionBestAnswerUseCaseInput = {
  authorId: string;
  answerId: string;
};

type ChooseQuestionBestAnswerUseCaseOutput = {
  question: Question;
};

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private readonly answersRepository: AnswersRepository,
    private readonly questionsRepository: QuestionsRepository
  ) {}

  async execute(input: ChooseQuestionBestAnswerUseCaseInput): Promise<ChooseQuestionBestAnswerUseCaseOutput> {
    const { answerId } = input;

    const answer = await this.answersRepository.findById(answerId);
    if (!answer) {
      throw new Error('Answer not found');
    }

    const question = await this.questionsRepository.findById(answer.questionId.toString());
    if (!question) {
      throw new Error('Question not found');
    }

    if (question.authorId.toString() !== input.authorId) {
      throw new Error('Only the author of the question can choose the best answer');
    }

    question.bestAnswerId = answer.id;
    await this.questionsRepository.save(question);

    return { question };
  }
}
