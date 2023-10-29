import { Either, left, right } from '@/core/either';
import { Question } from '../../enterprise/entities/question';
import { QuestionsRepository } from '../repositories/questions-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { NotAllowedError } from './errors/not-allowed-error';

type EditQuestionUseCaseInput = {
  authorId: string;
  questionId: string;
  title: string;
  content: string;
};

type EditQuestionUseCaseOutput = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question;
  }
>;

export class EditQuestionUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute(input: EditQuestionUseCaseInput): Promise<EditQuestionUseCaseOutput> {
    const question = await this.questionsRepository.findById(input.questionId);
    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (question.authorId.toString() !== input.authorId) {
      return left(new NotAllowedError());
    }

    question.title = input.title;
    question.content = input.content;

    await this.questionsRepository.save(question);

    return right({ question });
  }
}
