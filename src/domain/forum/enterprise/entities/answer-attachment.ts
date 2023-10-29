import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

type AnswerAttachmentProps = {
  answerId: string;
  attachmentId: string;
};

export class AnswerAttachment extends Entity<AnswerAttachmentProps> {
  static create(props: AnswerAttachmentProps, id?: UniqueEntityID): AnswerAttachment {
    const answerAttachment = new AnswerAttachment(props, id);
    return answerAttachment;
  }

  get answerId(): string {
    return this.props.answerId;
  }

  get attachmentId(): string {
    return this.props.attachmentId;
  }
}
