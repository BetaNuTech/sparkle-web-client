import sinon from 'sinon';
import {
  admin,
  corporate,
  teamLead,
  teamMember,
  propertyMember,
  noAccess
} from '../../__mocks__/users';
import * as util from './userPermissions';

describe('Unit | Common | Utils | User Permissions', () => {
  afterEach(() => sinon.restore());

  test('it returns all a users properties', () => {
    const expected = Object.keys(propertyMember.properties);
    const actual = util.getProperties(propertyMember.properties);
    expect(actual).toEqual(expected);
  });

  test('it returns all a users team associations', () => {
    const expected = Object.keys(teamMember.teams);
    const actual = util.getTeams(teamMember.teams);
    expect(actual).toEqual(expected);
  });

  test('it returns all a users team lead properties', () => {
    const expected = Object.keys(Object.values(teamLead.teams)[0]);
    const actual = util.getLeadershipProperties(teamLead.teams);
    expect(actual).toEqual(expected);
  });

  test('it returns teams for a team lead user', () => {
    const expected = [Object.keys(teamLead.teams)[0]];
    const actual = util.getLeadershipTeams(teamLead.teams);
    expect(actual).toEqual(expected);
  });

  test('it returns the correct permission level name for all access levels', () => {
    const data = [
      {
        user: admin,
        expected: 'admin'
      },
      {
        user: corporate,
        expected: 'corporate'
      },
      {
        user: teamLead,
        expected: 'teamLead'
      },
      {
        user: propertyMember,
        expected: 'propertyMember'
      },
      {
        user: noAccess,
        expected: 'noAccess'
      }
    ];

    for (let i = 0; i < data.length; i += 1) {
      const { user, expected } = data[i];
      const actual = util.getLevelName(user);
      expect(actual).toEqual(expected);
    }
  });

  test('it should only allow admins to delete inspections', () => {
    const expected = [true, false, false, false, false];

    const actual = [
      util.canDeleteInspection(admin),
      util.canDeleteInspection(corporate),
      util.canDeleteInspection(teamLead),
      util.canDeleteInspection(propertyMember),
      util.canDeleteInspection(noAccess)
    ];
    expect(actual).toEqual(expected);
  });

  test('it should only allow admins to create new team record', () => {
    const expected = [true, false, false, false, false];

    const actual = [
      util.canCreateTeam(admin),
      util.canCreateTeam(corporate),
      util.canCreateTeam(teamLead),
      util.canCreateTeam(propertyMember),
      util.canCreateTeam(noAccess)
    ];
    expect(actual).toEqual(expected);
  });

  test('it should only allow admins to create new property record', () => {
    const expected = [true, false, false, false, false];

    const actual = [
      util.canCreateProperty(admin),
      util.canCreateProperty(corporate),
      util.canCreateProperty(teamLead),
      util.canCreateProperty(propertyMember),
      util.canCreateProperty(noAccess)
    ];
    expect(actual).toEqual(expected);
  });

  test('it should only allow admins to re-assign inspections', () => {
    const expected = [true, false, false, false, false];

    const actual = [
      util.canReassignInspectionProperty(admin),
      util.canReassignInspectionProperty(corporate),
      util.canReassignInspectionProperty(teamLead),
      util.canReassignInspectionProperty(propertyMember),
      util.canReassignInspectionProperty(noAccess)
    ];
    expect(actual).toEqual(expected);
  });
});
