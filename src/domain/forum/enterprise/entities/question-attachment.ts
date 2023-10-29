import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

type QuestionAttachmentProps = {
  questionId: string;
  attachmentId: string;
};

export class QuestionAttachment extends Entity<QuestionAttachmentProps> {
  static create(props: QuestionAttachmentProps, id?: UniqueEntityID): QuestionAttachment {
    const questionAttachment = new QuestionAttachment(props, id);
    return questionAttachment;
  }

  get questionId(): string {
    return this.props.questionId;
  }

  get attachmentId(): string {
    return this.props.attachmentId;
  }
}
