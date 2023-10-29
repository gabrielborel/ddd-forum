import { AggregateRoot } from '@/core/entities/aggregate-root';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { Slug } from './value-objects/slug';
import { QuestionAttachment } from './question-attachment';

export type QuestionProps = {
  authorId: UniqueEntityID;
  bestAnswerId?: UniqueEntityID;
  attachments: QuestionAttachment[];
  title: string;
  slug: Slug;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
};

export class Question extends AggregateRoot<QuestionProps> {
  static create(props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>, id?: UniqueEntityID): Question {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        createdAt: props.createdAt ?? new Date(),
        attachments: props.attachments ?? [],
      },
      id
    );
    return question;
  }

  get title(): string {
    return this.props.title;
  }

  get content(): string {
    return this.props.content;
  }

  get authorId(): UniqueEntityID {
    return this.props.authorId;
  }

  get slug(): Slug {
    return this.props.slug;
  }

  get bestAnswerId(): UniqueEntityID | undefined {
    return this.props.bestAnswerId;
  }

  get attachments(): QuestionAttachment[] {
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

  get isNew(): boolean {
    const now = new Date();
    const diff = now.getTime() - this.createdAt.getTime();
    const diffInDays = diff / (1000 * 3600 * 24);
    return diffInDays <= 3;
  }

  set title(title: string) {
    this.props.title = title;
    this.props.slug = Slug.createFromText(title);
    this.touch();
  }

  set content(content: string) {
    this.props.content = content;
    this.touch();
  }

  set bestAnswerId(id: UniqueEntityID) {
    this.props.bestAnswerId = id;
    this.touch();
  }

  set attachments(attachments: QuestionAttachment[]) {
    this.props.attachments = attachments;
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
