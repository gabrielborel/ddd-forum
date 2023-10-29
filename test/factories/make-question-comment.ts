import { faker } from '@faker-js/faker';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { QuestionComment, QuestionCommentProps } from '@/domain/forum/enterprise/entities/question-comment';

export function makeQuestionComment(
  override: Partial<QuestionCommentProps> = {},
  id?: UniqueEntityID
): QuestionComment {
  const question = QuestionComment.create(
    {
      content: faker.lorem.text(),
      authorId: new UniqueEntityID(),
      questionId: new UniqueEntityID(),
      ...override,
    },
    id
  );
  return question;
}
