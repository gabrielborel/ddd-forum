import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { QuestionsRepository } from '../repositories/questions-repository';
import { Either, right } from '@/core/either';
import { QuestionAttachment } from '../../enterprise/entities/question-attachment';

type CreateQuestionUseCaseInput = {
  authorId: string;
  title: string;
  content: string;
  attachmentsIds?: string[];
};

type CreateQuestionUseCaseOutput = Either<
  null,
  {
    question: Question;
  }
>;

export class CreateQuestionUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute(input: CreateQuestionUseCaseInput): Promise<CreateQuestionUseCaseOutput> {
    const { content, authorId, title, attachmentsIds } = input;

    const question = Question.create({
      content,
      authorId: new UniqueEntityID(authorId),
      title,
    });

    const questionAttachments = attachmentsIds?.map((attachmentId) =>
      QuestionAttachment.create({ attachmentId: new UniqueEntityID(attachmentId), questionId: question.id })
    );
    question.attachments = questionAttachments ?? [];

    await this.questionsRepository.create(question);

    return right({ question });
  }
}
