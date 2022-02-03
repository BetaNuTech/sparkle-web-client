import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import useQueryUsers from './useQueryUsers';
import usersDb from '../services/firestore/users';

const emptyCollectionResult = {
  status: 'success',
  error: null,
  data: []
};

describe('Unit | Common | Hooks | Use Query Users', () => {
  afterEach(() => sinon.restore());

  test('should request users records', () => {
    const expected = ['user-123'];
    const queryRecords = sinon
      .stub(usersDb, 'query')
      .returns(emptyCollectionResult);
    renderHook(() => useQueryUsers({}, expected));

    const result = queryRecords.firstCall || { args: [] };
    const actual = result.args[1];
    expect(actual).toEqual(expected);
  });
});
