import { sortWorkOrders, toUserFacingActiveSort } from './useSorting';
import { shuffle } from '../../../__tests__/helpers/array';
import workOrderModel from '../../../common/models/yardi/workOrder';

describe('Unit | Common | Hooks | Property Work Orders | Use Sorting', () => {
  test('it sorts by creation date in ascending order', () => {
    const expected = '1 | 2 | 3';
    const workOrders = shuffle([
      { createdAt: 3, updatedAt: 3 },
      { createdAt: 1, updatedAt: 4 },
      { createdAt: 2, updatedAt: 5 }
    ]);
    const result = workOrders.sort(sortWorkOrders('createdAt', 'asc'));
    const actual = toCompare(result);
    expect(actual).toEqual(expected);
  });

  test('it sorts by creation date in descending order', () => {
    const expected = '3 | 2 | 1';
    const workOrders = shuffle([
      { createdAt: 3, updatedAt: 3 },
      { createdAt: 1, updatedAt: 4 },
      { createdAt: 2, updatedAt: 5 }
    ]);
    const result = workOrders.sort(sortWorkOrders('createdAt', 'desc'));
    const actual = toCompare(result);
    expect(actual).toEqual(expected);
  });

  test('it sorts by update date in descending order', () => {
    const expected = '5 | 4 | 3';
    const workOrders = shuffle([
      { createdAt: 3, updatedAt: 3 },
      { createdAt: 1, updatedAt: 4 },
      { createdAt: 2, updatedAt: 5 }
    ]);
    const result = workOrders.sort(sortWorkOrders('updatedAt', 'desc'));
    const actual = toCompare(result, 'updatedAt');
    expect(actual).toEqual(expected);
  });

  test('it generates a user facing sort description', () => {
    const tests = [
      {
        data: 'createdAt:asc',
        expected: 'Creation Date (Oldest)'
      },
      {
        data: 'createdAt:desc',
        expected: 'Creation Date (Newest)'
      },
      {
        data: 'updatedAt:desc',
        expected: 'Last Update'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { data, expected } = tests[i];
      const [sort, dir] = data.split(':');
      const actual = toUserFacingActiveSort(sort, dir);
      const msg = `created description for sort ${sort} & direction: ${dir}`;
      expect(actual, msg).toEqual(expected);
    }
  });
});

// Compare array map by value as string
function toCompare(arr: workOrderModel[], attr = 'createdAt'): string {
  return arr.map((obj) => obj[attr].toString()).join(' | ');
}
