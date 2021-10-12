import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import usePropertyJobs from './usePropertyJobs';
import jobsApi from '../services/firestore/jobs';

const emptyCollectionResult = {
  status: 'success',
  error: null,
  data: []
};

describe('Unit | Features | Jobs List | Hooks | Use Property Jobs', () => {
  afterEach(() => sinon.restore());

  test('should request property jobs associated with a property', () => {
    const expected = 'property-1';
    const queryByProperty = sinon
      .stub(jobsApi, 'queryByProperty')
      .returns(emptyCollectionResult);
    renderHook(() => usePropertyJobs({}, expected));

    const result = queryByProperty.firstCall || { args: [] };
    const actual = result.args[1];
    expect(actual).toEqual(expected);
  });
});
