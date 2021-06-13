import sinon from 'sinon';
import {
  sorts,
  sortProperties,
  activePropertiesSortFilter
} from './propertiesSorting.js';

type Property = {
  name?: string;
  city?: string;
  lastInspectionDate?: number;
};

// Compare array map by value as string
const toCompare = (arr: Array<Property>, attr = 'name'): string =>
  arr
    .map((obj) => obj[attr])
    .join(' | ')
    .toLowerCase();

describe('Spec | Common | Utils | Properties Sorting', () => {
  afterEach(() => sinon.restore());

  test('it sorts property names in ascending order', () => {
    const expected = 'aaa | bbb | zzz';
    const properties = [{ name: 'Zzz' }, { name: 'BbB' }, { name: 'aAa' }];
    const result = properties.sort(sortProperties('name', 'asc'));
    const actual = toCompare(result);
    expect(actual).toEqual(expected);
  });

  test('it sorts property names in descending order', () => {
    const expected = 'zzz | bbb | aaa';
    const properties = [{ name: 'Zzz' }, { name: 'aAa' }, { name: 'BbB' }];
    const result = properties.sort(sortProperties('name', 'desc'));
    const actual = toCompare(result);
    expect(actual).toEqual(expected);
  });

  test('it sorts property cities in ascending order', () => {
    const expected = 'acapuco | bermuda | cape cod | washington dc | zanzibar';
    const properties = [
      { city: 'Bermuda' },
      { city: 'Acapuco' },
      { city: 'Zanzibar' },
      { city: 'Cape Cod' },
      { city: 'Washington DC' }
    ];
    const result = properties.sort(sortProperties('city', 'asc'));
    const actual = toCompare(result, 'city');
    expect(actual).toEqual(expected);
  });

  test('it sorts property last inspection date in ascending order', () => {
    const expected = '1 | 2 | 3';
    const properties = [
      { lastInspectionDate: 3 },
      { lastInspectionDate: 1 },
      { lastInspectionDate: 2 }
    ];
    const result = properties.sort(sortProperties('lastInspectionDate', 'asc'));
    const actual = toCompare(result, 'lastInspectionDate');
    expect(actual).toEqual(expected);
  });

  test('it sorts property last inspection date in descending order', () => {
    const expected = '3 | 2 | 1';
    const properties = [
      { lastInspectionDate: 3 },
      { lastInspectionDate: 1 },
      { lastInspectionDate: 2 }
    ];
    const result = properties.sort(
      sortProperties('lastInspectionDate', 'desc')
    );
    const actual = toCompare(result, 'lastInspectionDate');
    expect(actual).toEqual(expected);
  });

  test('should provide a user friendly names to all sort options', () => {
    const expected = 'Name | City | State | Last Entry Date | Last Entry Score';
    const actual = sorts.map(activePropertiesSortFilter).join(' | ');
    expect(actual).toEqual(expected);
  });
});
