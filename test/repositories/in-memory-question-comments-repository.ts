import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';

export class InMemoryQuestionCommentsRepository implements QuestionCommentsRepository {
  public items: QuestionComment[] = [];

  async findById(id: string): Promise<QuestionComment | null> {
    const questionComment = this.items.find((item) => item.id.toString() === id);
    return Promise.resolve(questionComment ?? null);
  }

  async create(questionComment: QuestionComment): Promise<void> {
    this.items.push(questionComment);
    return Promise.resolve();
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    const index = this.items.findIndex((item) => item.id.toString() === questionComment.id.toString());
    this.items.splice(index, 1);
    return Promise.resolve();
  }
}
