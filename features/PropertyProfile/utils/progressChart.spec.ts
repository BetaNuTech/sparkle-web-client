import { getProgressPercent } from './progressChart';

describe('Spec | Property Profile | Utils | Progress Chart', () => {
  test('it creates a percentage of total completed items rounded to 2 decimal points', () => {
    const expected = '33.33';
    const actual = getProgressPercent(3, 9);
    expect(actual).toEqual(expected);
  });
});
