import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export type CommentProps = {
  authorId: UniqueEntityID;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
};

export abstract class Comment<
  Props extends CommentProps
> extends Entity<Props> {
  get content(): string {
    return this.props.content;
  }

  get authorId(): UniqueEntityID {
    return this.props.authorId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  set content(content: string) {
    this.props.content = content;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
