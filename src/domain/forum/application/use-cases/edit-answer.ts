import { Answer } from '../../enterprise/entities/answer';
import { AnswersRepository } from '../repositories/answers-repository';

type EditAnswerUseCaseInput = {
  authorId: string;
  answerId: string;
  content: string;
};

type EditAnswerUseCaseOutput = {
  answer: Answer;
};

export class EditAnswerUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute(input: EditAnswerUseCaseInput): Promise<EditAnswerUseCaseOutput> {
    const answer = await this.answersRepository.findById(input.answerId);
    if (!answer) {
      throw new Error('Answer not found');
    }

    if (answer.authorId.toString() !== input.authorId) {
      throw new Error('Only the author can edit the answer');
    }

    answer.content = input.content;
    await this.answersRepository.save(answer);

    return { answer };
  }
}
