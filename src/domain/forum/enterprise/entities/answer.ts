import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { AnswerAttachmentList } from './answer-attachment-list';

export type AnswerProps = {
  authorId: UniqueEntityID;
  questionId: UniqueEntityID;
  content: string;
  attachments: AnswerAttachmentList;
  createdAt: Date;
  updatedAt?: Date;
};

export class Answer extends Entity<AnswerProps> {
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
