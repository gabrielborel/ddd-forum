import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export type AnswerAttachmentProps = {
  answerId: UniqueEntityID;
  attachmentId: UniqueEntityID;
};

export class AnswerAttachment extends Entity<AnswerAttachmentProps> {
  static create(props: AnswerAttachmentProps, id?: UniqueEntityID): AnswerAttachment {
    const answerAttachment = new AnswerAttachment(props, id);
    return answerAttachment;
  }

  get answerId(): UniqueEntityID {
    return this.props.answerId;
  }

  get attachmentId(): UniqueEntityID {
    return this.props.attachmentId;
  }
}
