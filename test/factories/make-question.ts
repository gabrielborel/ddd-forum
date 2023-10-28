import { faker } from '@faker-js/faker';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Question,
  QuestionProps,
} from '@/domain/forum/enterprise/entities/question';

export function makeQuestion(
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityID
): Question {
  const question = Question.create(
    {
      title: faker.lorem.sentence({ min: 1, max: 3 }),
      content: faker.lorem.text(),
      authorId: new UniqueEntityID(),
      ...override,
    },
    id
  );
  return question;
}
