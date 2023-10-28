import { test, expect } from 'vitest';
import { Slug } from './slug';

test('should be able to create a new slug from text', () => {
  const slugOne = Slug.createFromText('A string');
  expect(slugOne.value).toBe('a-string');

  const slugTwo = Slug.createFromText('A string with spaces');
  expect(slugTwo.value).toBe('a-string-with-spaces');

  const slugThree = Slug.createFromText('A string with spaces and symbols!');
  expect(slugThree.value).toBe('a-string-with-spaces-and-symbols');
});
