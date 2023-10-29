import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

type QuestionAttachmentProps = {
  questionId: UniqueEntityID;
  attachmentId: UniqueEntityID;
};

export class QuestionAttachment extends Entity<QuestionAttachmentProps> {
  static create(props: QuestionAttachmentProps, id?: UniqueEntityID): QuestionAttachment {
    const questionAttachment = new QuestionAttachment(props, id);
    return questionAttachment;
  }

  get questionId(): UniqueEntityID {
    return this.props.questionId;
  }

  get attachmentId(): UniqueEntityID {
    return this.props.attachmentId;
  }
}
