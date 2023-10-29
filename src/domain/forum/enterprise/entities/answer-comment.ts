import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { Comment, CommentProps } from './comment';

export type AnswerCommentProps = CommentProps & {
  answerId: UniqueEntityID;
};

export class AnswerComment extends Comment<AnswerCommentProps> {
  get answerId(): UniqueEntityID {
    return this.props.answerId;
  }

  static create(props: Optional<AnswerCommentProps, 'createdAt'>, id?: UniqueEntityID): AnswerComment {
    const answerComment = new AnswerComment(
      {
        ...props,
        createdAt: new Date(),
      },
      id
    );
    return answerComment;
  }
}
