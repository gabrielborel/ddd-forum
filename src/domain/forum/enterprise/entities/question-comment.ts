import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { Comment, CommentProps } from './comment';

export type QuestionCommentProps = CommentProps & {
  questionId: UniqueEntityID;
};

export class QuestionComment extends Comment<QuestionCommentProps> {
  get questionId(): UniqueEntityID {
    return this.props.questionId;
  }

  static create(
    props: Optional<QuestionCommentProps, 'createdAt'>,
    id?: UniqueEntityID
  ): QuestionComment {
    const questionComment = new QuestionComment(
      {
        ...props,
        createdAt: new Date(),
      },
      id
    );
    return questionComment;
  }
}
