import { renderHook } from '@testing-library/react-hooks';
import useSorting, {
  SORTS,
  sortProperties,
  toUserFacingActiveSort
} from './useSorting';
import mockProperties from '../../../__mocks__/properties';
import deepClone from '../../../__tests__/helpers/deepClone';
import { shuffle } from '../../../__tests__/helpers/array';
import propertyModel from '../../models/property';

describe('Unit | Common | Hooks | Properties | Use Sorting', () => {
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
    ].map(
      (propertyConfig, i) =>
        ({ id: `prop-${i}`, ...propertyConfig } as propertyModel)
    );
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
    ].map(
      (propertyConfig, i) =>
        ({ id: `prop-${i}`, ...propertyConfig } as propertyModel)
    );
    const result = properties.sort(sortProperties('lastInspectionDate', 'asc'));
    const actual = toCompare(result, 'lastInspectionDate');
    expect(actual).toEqual(expected);
  });

  test('it sorts property last inspection date in ascending order', () => {
    const expected = '1 | 2 | 3';
    const properties = [
      { lastInspectionDate: 3 },
      { lastInspectionDate: 1 },
      { lastInspectionDate: 2 }
    ].map(
      (propertyConfig, i) =>
        ({ id: `prop-${i}`, ...propertyConfig } as propertyModel)
    );
    const result = properties.sort(sortProperties('lastInspectionDate', 'asc'));
    const actual = toCompare(result, 'lastInspectionDate');
    expect(actual).toEqual(expected);
  });

  test('sort last inspection date as 0 when it is missing', () => {
    const timestamps = [null, 1625244316, 1625244315, 1625244314, 1625244313];
    const expected = 'Last Property';
    const properties = shuffle(
      deepClone(mockProperties)
        .slice(0, timestamps.length)
        .filter(Boolean)
        .map((property, i) => {
          const timestamp = timestamps[i];

          if (timestamp) {
            property.lastInspectionDate = timestamp;
          } else {
            delete property.lastInspectionDate;
            property.name = expected;
          }

          return property;
        })
    );

    const result = properties.sort(
      sortProperties('lastInspectionDate', 'desc')
    );
    const actual = result[result.length - 1].name;
    expect(actual).toEqual(expected);
  });

  test('sort last inspection score as 0 when it is missing', () => {
    const scores = [null, 99, 84, 2, 3];
    const expected = 'First Property';
    const properties = shuffle(
      deepClone(mockProperties)
        .slice(0, scores.length)
        .filter(Boolean)
        .map((property, i) => {
          const score = scores[i];

          if (score) {
            property.lastInspectionScore = score;
          } else {
            delete property.lastInspectionScore;
            property.name = expected;
          }

          return property;
        })
    );

    const result = properties.sort(
      sortProperties('lastInspectionScore', 'asc')
    );
    const actual = result[0].name;
    expect(actual).toEqual(expected);
  });

  test('next properties sort should automatically sort last inspection date in descending order', () => {
    const expected = '4 | 3 | 2 | 1';
    const timestamps = [4, 3, 1, 2];
    const properties = shuffle(
      deepClone(mockProperties)
        .slice(0, timestamps.length)
        .filter(Boolean)
        .map((property, i) => {
          const timestamp = timestamps[i];
          property.lastInspectionDate = timestamp;
          return property;
        })
    );

    let result = [];
    let notSorted = true;
    renderHook(() => {
      const { sortBy, sortedProperties, nextPropertiesSort } = useSorting(
        properties,
        ''
      );

      if (notSorted) {
        nextPropertiesSort('lastInspectionDate');
        notSorted = false;
      }

      if (sortBy === 'lastInspectionDate') {
        result = sortedProperties;
      }
    });

    const actual = toCompare(result, 'lastInspectionDate');
    expect(actual).toEqual(expected);
  });

  test('next properties sort should automatically sort last inspection score in descending order', async () => {
    const expected = '4 | 3 | 2 | 1';
    const timestamps = [4, 3, 1, 2];
    const properties = shuffle(
      deepClone(mockProperties)
        .slice(0, timestamps.length)
        .filter(Boolean)
        .map((property, i) => {
          const timestamp = timestamps[i];
          property.lastInspectionScore = timestamp;
          return property;
        })
    );

    let result = [];
    let notSorted = true;
    renderHook(() => {
      const { sortBy, sortedProperties, nextPropertiesSort } = useSorting(
        properties,
        ''
      );

      if (notSorted) {
        nextPropertiesSort('lastInspectionScore');
        notSorted = false;
      }

      if (sortBy === 'lastInspectionScore') {
        result = sortedProperties;
      }
    });

    const actual = toCompare(result, 'lastInspectionScore');
    expect(actual).toEqual(expected);
  });

  test('should provide user friendly names to all sort options', () => {
    const expected = 'Name | City | State | Last Entry Date | Last Entry Score';
    const actual = SORTS.map(toUserFacingActiveSort).join(' | ');
    expect(actual).toEqual(expected);
  });
});

// Compare array map by value as string
function toCompare(arr: propertyModel[], attr = 'name'): string {
  return arr
    .map((obj) => obj[attr])
    .join(' | ')
    .toLowerCase();
}
