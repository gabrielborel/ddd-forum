import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { QuestionsRepository } from '../repositories/questions-repository';

type CreateQuestionUseCaseInput = {
  authorId: string;
  title: string;
  content: string;
};

type CreateQuestionUseCaseOutput = {
  question: Question;
};

export class CreateQuestionUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute(input: CreateQuestionUseCaseInput): Promise<CreateQuestionUseCaseOutput> {
    const { content, authorId, title } = input;

    const question = Question.create({
      content,
      authorId: new UniqueEntityID(authorId),
      title,
    });

    await this.questionsRepository.create(question);

    return { question };
  }
}
