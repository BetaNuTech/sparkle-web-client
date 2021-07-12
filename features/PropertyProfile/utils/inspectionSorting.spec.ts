import sinon from 'sinon';
import { sortInspection } from './inspectionSorting';

type Inspection = {
  creationDate?: number;
  updatedAt?: number;
  score?: number;
  inspectorName?: string;
  templateName?: string;
  templateCategory?: string;
};

// Compare array map by value as string
const toCompare = (arr: Array<Inspection>, attr = 'name'): string =>
  arr
    .map((obj) => obj[attr])
    .join(' | ')
    .toLowerCase();

describe('Spec | Property Profile | Utils | Inspection Sorting', () => {
  afterEach(() => sinon.restore());

  test('it sorts inspection creation date in ascending order', () => {
    const expected = '1620866714 | 1620876714 | 1620952610';
    const inspections = [
      { creationDate: 1620952610 },
      { creationDate: 1620866714 },
      { creationDate: 1620876714 }
    ];
    const result = inspections.sort(sortInspection('creationDate', 'asc'));
    const actual = toCompare(result, 'creationDate');
    expect(actual).toEqual(expected);
  });

  test('it sorts inspection creation date in descending order', () => {
    const expected = '1620952610 | 1620876714 | 1620866714';
    const inspections = [
      { creationDate: 1620952610 },
      { creationDate: 1620866714 },
      { creationDate: 1620876714 }
    ];
    const result = inspections.sort(sortInspection('creationDate', 'desc'));
    const actual = toCompare(result, 'creationDate');
    expect(actual).toEqual(expected);
  });

  test('it sorts inspection updation date in ascending order', () => {
    const expected = '1620866714 | 1620876714 | 1620952610';
    const inspections = [
      { updatedAt: 1620952610 },
      { updatedAt: 1620866714 },
      { updatedAt: 1620876714 }
    ];
    const result = inspections.sort(sortInspection('updatedAt', 'asc'));
    const actual = toCompare(result, 'updatedAt');
    expect(actual).toEqual(expected);
  });

  test('it sorts inspection updation date in descending order', () => {
    const expected = '1620952610 | 1620876714 | 1620866714';
    const inspections = [
      { updatedAt: 1620952610 },
      { updatedAt: 1620866714 },
      { updatedAt: 1620876714 }
    ];
    const result = inspections.sort(sortInspection('updatedAt', 'desc'));
    const actual = toCompare(result, 'updatedAt');
    expect(actual).toEqual(expected);
  });

  test('it sorts inspection score in ascending order', () => {
    const expected = '0 | 91.7 | 100';
    const inspections = [{ score: 0 }, { score: 100 }, { score: 91.7 }];
    const result = inspections.sort(sortInspection('score', 'asc'));
    const actual = toCompare(result, 'score');
    expect(actual).toEqual(expected);
  });

  test('it sorts inspection score in descending order', () => {
    const expected = '100 | 91.7 | 0';
    const inspections = [{ score: 0 }, { score: 100 }, { score: 91.7 }];
    const result = inspections.sort(sortInspection('score', 'desc'));
    const actual = toCompare(result, 'score');
    expect(actual).toEqual(expected);
  });

  test('it sorts inspection inspector name in ascending order', () => {
    const expected = 'john wick | matt jensen | pete andrew';
    const inspections = [
      { inspectorName: 'matt jensen' },
      { inspectorName: 'pete andrew' },
      { inspectorName: 'john wick' }
    ];
    const result = inspections.sort(sortInspection('inspectorName', 'asc'));
    const actual = toCompare(result, 'inspectorName');
    expect(actual).toEqual(expected);
  });

  test('it sorts inspection inspector name in descending order', () => {
    const expected = 'pete andrew | matt jensen | john wick';
    const inspections = [
      { inspectorName: 'matt jensen' },
      { inspectorName: 'pete andrew' },
      { inspectorName: 'john wick' }
    ];
    const result = inspections.sort(sortInspection('inspectorName', 'desc'));
    const actual = toCompare(result, 'inspectorName');
    expect(actual).toEqual(expected);
  });

  test('it sorts inspection template name in ascending order', () => {
    const expected = 'bathroom | kitchen | living room';
    const inspections = [
      { templateName: 'kitchen' },
      { templateName: 'bathroom' },
      { templateName: 'living room' }
    ];
    const result = inspections.sort(sortInspection('templateName', 'asc'));
    const actual = toCompare(result, 'templateName');
    expect(actual).toEqual(expected);
  });

  test('it sorts inspection template name in descending order', () => {
    const expected = 'living room | kitchen | bathroom';
    const inspections = [
      { templateName: 'kitchen' },
      { templateName: 'bathroom' },
      { templateName: 'living room' }
    ];
    const result = inspections.sort(sortInspection('templateName', 'desc'));
    const actual = toCompare(result, 'templateName');
    expect(actual).toEqual(expected);
  });

  test('it sorts inspection template category in ascending order', () => {
    const expected = 'apartment | penthouse | ';
    const inspections = [
      { templateCategory: 'penthouse' },
      { templateCategory: '' },
      { templateCategory: 'apartment' }
    ];
    const result = inspections.sort(sortInspection('templateCategory', 'asc'));
    const actual = toCompare(result, 'templateCategory');
    expect(actual).toEqual(expected);
  });

  test('it sorts inspection template category in descending order', () => {
    const expected = 'penthouse | apartment | ';
    const inspections = [
      { templateCategory: 'penthouse' },
      { templateCategory: '' },
      { templateCategory: 'apartment' }
    ];
    const result = inspections.sort(sortInspection('templateCategory', 'desc'));
    const actual = toCompare(result, 'templateCategory');
    expect(actual).toEqual(expected);
  });
});
