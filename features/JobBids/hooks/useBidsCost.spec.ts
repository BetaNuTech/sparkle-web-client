import useBidsCost from './useBidsCost';
import { openBid } from '../../../__mocks__/bids';

describe('Unit | Features | Jobs Bids | Hooks | Use Bids Cost', () => {
  test('should return bid value with range cost', () => {
    const expected = '3,500 - 4,000';
    const actual = useBidsCost(openBid);
    expect(actual).toEqual(expected);
  });

  test('should return bid value with min cost which has same min and max cost', () => {
    const bid = { ...openBid };
    bid.costMax = 3500;
    const expected = '3,500';
    const actual = useBidsCost(bid);
    expect(actual).toEqual(expected);
  });
});
