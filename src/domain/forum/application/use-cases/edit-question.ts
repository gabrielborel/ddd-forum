import { Either, left, right } from '@/core/either';
import { Question } from '../../enterprise/entities/question';
import { QuestionsRepository } from '../repositories/questions-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { NotAllowedError } from './errors/not-allowed-error';
import { QuestionAttachmentsRepository } from '../repositories/question-attachments-repository';
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { QuestionAttachment } from '../../enterprise/entities/question-attachment';

type EditQuestionUseCaseInput = {
  authorId: string;
  questionId: string;
  title: string;
  content: string;
  attachmentsIds: string[];
};

type EditQuestionUseCaseOutput = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question;
  }
>;

export class EditQuestionUseCase {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly questionAttachmentsRepository: QuestionAttachmentsRepository
  ) {}

  async execute(input: EditQuestionUseCaseInput): Promise<EditQuestionUseCaseOutput> {
    const question = await this.questionsRepository.findById(input.questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (question.authorId.toString() !== input.authorId) {
      return left(new NotAllowedError());
    }

    const currentQuestionAttachments =
      await this.questionAttachmentsRepository.findManyByQuestionId(input.questionId);
    const questionAttachmentList = new QuestionAttachmentList(currentQuestionAttachments);

    const newQuestionAttachments = input.attachmentsIds.map((attachmentId) =>
      QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        questionId: question.id,
      })
    );

    questionAttachmentList.update(newQuestionAttachments);

    question.title = input.title;
    question.content = input.content;
    question.attachments = questionAttachmentList;

    await this.questionsRepository.save(question);

    return right({ question });
  }
}
