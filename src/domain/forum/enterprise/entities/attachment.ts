import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export type AttachmentProps = {
  title: string;
  link: string;
};

export class Attachment extends Entity<AttachmentProps> {
  static create(props: AttachmentProps, id?: UniqueEntityID): Attachment {
    const attachment = new Attachment(props, id);
    return attachment;
  }

  get title(): string {
    return this.props.title;
  }

  get link(): string {
    return this.props.link;
  }
}
