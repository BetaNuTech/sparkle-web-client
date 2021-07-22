import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import useJobBids from './useJobBids';
import bidsApi from '../../../common/services/firestore/bids';

const emptyCollectionResult = {
  status: 'success',
  error: null,
  data: []
};

describe('Unit | Features | Jobs Bids | Hooks | Use Job Bids', () => {
  afterEach(() => sinon.restore());

  test('should request job bids associated with a job', () => {
    const expected = 'bid-1';
    const queryByJob = sinon
      .stub(bidsApi, 'queryByJob')
      .returns(emptyCollectionResult);
    renderHook(() => useJobBids({}, expected));

    const result = queryByJob.firstCall || { args: [] };
    const actual = result.args[1];
    expect(actual).toEqual(expected);
  });
});
