import { randomUUID } from 'crypto';

export class UniqueEntityID {
  private readonly value: string;

  constructor(id?: string) {
    this.value = id ?? randomUUID();
  }

  toString(): string {
    return this.value;
  }

  toValue(): string {
    return this.value;
  }
}
