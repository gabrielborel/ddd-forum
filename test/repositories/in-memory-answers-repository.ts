import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { InMemoryAnswerAttachmentsRepository } from './in-memory-answer-attachments-repository';

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = [];

  constructor(private readonly answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository) {}

  async findById(id: string): Promise<Answer | null> {
    const answer = this.items.find((answer) => answer.id.toString() === id);
    return answer ?? null;
  }

  async findManyByQuestionId(questionId: string, params: PaginationParams): Promise<Answer[]> {
    const answers = this.items
      .filter((answer) => answer.questionId.toString() === questionId)
      .slice((params.page - 1) * 20, params.page * 20);
    return answers;
  }

  async create(answer: Answer): Promise<void> {
    this.items.push(answer);
    return Promise.resolve();
  }

  async save(answer: Answer): Promise<void> {
    const index = this.items.findIndex((item) => item.id.toString() === answer.id.toString());
    this.items[index] = answer;
    return Promise.resolve();
  }

  async delete(answer: Answer): Promise<void> {
    const index = this.items.findIndex((item) => item.id.toString() === answer.id.toString());
    this.items.splice(index, 1);
    await this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString());
    return Promise.resolve();
  }
}
