import sinon from 'sinon';
import {
  admin,
  corporate,
  teamLead,
  teamMember,
  propertyMember,
  noAccess
} from '../../__mocks__/users';
import deepClone from '../../__tests__/helpers/deepClone';
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

  test('it should only allow admins, corporates, team leads, and property level users to create inspections', () => {
    const propertyId = 'property-1';
    const expected = [true, true, true, true, false];
    const updatedTeamLead = Object.assign(deepClone(teamLead), {
      teams: { 'team-1': { [propertyId]: true } }
    });
    const updatedPropertyMember = Object.assign(deepClone(propertyMember), {
      properties: { [propertyId]: true }
    });

    const actual = [
      util.canCreateInspection(admin, propertyId),
      util.canCreateInspection(corporate, propertyId),
      util.canCreateInspection(updatedTeamLead, propertyId),
      util.canCreateInspection(updatedPropertyMember, propertyId),
      util.canCreateInspection(noAccess, propertyId)
    ];

    expect(actual).toEqual(expected);
  });

  test('it should only allow admins, corporates, team leads, and property level users to access jobs', () => {
    const propertyId = 'property-1';
    const expected = [true, true, true, true, false];
    const updatedTeamLead = Object.assign(deepClone(teamLead), {
      teams: { 'team-1': { [propertyId]: true } }
    });
    const updatedPropertyMember = Object.assign(deepClone(propertyMember), {
      properties: { [propertyId]: true }
    });

    const actual = [
      util.canAccessJobs(admin, propertyId),
      util.canAccessJobs(corporate, propertyId),
      util.canAccessJobs(updatedTeamLead, propertyId),
      util.canAccessJobs(updatedPropertyMember, propertyId),
      util.canAccessJobs(noAccess, propertyId)
    ];

    expect(actual).toEqual(expected);
  });

  test('it should only allow admins, corporates, team leads, and property level users to see job bids', () => {
    const propertyId = 'property-1';
    const expected = [true, true, true, true, false];
    const updatedTeamLead = Object.assign(deepClone(teamLead), {
      teams: { 'team-1': { [propertyId]: true } }
    });
    const updatedPropertyMember = Object.assign(deepClone(propertyMember), {
      properties: { [propertyId]: true }
    });

    const actual = [
      util.canAccessBids(admin, propertyId),
      util.canAccessBids(corporate, propertyId),
      util.canAccessBids(updatedTeamLead, propertyId),
      util.canAccessBids(updatedPropertyMember, propertyId),
      util.canAccessBids(noAccess, propertyId)
    ];

    expect(actual).toEqual(expected);
  });

  test('it combines users properties and teams to determine all property level access', () => {
    const prop1 = '-1';
    const prop2 = '-2';
    const prop3 = '-3';
    const prop4 = '-4';
    const team1 = '-5';
    const team2 = '-6';

    [
      {
        data: {
          properties: { [prop1]: true },
          teams: null
        },
        expected: [prop1],
        message: 'property level access included'
      },
      {
        data: {
          properties: { [prop1]: true, [prop2]: true },
          teams: null
        },
        expected: [prop1, prop2],
        message: 'multiple property level access included'
      },
      {
        data: {
          properties: null,
          teams: { [team1]: { [prop1]: true } }
        },
        expected: [prop1],
        message: 'team level access included'
      },
      {
        data: {
          properties: null,
          teams: { [team1]: { [prop1]: true }, [team2]: { [prop2]: true } }
        },
        expected: [prop1, prop2],
        message: 'multiple team level access included'
      },
      {
        data: {
          properties: { [prop1]: true },
          teams: { [team1]: true }
        },
        expected: [prop1],
        message: 'non-property (team membership only) ignored'
      },
      {
        data: {
          properties: { [prop1]: true },
          teams: { [team1]: { [prop2]: true } }
        },
        expected: [prop1, prop2],
        message: 'property and team membership combined'
      },
      {
        data: {
          properties: { [prop1]: true },
          teams: { [team1]: { [prop1]: true } }
        },
        expected: [prop1],
        message: 'property and team membership exclude duplicates'
      },
      {
        data: {
          properties: { [prop1]: true, [prop2]: true },
          teams: { [team1]: { [prop3]: true }, [team2]: { [prop4]: true } }
        },
        expected: [prop1, prop2, prop3, prop4],
        message: 'multiple property and team memberships included'
      }
    ].forEach(({ data, expected: exp }) => {
      const user = deepClone(noAccess);
      const expected = exp.join(', ');
      Object.assign(user, data);
      const actual = util
        .getPropertyLevelAccess(user.properties, user.teams)
        .join(', ');
      expect(actual).toEqual(expected);
    });
  });
});
