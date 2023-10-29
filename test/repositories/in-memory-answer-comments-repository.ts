import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';

export class InMemoryAnswerCommentsRepository implements AnswerCommentsRepository {
  public items: AnswerComment[] = [];

  async findById(id: string): Promise<AnswerComment | null> {
    const answerComment = this.items.find((item) => item.id.toString() === id);
    return Promise.resolve(answerComment ?? null);
  }

  async create(answerComment: AnswerComment): Promise<void> {
    this.items.push(answerComment);
    return Promise.resolve();
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    const index = this.items.findIndex((item) => item.id.toString() === answerComment.id.toString());
    this.items.splice(index, 1);
    return Promise.resolve();
  }
}
