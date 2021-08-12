import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import useBid from './useBid';
import bidsApi from '../../../common/services/firestore/bids';

const emptyCollectionResult = {
  status: 'success',
  error: null,
  data: []
};

describe('Unit | Common | Hooks | Use Job', () => {
  afterEach(() => sinon.restore());

  test('should request bid record', () => {
    const expected = 'bid-123';
    const findRecord = sinon
      .stub(bidsApi, 'findRecord')
      .returns(emptyCollectionResult);
    renderHook(() => useBid({}, expected));

    const result = findRecord.firstCall || { args: [] };
    const actual = result.args[1];
    expect(actual).toEqual(expected);
  });
});
