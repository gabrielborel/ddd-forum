import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

type StudentProps = {
  name: string;
};

export class Student extends Entity<StudentProps> {
  static create(props: StudentProps, id?: UniqueEntityID): Student {
    const student = new Student(props, id);
    return student;
  }

  get name(): string {
    return this.props.name;
  }
}
