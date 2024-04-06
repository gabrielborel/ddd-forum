import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { AnswerAttachmentList } from './answer-attachment-list';
import { AggregateRoot } from '@/core/entities/aggregate-root';
import { AnswerCreatedEvent } from '../events/answer-created';

export type AnswerProps = {
  authorId: UniqueEntityID;
  questionId: UniqueEntityID;
  content: string;
  attachments: AnswerAttachmentList;
  createdAt: Date;
  updatedAt?: Date;
};

export class Answer extends AggregateRoot<AnswerProps> {
  static create(
    props: Optional<AnswerProps, 'createdAt' | 'attachments'>,
    id?: UniqueEntityID
  ): Answer {
    const answer = new Answer(
      {
        ...props,
        attachments: props.attachments ?? new AnswerAttachmentList([]),
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );

    const isNewAnswer = !id;
    if (isNewAnswer) {
      answer.addDomainEvent(new AnswerCreatedEvent(answer));
    }

    return answer;
  }

  get content(): string {
    return this.props.content;
  }

  get authorId(): UniqueEntityID {
    return this.props.authorId;
  }

  get questionId(): UniqueEntityID {
    return this.props.questionId;
  }

  get attachments(): AnswerAttachmentList {
    return this.props.attachments;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  get excerpt(): string {
    return this.content.substring(0, 120).trimEnd().concat('...');
  }

  set content(content: string) {
    this.props.content = content;
    this.touch();
  }

  set attachments(attachments: AnswerAttachmentList) {
    this.props.attachments = attachments;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
