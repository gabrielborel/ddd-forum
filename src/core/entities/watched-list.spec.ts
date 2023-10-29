import { WatchedList } from './watched-list';

class NumberWatchedList extends WatchedList<number> {
  compareItems(a: number, b: number): boolean {
    return a === b;
  }
}

describe('Watched List', () => {
  it('should create a watched list with initial items', () => {
    const list = new NumberWatchedList([1, 2, 3]);

    expect(list.getItems()).toEqual([1, 2, 3]);
    expect(list.currentItems).toEqual([1, 2, 3]);
  });

  it('should add an item to the list', () => {
    const list = new NumberWatchedList([1, 2, 3]);

    list.add(4);

    expect(list.getItems()).toEqual([1, 2, 3, 4]);
    expect(list.currentItems).toEqual([1, 2, 3, 4]);
    expect(list.getNewItems()).toEqual([4]);
  });

  it('should remove an item from the list', () => {
    const list = new NumberWatchedList([1, 2, 3]);

    list.remove(2);

    expect(list.getItems()).toEqual([1, 3]);
    expect(list.currentItems).toEqual([1, 3]);
    expect(list.getRemovedItems()).toEqual([2]);
  });

  it('should be able to add an item that was removed', () => {
    const list = new NumberWatchedList([1, 2, 3]);

    list.remove(2);
    list.add(2);

    expect(list.getItems()).toEqual([1, 3, 2]);
    expect(list.currentItems).toEqual([1, 3, 2]);
    expect(list.getRemovedItems()).toEqual([]);
    expect(list.getNewItems()).toEqual([]);
  });

  it('should be able to remove an item that was added', () => {
    const list = new NumberWatchedList([1, 2, 3]);

    list.add(4);
    list.remove(4);

    expect(list.getItems()).toEqual([1, 2, 3]);
    expect(list.currentItems).toEqual([1, 2, 3]);
    expect(list.getRemovedItems()).toEqual([]);
    expect(list.getNewItems()).toEqual([]);
  });

  it('should be able to update watched list items', () => {
    const list = new NumberWatchedList([1, 2, 3]);

    list.update([1, 3, 4]);

    expect(list.getItems()).toEqual([1, 3, 4]);
    expect(list.currentItems).toEqual([1, 3, 4]);
    expect(list.getRemovedItems()).toEqual([2]);
    expect(list.getNewItems()).toEqual([4]);
  });
});
