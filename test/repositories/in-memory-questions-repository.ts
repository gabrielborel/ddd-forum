import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { InMemoryQuestionAttachmentsRepository } from './in-memory-question-attachments-repository';
import { DomainEvents } from '@/core/events/domain-events';

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = [];

  constructor(
    private readonly inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
  ) {}

  async findBySlug(slug: string): Promise<Question | null> {
    const question = this.items.find((question) => question.slug.value === slug);
    return question ?? null;
  }

  async findById(id: string): Promise<Question | null> {
    const question = this.items.find((question) => question.id.toString() === id);
    return question ?? null;
  }

  async findManyRecent(params: PaginationParams): Promise<Question[]> {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((params.page - 1) * 20, params.page * 20);
    return questions;
  }

  async create(question: Question): Promise<void> {
    this.items.push(question);
    DomainEvents.dispatchEventsForAggregate(question.id);
    return Promise.resolve();
  }

  async save(question: Question): Promise<void> {
    const index = this.items.findIndex((item) => item.id.toString() === question.id.toString());
    this.items[index] = question;
    DomainEvents.dispatchEventsForAggregate(question.id);
    return Promise.resolve();
  }

  async delete(question: Question): Promise<void> {
    const index = this.items.findIndex((item) => item.id.toString() === question.id.toString());
    this.items.splice(index, 1);
    await this.inMemoryQuestionAttachmentsRepository.deleteManyByQuestionId(question.id.toString());
    return Promise.resolve();
  }
}
