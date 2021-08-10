import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import {
  openBid,
  approvedBid,
  rejectedBid,
  incompleteBid,
  completeBid
} from '../../../__mocks__/bids';
import useBidSections from './useBidSections';

describe('Unit | Features | Job Bids | Hooks | Sections', () => {
  afterEach(() => sinon.restore());

  test('should return all sections', () => {
    const expected = 5;

    const { result } = renderHook(() => useBidSections([openBid]));

    const actual = result.current.sections.length;

    expect(actual).toEqual(expected);
  });

  test('should show bids inside their respective sections', () => {
    const expected =
      'open:bid-1 | approved:bid-2 | rejected:bid-3 | incomplete:bid-4 | complete:bid-5';

    const { result } = renderHook(() =>
      useBidSections([
        openBid,
        approvedBid,
        rejectedBid,
        incompleteBid,
        completeBid
      ])
    );

    const sections = result.current.sections.map((s) =>
      [s.state, s.bids.map((b) => b.id).join(',')].join(':')
    );
    const actual = sections.join(' | ');

    expect(actual).toEqual(expected);
  });

  test('should empty state for sections that contain no bids', () => {
    const expected =
      'open: | approved:bid-2 | rejected:bid-3 | incomplete:bid-4 | complete:bid-5';

    const { result } = renderHook(() =>
      useBidSections([approvedBid, rejectedBid, incompleteBid, completeBid])
    );

    const sections = result.current.sections.map((s) =>
      [s.state, s.bids.map((b) => b.id).join(',')].join(':')
    );
    const actual = sections.join(' | ');

    expect(actual).toEqual(expected);
  });
});
