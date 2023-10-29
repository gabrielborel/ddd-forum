import { Either, left, right } from './either';

const doSometing = (shouldSuccess: boolean): Either<string, number> => {
  if (shouldSuccess) {
    return right(10);
  } else {
    return left('error');
  }
};

describe('Either', () => {
  test('success result', () => {
    const sucessResult = doSometing(true);
    expect(sucessResult.isRight()).toBe(true);
    expect(sucessResult.isLeft()).toBe(false);
  });

  test('error result', () => {
    const errorResult = doSometing(false);
    expect(errorResult.isRight()).toBe(false);
    expect(errorResult.isLeft()).toBe(true);
  });
});
