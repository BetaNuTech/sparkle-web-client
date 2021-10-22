import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import useBidApprovedCompleted from './useBidApprovedCompleted';
import bidModel from '../models/bid';

describe('Unit | Common | Hooks | Use Bid Approved Completed', () => {
  afterEach(() => sinon.restore());

  test('should return complete bid', () => {
    const bids: bidModel[] = [
      { vendor: 'Infinity Chambers', state: 'approved' } as bidModel,
      { vendor: 'Wendys Works', state: 'complete' } as bidModel,
      { vendor: 'Jhonson Steel', state: 'open' } as bidModel
    ];
    const expected = 'Wendys Works';

    const { result } = renderHook(() => useBidApprovedCompleted(bids));

    const actual = result.current.approvedCompletedBid.vendor;
    expect(actual).toEqual(expected);
  });

  test('should return approved bid', () => {
    const bids: bidModel[] = [
      { vendor: 'Infinity Chambers', state: 'approved' } as bidModel,
      { vendor: 'Jhonson Steel', state: 'open' } as bidModel
    ];
    const expected = 'Infinity Chambers';

    const { result } = renderHook(() => useBidApprovedCompleted(bids));

    const actual = result.current.approvedCompletedBid.vendor;
    expect(actual).toEqual(expected);
  });

  test('should not return any bid if set does not contain approved or complete bid', () => {
    const bids: bidModel[] = [
      { vendor: 'Infinity Chambers', state: 'rejected' } as bidModel,
      { vendor: 'Jhonson Steel', state: 'open' } as bidModel
    ];

    const { result } = renderHook(() => useBidApprovedCompleted(bids));
    expect(result.current.approvedCompletedBid).toBeNull();
  });
});
