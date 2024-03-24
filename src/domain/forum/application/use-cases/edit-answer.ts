import { Either, left, right } from '@/core/either';
import { Answer } from '../../enterprise/entities/answer';
import { AnswersRepository } from '../repositories/answers-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { NotAllowedError } from './errors/not-allowed-error';
import { AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository';
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list';
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

type EditAnswerUseCaseInput = {
  authorId: string;
  answerId: string;
  content: string;
  attachmentsIds: string[];
};

type EditAnswerUseCaseOutput = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer;
  }
>;

export class EditAnswerUseCase {
  constructor(
    private readonly answersRepository: AnswersRepository,
    private readonly answerAttachmentsRepository: AnswerAttachmentsRepository
  ) {}

  async execute(input: EditAnswerUseCaseInput): Promise<EditAnswerUseCaseOutput> {
    const answer = await this.answersRepository.findById(input.answerId);
    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    if (answer.authorId.toString() !== input.authorId) {
      return left(new NotAllowedError());
    }

    const currentAnswerAttachments = await this.answerAttachmentsRepository.findManyByAnswerId(
      input.answerId
    );
    const answerAttachmentList = new AnswerAttachmentList(currentAnswerAttachments);

    const newAnswerAttachments = input.attachmentsIds.map((attachmentId) =>
      AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        answerId: answer.id,
      })
    );

    answerAttachmentList.update(newAnswerAttachments);

    answer.content = input.content;
    answer.attachments = answerAttachmentList;
    await this.answersRepository.save(answer);

    return right({ answer });
  }
}
