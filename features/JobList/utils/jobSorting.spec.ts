import sinon from 'sinon';
import { sortJob, nextJobSort } from './jobSorting';

type Job = {
  title?: string;
  type?: string;
  createdAt?: number;
  updatedAt?: number;
};

// Compare array map by value as string
const toCompare = (arr: Array<Job>, attr = 'name'): string =>
  arr
    .map((obj) => obj[attr])
    .join(' | ')
    .toLowerCase();

describe('Spec | Job List | Utils | Job Sorting', () => {
  afterEach(() => sinon.restore());

  test('it sorts job creation date in ascending order', () => {
    const expected = '1620866714 | 1620876714 | 1620952610';
    const jobs = [
      { createdAt: 1620952610 },
      { createdAt: 1620866714 },
      { createdAt: 1620876714 }
    ];
    const result = jobs.sort(sortJob('createdAt', 'asc'));
    const actual = toCompare(result, 'createdAt');
    expect(actual).toEqual(expected);
  });

  test('it sorts job creation date in descending order', () => {
    const expected = '1620952610 | 1620876714 | 1620866714';
    const jobs = [
      { createdAt: 1620952610 },
      { createdAt: 1620866714 },
      { createdAt: 1620876714 }
    ];
    const result = jobs.sort(sortJob('createdAt', 'desc'));
    const actual = toCompare(result, 'createdAt');
    expect(actual).toEqual(expected);
  });

  test('it sorts job updation date in ascending order', () => {
    const expected = '1620866714 | 1620876714 | 1620952610';
    const jobs = [
      { updatedAt: 1620952610 },
      { updatedAt: 1620866714 },
      { updatedAt: 1620876714 }
    ];
    const result = jobs.sort(sortJob('updatedAt', 'asc'));
    const actual = toCompare(result, 'updatedAt');
    expect(actual).toEqual(expected);
  });

  test('it sorts job updation date in descending order', () => {
    const expected = '1620952610 | 1620876714 | 1620866714';
    const jobs = [
      { updatedAt: 1620952610 },
      { updatedAt: 1620866714 },
      { updatedAt: 1620876714 }
    ];
    const result = jobs.sort(sortJob('updatedAt', 'desc'));
    const actual = toCompare(result, 'updatedAt');
    expect(actual).toEqual(expected);
  });

  test('it sorts job title in ascending order', () => {
    const expected = 'install playground | replace tiling | swimming pool';
    const jobs = [
      { title: 'replace tiling' },
      { title: 'install playground' },
      { title: 'swimming pool' }
    ];
    const result = jobs.sort(sortJob('title', 'asc'));
    const actual = toCompare(result, 'title');
    expect(actual).toEqual(expected);
  });

  test('it sorts job title in descending order', () => {
    const expected = 'swimming pool | replace tiling | install playground';
    const jobs = [
      { title: 'replace tiling' },
      { title: 'install playground' },
      { title: 'swimming pool' }
    ];
    const result = jobs.sort(sortJob('title', 'desc'));
    const actual = toCompare(result, 'title');
    expect(actual).toEqual(expected);
  });

  test('it sorts job type in ascending order', () => {
    const expected = 'improvement | maintenance | maintenance';
    const jobs = [
      { type: 'maintenance' },
      { type: 'improvement' },
      { type: 'maintenance' }
    ];
    const result = jobs.sort(sortJob('type', 'asc'));
    const actual = toCompare(result, 'type');
    expect(actual).toEqual(expected);
  });

  test('it sorts job type in descending order', () => {
    const expected = 'maintenance | maintenance | improvement';
    const jobs = [
      { type: 'maintenance' },
      { type: 'improvement' },
      { type: 'maintenance' }
    ];
    const result = jobs.sort(sortJob('type', 'desc'));
    const actual = toCompare(result, 'type');
    expect(actual).toEqual(expected);
  });

  test('check that the sort order for mobile is maintained', () => {
    const expected = 'title | updatedAt | createdAt | type | title';
    const sortOrder = [];

    let sortBy = 'title';
    sortOrder.push(sortBy);

    // updatedAt
    sortBy = nextJobSort(sortBy);
    sortOrder.push(sortBy);

    // createdAt
    sortBy = nextJobSort(sortBy);
    sortOrder.push(sortBy);

    // type
    sortBy = nextJobSort(sortBy);
    sortOrder.push(sortBy);

    // title
    sortBy = nextJobSort(sortBy);
    sortOrder.push(sortBy);

    const actual = sortOrder.join(' | ');
    expect(actual).toEqual(expected);
  });
});
