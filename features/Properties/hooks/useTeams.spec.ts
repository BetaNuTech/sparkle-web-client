import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import useTeams from './useTeams';
import teamsApi from '../../../common/services/firestore/teams';
import { admin, corporate, teamLead } from '../../../__mocks__/users';

describe('Unit | Features | Properties | Hooks | Use Teams', () => {
  afterEach(() => sinon.restore());

  test('should request all teams for an admin user', () => {
    const expected = true;
    const findAll = sinon.stub(teamsApi, 'findAll').callThrough();
    renderHook(() => useTeams(admin));

    const actual = findAll.called;
    expect(actual).toEqual(expected);
  });

  test('should request all teams for corporate users', () => {
    const expected = true;
    const findAll = sinon.stub(teamsApi, 'findAll').callThrough();
    renderHook(() => useTeams(corporate));

    const actual = findAll.called;
    expect(actual).toEqual(expected);
  });

  test('should not request all teams for corporate team leads', () => {
    const expected = false;
    const findAll = sinon.stub(teamsApi, 'findAll').callThrough();
    renderHook(() => useTeams(teamLead));

    const actual = findAll.called;
    expect(actual).toEqual(expected);
  });

  test('should not request any teams for users without access', () => {
    const expected = [false];
    const findAll = sinon.stub(teamsApi, 'findAll').callThrough();
    // TODO all query methods
    renderHook(() => useTeams(teamLead));

    const actual = [findAll.called];
    expect(actual).toEqual(expected);
  });
});
