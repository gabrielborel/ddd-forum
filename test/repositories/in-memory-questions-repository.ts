import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { Question } from '@/domain/forum/enterprise/entities/question';

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = [];

  async findBySlug(slug: string): Promise<Question | null> {
    const question = this.items.find(
      (question) => question.slug.value === slug
    );
    return question ?? null;
  }

  async findById(id: string): Promise<Question | null> {
    const question = this.items.find(
      (question) => question.id.toString() === id
    );
    return question ?? null;
  }

  async create(question: Question): Promise<void> {
    this.items.push(question);
    return Promise.resolve();
  }

  async save(question: Question): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === question.id.toString()
    );
    this.items[index] = question;
    return Promise.resolve();
  }

  async delete(question: Question): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === question.id.toString()
    );
    this.items.splice(index, 1);
    return Promise.resolve();
  }
}
