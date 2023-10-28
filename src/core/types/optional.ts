/**
 * Make some property optional on selected type
 *
 * @example
 * ```typescript
 * type Student = {
 *  name: string;
 *  age: number;
 * };
 *
 * type StudentWithOptionalAge = Optional<Student, 'age'>;
 * ```
 */

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
