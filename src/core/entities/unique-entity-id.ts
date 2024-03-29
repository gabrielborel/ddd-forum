import { randomUUID } from 'crypto';

export class UniqueEntityID {
  private readonly value: string;

  public constructor(id?: string) {
    this.value = id ?? randomUUID();
  }

  public toString(): string {
    return this.value;
  }

  public toValue(): string {
    return this.value;
  }

  public equals(id: UniqueEntityID): boolean {
    return id.toValue() === this.value;
  }
}
