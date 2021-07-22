import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import useJob from './useJob';
import jobsApi from '../services/firestore/jobs';

const emptyCollectionResult = {
  status: 'success',
  error: null,
  data: []
};

describe('Unit | Common | Hooks | Use Job', () => {
  afterEach(() => sinon.restore());

  test('should request job record', () => {
    const expected = 'job-123';
    const findRecord = sinon
      .stub(jobsApi, 'findRecord')
      .returns(emptyCollectionResult);
    renderHook(() => useJob({}, expected));

    const result = findRecord.firstCall || { args: [] };
    const actual = result.args[1];
    expect(actual).toEqual(expected);
  });
});
