import sinon from 'sinon';
import { sortBid, sortBidMobile } from './bidSorting';

type Bid = {
  vendor?: string;
  startAt?: number;
  completeAt?: number;
  costMin?: number;
};

// Compare array map by value as string
const toCompare = (arr: Array<Bid>, attr = 'name'): string =>
  arr
    .map((obj) => obj[attr])
    .join(' | ')
    .toLowerCase();

const toCompareMobile = (arr: Array<Bid>): string =>
  arr
    .map((obj) => `${obj.startAt},${obj.costMin}`)
    .join(' | ')
    .toLowerCase();

describe('Spec | Job Bid List | Utils | Bid Sorting', () => {
  afterEach(() => sinon.restore());

  test('it sorts bid start date in ascending order', () => {
    const expected = '1620866714 | 1620876714 | 1620952610';
    const bids = [
      { startAt: 1620952610 },
      { startAt: 1620866714 },
      { startAt: 1620876714 }
    ];
    const result = bids.sort(sortBid('startAt', 'asc'));
    const actual = toCompare(result, 'startAt');
    expect(actual).toEqual(expected);
  });

  test('it sorts bid start date in descending order', () => {
    const expected = '1620952610 | 1620876714 | 1620866714';
    const bids = [
      { startAt: 1620952610 },
      { startAt: 1620866714 },
      { startAt: 1620876714 }
    ];
    const result = bids.sort(sortBid('startAt', 'desc'));
    const actual = toCompare(result, 'startAt');
    expect(actual).toEqual(expected);
  });

  test('it sorts bid vendor in ascending order', () => {
    const expected = 'john repair | matt co | rob playground';
    const jobs = [
      { vendor: 'rob playground' },
      { vendor: 'john repair' },
      { vendor: 'matt co' }
    ];
    const result = jobs.sort(sortBid('vendor', 'asc'));
    const actual = toCompare(result, 'vendor');
    expect(actual).toEqual(expected);
  });

  test('it sorts bid vendor in descending order', () => {
    const expected = 'rob playground | matt co | john repair';
    const jobs = [
      { vendor: 'john repair' },
      { vendor: 'rob playground' },
      { vendor: 'matt co' }
    ];
    const result = jobs.sort(sortBid('vendor', 'desc'));
    const actual = toCompare(result, 'vendor');
    expect(actual).toEqual(expected);
  });

  test('it sorts bid on mobile using start at and cost minimum in descending', () => {
    const expected =
      '1620952610,2000 | 1620876714,3200 | 1620876714,3000 | 1620866714,2500';
    const jobs = [
      { startAt: 1620952610, costMin: 2000 },
      { startAt: 1620866714, costMin: 2500 },
      { startAt: 1620876714, costMin: 3000 },
      { startAt: 1620876714, costMin: 3200 }
    ];
    const result = jobs.sort(sortBidMobile());
    const actual = toCompareMobile(result);
    expect(actual).toEqual(expected);
  });
});
