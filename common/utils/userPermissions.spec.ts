import sinon from 'sinon';
import {
  admin,
  corporate,
  teamLead,
  teamMember,
  propertyMember,
  noAccess
} from '../../__mocks__/users';
import { fullInspection, inspectionB } from '../../__mocks__/inspections';
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
import attachments from '../../__mocks__/attachments';

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
      },
      {
        user: teamMember,
        expected: 'teamMember',
        teamOrientation: true
      },
      {
        user: propertyMember,
        expected: 'teamProperty',
        teamOrientation: true
      }
    ];

    for (let i = 0; i < data.length; i += 1) {
      const { user, expected, teamOrientation = false } = data[i];
      const actual = util.getLevelName(user, teamOrientation);
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

  test('it should only allow admins to edit completed inspection if user is in edit mode', () => {
    const isAdminEditModeEnabled = true;
    const expected = [false, true, true, true, false, false, false];

    const actual = [
      util.canEditInspection(admin, fullInspection, false),
      util.canEditInspection(admin, fullInspection, isAdminEditModeEnabled),

      util.canEditInspection(corporate, fullInspection, isAdminEditModeEnabled),
      util.canEditInspection(teamLead, fullInspection, isAdminEditModeEnabled),
      util.canEditInspection(
        propertyMember,
        fullInspection,
        isAdminEditModeEnabled
      ),
      util.canEditInspection(
        teamMember,
        fullInspection,
        isAdminEditModeEnabled
      ),
      util.canEditInspection(noAccess, fullInspection, isAdminEditModeEnabled)
    ];

    expect(actual).toEqual(expected);
  });

  test('it should allow inspection owner to edit their incomplete inspection', () => {
    const teamMemberCompletedInspection = Object.assign(
      deepClone(fullInspection),
      {
        inspector: teamMember.id
      }
    );
    const teamMemberIncompleteInspection = Object.assign(
      deepClone(inspectionB),
      {
        inspector: teamMember.id
      }
    );

    const teamLeadCompletedInspection = Object.assign(
      deepClone(fullInspection),
      {
        inspector: teamLead.id
      }
    );
    const teamLeadIncompleteInspection = Object.assign(deepClone(inspectionB), {
      inspector: teamLead.id
    });

    const propertyMemberCompletedInspection = Object.assign(
      deepClone(fullInspection),
      {
        inspector: propertyMember.id
      }
    );
    const propertyMemberIncompleteInspection = Object.assign(
      deepClone(inspectionB),
      {
        inspector: propertyMember.id
      }
    );

    const expected = [
      false,
      true,
      false,
      false,
      true,
      false,
      false,
      true,
      false
    ];

    const actual = [
      util.canEditInspection(teamMember, teamMemberCompletedInspection, false),
      util.canEditInspection(teamMember, teamMemberIncompleteInspection, false),
      util.canEditInspection(
        propertyMember,
        teamMemberIncompleteInspection,
        false
      ),
      util.canEditInspection(teamLead, teamLeadCompletedInspection, false),
      util.canEditInspection(teamLead, teamLeadIncompleteInspection, false),
      util.canEditInspection(teamMember, teamLeadIncompleteInspection, false),
      util.canEditInspection(
        propertyMember,
        propertyMemberCompletedInspection,
        false
      ),
      util.canEditInspection(
        propertyMember,
        propertyMemberIncompleteInspection,
        false
      ),
      util.canEditInspection(
        teamLead,
        propertyMemberIncompleteInspection,
        false
      )
    ];

    expect(actual).toEqual(expected);
  });

  test('should only allow admin and corporate user to enable edit mode if user is not in admin edit mode', () => {
    const isAdminEditModeEnabled = true;
    const expected = [true, false, false, false, false, false, false];

    const actual = [
      util.canEnableOverwriteMode(admin, fullInspection, false),
      util.canEnableOverwriteMode(
        admin,
        fullInspection,
        isAdminEditModeEnabled
      ),
      util.canEnableOverwriteMode(admin, inspectionB, isAdminEditModeEnabled),
      util.canEnableOverwriteMode(
        corporate,
        fullInspection,
        isAdminEditModeEnabled
      ),
      util.canEnableOverwriteMode(
        teamLead,
        fullInspection,
        isAdminEditModeEnabled
      ),
      util.canEnableOverwriteMode(
        propertyMember,
        fullInspection,
        isAdminEditModeEnabled
      ),
      util.canEnableOverwriteMode(
        noAccess,
        fullInspection,
        isAdminEditModeEnabled
      )
    ];

    expect(actual).toEqual(expected);
  });

  test('it should only allow admin and corporate user to overwrite inspection', () => {
    const expected = [true, true, true, false, false, false];

    const actual = [
      util.canOverwriteInspection(admin),
      util.canOverwriteInspection(corporate),
      util.canOverwriteInspection(teamLead),
      util.canOverwriteInspection(teamMember),
      util.canOverwriteInspection(propertyMember),
      util.canOverwriteInspection(noAccess)
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
        msg: 'rejects team member from authorizing expedited job with single approved bid'
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
        msg: 'allows admin to authorize large job that meets all authorize conditions'
      },
      {
        jobId: 'job-1',
        user: corporate,
        job: approvedLargeJob,
        bids: [
          { state: 'approved' } as bidModel,
          { state: 'open' } as bidModel,
          { state: 'open' } as bidModel
        ],
        expected: false,
        msg: 'does not allow corporate to authorize large job that meets all authorize conditions'
      },
      {
        jobId: 'job-1',
        user: corporate,
        job: { type: 'small:hybrid', minBids: 2 } as jobModel,
        bids: [
          { state: 'approved' } as bidModel,
          { state: 'open' } as bidModel
        ],
        expected: false,
        msg: 'allows corporate to authorize small job that meets all authorize conditions'
      },
      {
        jobId: 'job-1',
        user: propertyMember,
        job: { type: 'small:pm', minBids: 2 } as jobModel,
        bids: [
          { state: 'approved' } as bidModel,
          { state: 'open' } as bidModel
        ],
        expected: false,
        msg: 'allows property level user to authorize small pm job that meets all authorize conditions'
      }
    ];

    for (let i = 0; i < data.length; i += 1) {
      const { jobId, user, job, bids, expected, msg } = data[i];
      const actual = util.canAuthorizeJob(jobId, user, 'property-1', job, bids);
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
        bidsRequired: 0,
        msg: 'does not allow admin to expedite new job'
      },
      {
        jobId: 'job-1',
        user: teamMember,
        job: approvedImprovementJob,
        expected: false,
        bidsRequired: 0,
        msg: 'does not allow team member to expedite job'
      },
      {
        jobId: 'job-1',
        user: admin,
        job: openImprovementJob,
        expected: false,
        bidsRequired: 0,
        msg: 'does not allow admin to expedite open job'
      },
      {
        jobId: 'job-1',
        user: admin,
        job: approvedExpeditedMaintenanceJob,
        expected: false,
        bidsRequired: 0,
        msg: 'does not allow admin to expedite, previously expedited, job'
      },
      {
        jobId: 'job-1',
        user: teamLead,
        job: approvedExpeditedMaintenanceJob,
        expected: false,
        bidsRequired: 0,
        msg: 'does not allow team lead to expedite, previously expedited, job'
      },
      {
        jobId: 'job-1',
        user: teamMember,
        job: approvedExpeditedMaintenanceJob,
        bidsRequired: 0,
        expected: false,
        msg: 'does not allow team member to expedite, previously expedited, job'
      },
      {
        jobId: 'job-1',
        user: admin,
        job: approvedImprovementJob,
        bidsRequired: 1,
        expected: true,
        msg: 'allow admin to expedite approved job'
      },
      {
        jobId: 'job-1',
        user: admin,
        job: approvedImprovementJob,
        bidsRequired: 0,
        expected: false,
        msg: 'allow admin to expedite approved job'
      }
    ];

    for (let i = 0; i < data.length; i += 1) {
      const { jobId, user, job, expected, msg, bidsRequired } = data[i];
      const actual = util.canExpediteJob(jobId, user, job, bidsRequired);
      expect(actual, msg).toEqual(expected);
    }
  });

  test('it should only allow approving jobs for certain conditions and user permissions', () => {
    const data = [
      {
        isNewJob: true,
        user: admin,
        job: {
          type: 'small:pm',
          scopeOfWork: 'test scope',
          scopeOfWorkAttachments: attachments
        } as jobModel,
        expected: false,
        msg: 'does not allow admin to approve new job'
      },
      {
        isNewJob: false,
        user: admin,
        job: {
          type: 'small:pm',
          state: 'open',
          scopeOfWork: '',
          scopeOfWorkAttachments: []
        } as jobModel,
        expected: false,
        msg: 'does not allow admin to approve job missing any SoW'
      },
      {
        isNewJob: false,
        user: admin,
        job: {
          type: 'small:pm',
          state: 'open',
          scopeOfWork: 'valid',
          scopeOfWorkAttachments: []
        } as jobModel,
        expected: true,
        msg: 'it allows admin to approve job with SoW text'
      },
      {
        isNewJob: false,
        user: admin,
        job: {
          type: 'small:pm',
          state: 'open',
          scopeOfWork: '',
          scopeOfWorkAttachments: attachments
        } as jobModel,
        expected: true,
        msg: 'it allows admin to approve job with SoW attachments'
      },
      {
        isNewJob: false,
        user: admin,
        job: {
          type: 'small:pm',
          state: 'open',
          scopeOfWork: 'test scope',
          scopeOfWorkAttachments: attachments
        } as jobModel,
        expected: true,
        msg: 'allows admin to approve open job'
      },
      {
        isNewJob: false,
        user: admin,
        job: {
          type: 'large:am',
          state: 'open',
          scopeOfWork: 'test scope',
          scopeOfWorkAttachments: attachments
        } as jobModel,
        expected: true,
        msg: 'allows admin to approve, large, open job'
      },
      {
        isNewJob: false,
        user: admin,
        job: {
          type: 'large:am',
          state: 'approved',
          scopeOfWork: 'test scope',
          scopeOfWorkAttachments: attachments
        } as jobModel,
        expected: false,
        msg: 'does not allow admin to approve approved job'
      },
      {
        isNewJob: false,
        user: propertyMember,
        job: {
          type: 'small:pm',
          state: 'open',
          scopeOfWork: 'test scope',
          scopeOfWorkAttachments: attachments
        } as jobModel,
        expected: true,
        msg: 'allows property level user to approve small:pm type jobs'
      },
      {
        isNewJob: true,
        user: propertyMember,
        job: {
          type: 'large:am',
          scopeOfWork: 'test scope',
          scopeOfWorkAttachments: attachments
        } as jobModel,
        expected: false,
        msg: 'does not allow property level user to approve new job'
      },
      {
        isNewJob: false,
        user: propertyMember,
        job: {
          type: 'large:am',
          state: 'open',
          scopeOfWork: 'test scope',
          scopeOfWorkAttachments: attachments
        } as jobModel,
        expected: false,
        msg: 'does not allow property level user to approve large jobs'
      },
      {
        isNewJob: true,
        user: corporate,
        job: {
          type: 'small:pm',
          scopeOfWork: 'test scope',
          scopeOfWorkAttachments: attachments
        } as jobModel,
        expected: false,
        msg: 'does not allow corporate user to approve a new job'
      },
      {
        isNewJob: false,
        user: corporate,
        job: {
          type: 'small:hybrid',
          state: 'open',
          scopeOfWork: 'test scope',
          scopeOfWorkAttachments: attachments
        } as jobModel,
        expected: true,
        msg: 'allow corporate user to approve open, small hybird, job'
      },
      {
        isNewJob: false,
        user: corporate,
        job: {
          type: 'small:pm',
          state: 'open',
          scopeOfWork: 'test scope',
          scopeOfWorkAttachments: attachments
        } as jobModel,
        expected: true,
        msg: 'allow corporate user to approve open, small pm, job'
      },
      {
        isNewJob: false,
        user: corporate,
        job: {
          type: 'large:am',
          state: 'open',
          scopeOfWork: 'test scope',
          scopeOfWorkAttachments: attachments
        } as jobModel,
        expected: false,
        msg: 'does not allow corporate user to approve large job'
      },
      {
        isNewJob: false,
        user: admin,
        job: { type: 'large:am', state: 'open' } as jobModel,
        expected: false,
        msg: 'does not allow user to approve job  if scope of work requirement are not met'
      }
    ];

    for (let i = 0; i < data.length; i += 1) {
      const { isNewJob, user, job, expected, msg } = data[i];
      const actual = util.canApproveJob(isNewJob, user, 'property-1', job);
      expect(actual, msg).toEqual(expected);
    }
  });

  test('it should only allow approving bids for certain conditions and user permissions', () => {
    const data = [
      {
        isNewBid: true,
        propertyId: 'property-1',
        user: admin,
        job: { type: 'small:pm' } as jobModel,
        bid: {} as bidModel,
        expected: false,
        msg: 'does not allow admin to approve new bid'
      },
      {
        isNewBid: false,
        propertyId: 'property-1',
        user: admin,
        job: { type: 'small:pm' } as jobModel,
        bid: { state: 'open' } as bidModel,
        expected: true,
        msg: 'allow admin to approve open bid'
      },
      {
        isNewBid: false,
        propertyId: 'property-1',
        user: admin,
        job: { type: 'large:am' } as jobModel,
        bid: { state: 'open' } as bidModel,
        expected: true,
        msg: 'allow admin to approve bid for large job'
      },
      {
        isNewBid: false,
        propertyId: 'property-1',
        user: admin,
        job: { type: 'large:am' } as jobModel,
        bid: { state: 'approved' } as bidModel,
        expected: false,
        msg: 'does not allow admin to approve approved bid'
      },
      {
        isNewBid: false,
        propertyId: 'property-1',
        user: propertyMember,
        job: { type: 'small:pm' } as jobModel,
        bid: { state: 'open' } as bidModel,
        expected: true,
        msg: 'allows property level user to approve open bid for small:pm job'
      },
      {
        isNewBid: true,
        propertyId: 'property-1',
        user: propertyMember,
        job: { type: 'small:pm' } as jobModel,
        bid: { state: 'open' } as bidModel,
        expected: false,
        msg: 'does not allow property level user to approve new bid'
      },
      {
        isNewBid: false,
        propertyId: 'property-1',
        user: propertyMember,
        job: { type: 'large:am' } as jobModel,
        bid: { state: 'open' } as bidModel,
        expected: false,
        msg: 'does not allow property user to approve open bid for large:am job'
      },
      {
        isNewBid: true,
        propertyId: 'property-1',
        user: corporate,
        job: { type: 'large:am' } as jobModel,
        bid: { state: 'open' } as bidModel,
        expected: false,
        msg: 'does not allow corporate user to approve new bid'
      },
      {
        isNewBid: false,
        propertyId: 'property-1',
        user: corporate,
        job: { type: 'small:pm' } as jobModel,
        bid: { state: 'open' } as bidModel,
        expected: true,
        msg: 'allows corporate user to approve open bid for small pm job'
      },
      {
        isNewBid: false,
        propertyId: 'property-1',
        user: corporate,
        job: { type: 'small:hybrid' } as jobModel,
        bid: { state: 'open' } as bidModel,
        expected: true,
        msg: 'allows corporate user to approve open bid for small, hybrid, job'
      },
      {
        isNewBid: false,
        propertyId: 'property-1',
        user: corporate,
        job: { type: 'large:am' } as jobModel,
        bid: { state: 'open' } as bidModel,
        expected: false,
        msg: 'does not allow corporate user to approve open bid for large job'
      }
    ];

    for (let i = 0; i < data.length; i += 1) {
      const { isNewBid, user, job, propertyId, bid, expected, msg } = data[i];
      const actual = util.canApproveBid(isNewBid, user, propertyId, job, bid);
      expect(actual, msg).toEqual(expected);
    }
  });

  test('it should only allow admins to create new team', () => {
    const expected = [true, false, false, false, false];

    const actual = [
      util.canAccessCreateTeam(admin),
      util.canAccessCreateTeam(corporate),
      util.canAccessCreateTeam(teamLead),
      util.canAccessCreateTeam(propertyMember),
      util.canAccessCreateTeam(noAccess)
    ];
    expect(actual).toEqual(expected);
  });

  test('it should only allow admins, corporate users and team leads to update a team', () => {
    const expected = [true, true, true, false, false];

    const actual = [
      util.canAccessUpdateTeam(admin),
      util.canAccessUpdateTeam(corporate),
      util.canAccessUpdateTeam(teamLead),
      util.canAccessUpdateTeam(propertyMember),
      util.canAccessUpdateTeam(noAccess)
    ];
    expect(actual).toEqual(expected);
  });

  test('it should only allow admins, corporate users to close a deficient item', () => {
    const expected = [true, true, true, false, false];

    const actual = [
      util.canCloseDeficientItem(admin),
      util.canCloseDeficientItem(corporate),
      util.canCloseDeficientItem(teamLead),
      util.canCloseDeficientItem(propertyMember),
      util.canCloseDeficientItem(noAccess)
    ];
    expect(actual).toEqual(expected);
  });

  test('it should only allow admins, corporate users to send back a deficient item', () => {
    const expected = [true, true, true, false, false];

    const actual = [
      util.canGoBackDeficientItem(admin),
      util.canGoBackDeficientItem(corporate),
      util.canGoBackDeficientItem(teamLead),
      util.canGoBackDeficientItem(propertyMember),
      util.canGoBackDeficientItem(noAccess)
    ];
    expect(actual).toEqual(expected);
  });

  test('it should only allow admins, corporate users to defer a deficient item', () => {
    const expected = [true, true, true, false, false];

    const actual = [
      util.canDeferDeficientItem(admin),
      util.canDeferDeficientItem(corporate),
      util.canDeferDeficientItem(teamLead),
      util.canDeferDeficientItem(propertyMember),
      util.canDeferDeficientItem(noAccess)
    ];
    expect(actual).toEqual(expected);
  });

  test('it should only allow admins, corporate users to create trello card for a deficient item', () => {
    const expected = [true, true, true, false, false];

    const actual = [
      util.canCreateTrelloCard(admin),
      util.canCreateTrelloCard(corporate),
      util.canCreateTrelloCard(teamLead),
      util.canCreateTrelloCard(propertyMember),
      util.canCreateTrelloCard(noAccess)
    ];
    expect(actual).toEqual(expected);
  });

  test('it should only allow admins, corporate users and property level users to complete deficient item', () => {
    const expected = [true, true, true, true, false];

    const actual = [
      util.canCompleteDeficientItem(admin, 'property-1'),
      util.canCompleteDeficientItem(corporate, 'property-1'),
      util.canCompleteDeficientItem(teamLead, 'property-1'),
      util.canCompleteDeficientItem(propertyMember, 'property-1'),
      util.canCompleteDeficientItem(noAccess, 'property-1')
    ];
    expect(actual).toEqual(expected);
  });

  test('it should only allow admins, corporate users to view templates', () => {
    const expected = [true, true, true, false, false];

    const actual = [
      util.canViewTemplates(admin),
      util.canViewTemplates(corporate),
      util.canViewTemplates(teamLead),
      util.canViewTemplates(propertyMember),
      util.canViewTemplates(noAccess)
    ];
    expect(actual).toEqual(expected);
  });

  test('it should only allow admins, corporate users to create templates', () => {
    const expected = [true, true, true, false, false];

    const actual = [
      util.canCreateTemplate(admin),
      util.canCreateTemplate(corporate),
      util.canCreateTemplate(teamLead),
      util.canCreateTemplate(propertyMember),
      util.canCreateTemplate(noAccess)
    ];
    expect(actual).toEqual(expected);
  });

  test('it should only allow admins, corporate users to update templates', () => {
    const expected = [true, true, true, false, false];

    const actual = [
      util.canUpdateTemplate(admin),
      util.canUpdateTemplate(corporate),
      util.canUpdateTemplate(teamLead),
      util.canUpdateTemplate(propertyMember),
      util.canUpdateTemplate(noAccess)
    ];
    expect(actual).toEqual(expected);
  });

  test('it should only allow admins users to delete templates', () => {
    const expected = [true, false, false, false, false];

    const actual = [
      util.canDeleteTemplate(admin),
      util.canDeleteTemplate(corporate),
      util.canDeleteTemplate(teamLead),
      util.canDeleteTemplate(propertyMember),
      util.canDeleteTemplate(noAccess)
    ];
    expect(actual).toEqual(expected);
  });

  test('it should only allow admins, corporate users to create template category', () => {
    const expected = [true, true, true, false, false];

    const actual = [
      util.canCreateTemplateCategory(admin),
      util.canCreateTemplateCategory(corporate),
      util.canCreateTemplateCategory(teamLead),
      util.canCreateTemplateCategory(propertyMember),
      util.canCreateTemplateCategory(noAccess)
    ];
    expect(actual).toEqual(expected);
  });

  test('it should only allow admins, corporate users to update template category', () => {
    const expected = [true, true, true, false, false];

    const actual = [
      util.canUpdateTemplateCategory(admin),
      util.canUpdateTemplateCategory(corporate),
      util.canUpdateTemplateCategory(teamLead),
      util.canUpdateTemplateCategory(propertyMember),
      util.canUpdateTemplateCategory(noAccess)
    ];
    expect(actual).toEqual(expected);
  });

  test('it should only allow admins, corporate users to delete template category', () => {
    const expected = [true, true, true, false, false];

    const actual = [
      util.canDeleteTemplateCategory(admin),
      util.canDeleteTemplateCategory(corporate),
      util.canDeleteTemplateCategory(teamLead),
      util.canDeleteTemplateCategory(propertyMember),
      util.canDeleteTemplateCategory(noAccess)
    ];
    expect(actual).toEqual(expected);
  });

  test('it should only allow admins to to view users', () => {
    const expected = [true, false, false, false, false];

    const actual = [
      util.canViewUsers(admin),
      util.canViewUsers(corporate),
      util.canViewUsers(teamLead),
      util.canViewUsers(propertyMember),
      util.canViewUsers(noAccess)
    ];
    expect(actual).toEqual(expected);
  });
});
