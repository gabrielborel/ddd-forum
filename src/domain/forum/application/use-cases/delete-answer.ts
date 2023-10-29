import { AnswersRepository } from '../repositories/answers-repository';

type DeleteAnswerUseCaseInput = {
  authorId: string;
  answerId: string;
};

type DeleteAnswerUseCaseOutput = void;

export class DeleteAnswerUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute(input: DeleteAnswerUseCaseInput): Promise<DeleteAnswerUseCaseOutput> {
    const answer = await this.answersRepository.findById(input.answerId);
    if (!answer) {
      throw new Error('Answer not found');
    }

    if (answer.authorId.toString() !== input.authorId) {
      throw new Error('Only the author can delete the answer');
    }

    await this.answersRepository.delete(answer);
  }
}
