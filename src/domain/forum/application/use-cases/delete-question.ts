import { QuestionsRepository } from '../repositories/questions-repository';

type DeleteQuestionUseCaseInput = {
  authorId: string;
  questionId: string;
};

type DeleteQuestionUseCaseOutput = void;

export class DeleteQuestionUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute(input: DeleteQuestionUseCaseInput): Promise<DeleteQuestionUseCaseOutput> {
    const question = await this.questionsRepository.findById(input.questionId);
    if (!question) {
      throw new Error('Question not found');
    }

    if (question.authorId.toString() !== input.authorId) {
      throw new Error('Only the author can delete the question');
    }

    await this.questionsRepository.delete(question);
  }
}
