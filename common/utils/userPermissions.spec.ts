import sinon from 'sinon';
import {
  admin,
  corporate,
  teamLead,
  teamMember,
  propertyMember,
  noAccess
} from '../../__mocks__/users';
import {
  openImprovementJob,
  approvedImprovementJob,
  approvedExpeditedMaintenanceJob,
  approvedLargeJob
} from '../../__mocks__/jobs';
import deepClone from '../../__tests__/helpers/deepClone';
import jobModel from '../models/job';
import bidModel from '../models/bid';
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

  test('it should only allow admins to update company settings', () => {
    const data = [
      {
        user: admin,
        expected: true,
        msg: 'accepts admin user'
      },
      {
        user: corporate,
        expected: false,
        msg: 'rejects corporate user'
      },
      {
        user: teamLead,
        expected: false,
        msg: 'rejects team lead user'
      },
      {
        user: propertyMember,
        expected: false,
        msg: 'rejects property memeber user'
      },
      {
        user: noAccess,
        expected: false,
        msg: 'rejects no access user'
      }
    ];

    for (let i = 0; i < data.length; i += 1) {
      const { user, expected, msg } = data[i];
      const actual = util.canUpdateCompanySettings(user);
      expect(actual, msg).toEqual(expected);
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

  test('it should only allow authorizing job when necessary conditions are met', () => {
    const data = [
      {
        jobId: 'new',
        user: admin,
        job: {} as jobModel,
        bids: [{} as bidModel],
        expected: false,
        msg: 'does not allow admin to authorize new job'
      },
      {
        jobId: 'job-1',
        user: teamMember,
        job: approvedImprovementJob,
        bids: [{} as bidModel],
        expected: false,
        msg: 'does not allow team member to authorize job without qualifying bids'
      },
      {
        jobId: 'job-1',
        user: teamMember,
        job: openImprovementJob,
        bids: [{ state: 'open' } as bidModel],
        expected: false,
        msg: 'rejects team member from authorizing job with single open bid'
      },
      {
        args: [],
        jobId: 'job-1',
        user: teamMember,
        job: approvedExpeditedMaintenanceJob,
        bids: [{ state: 'approved' } as bidModel],
        expected: false,
        msg: 'rejects team member from authorize expedited job with single approved bid'
      },

      {
        jobId: 'job-1',
        user: teamMember,
        job: approvedImprovementJob,
        bids: [{ state: 'approved' } as bidModel],
        expected: false,
        msg: 'rejects team member from authorizing small job with single approved bid'
      },
      {
        jobId: 'job-1',
        user: teamMember,
        job: approvedImprovementJob,
        bids: [
          { state: 'approved' } as bidModel,
          { state: 'open' } as bidModel
        ],
        expected: true,
        msg: 'allows team member to authorize small job when enough bids exist and one is approved'
      },
      {
        jobId: 'job-1',
        user: teamMember,
        job: approvedLargeJob,
        bids: [
          { state: 'approved' } as bidModel,
          { state: 'open' } as bidModel,
          { state: 'open' } as bidModel
        ],
        expected: false,
        msg: 'rejects team member from authorize large job when enough bids exist and one is approved'
      },
      {
        jobId: 'job-1',
        user: admin,
        job: approvedLargeJob,
        bids: [
          { state: 'approved' } as bidModel,
          { state: 'open' } as bidModel,
          { state: 'open' } as bidModel
        ],
        expected: true,
        msg: 'allows admin to authorize large job when enough bids exist and one is approved'
      }
    ];

    for (let i = 0; i < data.length; i += 1) {
      const { jobId, user, job, bids, expected, msg } = data[i];
      const actual = util.canAuthorizeJob(jobId, user, job, bids);
      expect(actual, msg).toEqual(expected);
    }
  });

  test('it should allow admin to expedite job when job is approved', () => {
    const data = [
      {
        jobId: 'new',
        user: admin,
        job: {} as jobModel,
        expected: false,
        msg: 'does not allow admin to expedite new job'
      },
      {
        jobId: 'job-1',
        user: teamMember,
        job: approvedImprovementJob,
        expected: false,
        msg: 'does not allow team member to expedite job'
      },
      {
        jobId: 'job-1',
        user: admin,
        job: openImprovementJob,
        expected: false,
        msg: 'does not allow admin to expedite open job'
      },
      {
        jobId: 'job-1',
        user: admin,
        job: approvedExpeditedMaintenanceJob,
        expected: false,
        msg: 'does not allow admin to expedite, previously expedited, job'
      },
      {
        jobId: 'job-1',
        user: teamLead,
        job: approvedExpeditedMaintenanceJob,
        expected: false,
        msg: 'does not allow team lead to expedite, previously expedited, job'
      },
      {
        jobId: 'job-1',
        user: teamMember,
        job: approvedExpeditedMaintenanceJob,
        expected: false,
        msg: 'does not allow team member to expedite, previously expedited, job'
      },
      {
        jobId: 'job-1',
        user: admin,
        job: approvedImprovementJob,
        expected: true,
        msg: 'allow admin to expedite approved job'
      }
    ];

    for (let i = 0; i < data.length; i += 1) {
      const { jobId, user, job, expected, msg } = data[i];
      const actual = util.canExpediteJob(jobId, user, job);
      expect(actual, msg).toEqual(expected);
    }
  });
});
