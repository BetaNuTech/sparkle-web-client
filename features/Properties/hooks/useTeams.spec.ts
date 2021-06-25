import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import useTeams from './useTeams';
import teamsApi from '../../../common/services/firestore/teams';
import {
  admin,
  corporate,
  teamLead,
  teamMember,
  propertyMember,
  noAccess
} from '../../../__mocks__/users';
import * as userUtils from '../../../common/utils/userPermissions';
import errorReports from '../../../common/services/api/errorReports';

const emptyCollectionResult = {
  status: 'success',
  error: null,
  data: []
};

describe('Unit | Features | Properties | Hooks | Use Teams', () => {
  afterEach(() => sinon.restore());

  test('should request all teams for an admin user', () => {
    const expected = [true, false];
    const findAll = sinon
      .stub(teamsApi, 'findAll')
      .returns(emptyCollectionResult);
    const queryRecords = sinon
      .stub(teamsApi, 'queryRecords')
      .returns(emptyCollectionResult);
    renderHook(() => useTeams({}, admin));

    const actual = [findAll.called, queryRecords.called];
    expect(actual).toEqual(expected);
  });

  test('should request all teams for corporate users', () => {
    const expected = [true, false];
    const findAll = sinon
      .stub(teamsApi, 'findAll')
      .returns(emptyCollectionResult);
    const queryRecords = sinon
      .stub(teamsApi, 'queryRecords')
      .returns(emptyCollectionResult);
    renderHook(() => useTeams({}, corporate));

    const actual = [findAll.called, queryRecords.called];
    expect(actual).toEqual(expected);
  });

  test('should not request all teams for corporate team leads', () => {
    const expected = false;
    const corpTeamLead = JSON.parse(JSON.stringify(teamLead));
    corpTeamLead.corporate = true; // sanity check
    const findAll = sinon
      .stub(teamsApi, 'findAll')
      .returns(emptyCollectionResult);
    renderHook(() => useTeams({}, corpTeamLead));

    const actual = findAll.called;
    expect(actual).toEqual(expected);
  });

  test('should not request any teams for users without access', () => {
    const expected = [false, false];
    const findAll = sinon
      .stub(teamsApi, 'findAll')
      .returns(emptyCollectionResult);
    const queryRecords = sinon
      .stub(teamsApi, 'queryRecords')
      .returns(emptyCollectionResult);
    renderHook(() => useTeams({}, noAccess));

    const actual = [findAll.called, queryRecords.called];
    expect(actual).toEqual(expected);
  });

  test('should request assigned teams for team lead user', () => {
    const expected = userUtils.getTeams(teamLead.teams);
    const queryRecords = sinon
      .stub(teamsApi, 'queryRecords')
      .returns(emptyCollectionResult);
    renderHook(() => useTeams({}, teamLead));

    const result = queryRecords.firstCall || { args: [] };
    const actual = result.args[1];
    expect(actual).toEqual(expected);
  });

  test('should request assigned teams for property user', () => {
    const expected = userUtils.getTeams(propertyMember.teams);
    const queryRecords = sinon
      .stub(teamsApi, 'queryRecords')
      .returns(emptyCollectionResult);
    renderHook(() => useTeams({}, propertyMember));

    const result = queryRecords.firstCall || { args: [] };
    const actual = result.args[1];
    expect(actual).toEqual(expected);
  });

  test('should send error report if more than 10 records of team accessed by team lead and still request teams', () => {
    const expected = true;
    const teamUser = JSON.parse(JSON.stringify(teamMember)); // deep clone
    teamUser.teams = {
      'team-1': true,
      'team-2': true,
      'team-3': true,
      'team-4': true,
      'team-5': true,
      'team-6': true,
      'team-7': true,
      'team-8': true,
      'team-9': true,
      'team-10': true,
      'team-11': true
    };
    const queryRecords = sinon
      .stub(teamsApi, 'queryRecords')
      .returns(emptyCollectionResult);
    const sendErrorReport = sinon
      .stub(errorReports, 'send')
      .callsFake(() => true);
    sinon.stub(console, 'warn').callsFake(() => true);

    renderHook(() => useTeams({}, teamUser));

    const actual = queryRecords.called;
    expect(actual).toEqual(expected);
    // Check if send error report was called
    expect(sendErrorReport.called).toEqual(expected);
  });
});
