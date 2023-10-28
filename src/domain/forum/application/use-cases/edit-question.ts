import { Question } from '../../enterprise/entities/question';
import { QuestionsRepository } from '../repositories/questions-repository';

type EditQuestionUseCaseInput = {
  authorId: string;
  questionId: string;
  title: string;
  content: string;
};

type EditQuestionUseCaseOutput = {
  question: Question;
};

export class EditQuestionUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute(
    input: EditQuestionUseCaseInput
  ): Promise<EditQuestionUseCaseOutput> {
    const question = await this.questionsRepository.findById(input.questionId);
    if (!question) {
      throw new Error('Question not found');
    }

    if (question.authorId.toString() !== input.authorId) {
      throw new Error('Only the author can edit the question');
    }

    question.title = input.title;
    question.content = input.content;

    await this.questionsRepository.save(question);

    return { question };
  }
}
