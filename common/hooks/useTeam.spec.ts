import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import useTeam from './useTeam';
import teamsDb from '../services/firestore/teams';

const emptyCollectionResult = {
  status: 'success',
  error: null,
  data: []
};

describe('Unit | Common | Hooks | Use Team', () => {
  afterEach(() => sinon.restore());

  test('should request team record', () => {
    const expected = 'team-123';
    const findRecord = sinon
      .stub(teamsDb, 'findRecord')
      .returns(emptyCollectionResult);
    renderHook(() => useTeam({}, expected));

    const result = findRecord.firstCall || { args: [] };
    const actual = result.args[1];
    expect(actual).toEqual(expected);
  });
});
