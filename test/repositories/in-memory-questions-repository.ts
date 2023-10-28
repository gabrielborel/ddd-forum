import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { Question } from '@/domain/forum/enterprise/entities/question';

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = [];

  async create(question: Question): Promise<void> {
    this.items.push(question);
    return Promise.resolve();
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = this.items.find(
      (question) => question.slug.value === slug
    );
    return question ?? null;
  }
}
