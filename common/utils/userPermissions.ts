import userModel from '../models/user';
import jobModel from '../models/job';
import bidModel from '../models/bid';
import inspectionModel from '../models/inspection';

// Create flat array of all user's
// property's that they are members of.
// Users should have access to all the
// nested properties under their teams hash
export const getTeamsProperties = (userTeams: any = {}): string[] => {
  if (typeof userTeams !== 'object' && !Array.isArray(userTeams)) {
    throw TypeError(`expected users teams to be an object. Got : ${userTeams}`);
  }

  return [].concat(
    ...Object.values(userTeams || {})
      .filter((team: any) => typeof team === 'object')
      .map((teamHash: any) => Object.keys(teamHash))
  );
};

// Create array of all a users property memberships id's
export const getProperties = (userProperties: any = {}): string[] => {
  if (typeof userProperties !== 'object' && !Array.isArray(userProperties)) {
    throw TypeError(
      `expected user properties to be an object: ${userProperties}`
    );
  }

  return Object.keys(userProperties || {});
};

// All users access to properties
// including explicit property access
// via `properties` as well as implied
// property access via `teams`
export const getPropertyLevelAccess = (
  userProperties: any = {},
  userTeams: any = {}
): string[] =>
  []
    .concat(
      Object.keys(userProperties || {}),
      ...Object.keys(userTeams || {})
        .filter((teamId) => typeof userTeams[teamId] === 'object')
        .map((teamId) => Object.keys(userTeams[teamId]))
    )
    .filter((propId, i, all) => all.indexOf(propId) === i); // unique only

// Create array of all a users team leaderships/memberships id's
export const getTeams = (userTeams: any = {}): string[] => {
  if (typeof userTeams !== 'object' || Array.isArray(userTeams)) {
    throw TypeError(
      `expected users properties to be an object. Got : ${userTeams}`
    );
  }

  return Object.keys(userTeams || {});
};

// Discovers the permission level of a user
// returns a name to be associated with their access
export const getLevelName = (
  user: userModel,
  teamOrientation = false
): string => {
  const hasLeadershipTeams: boolean = getTeamsProperties(user.teams).length > 0;
  const hasPropertyMemberships: boolean =
    getProperties(user.properties).length > 0;
  const hasTeams: boolean = getTeams(user.teams).length > 0;

  if (user.admin) {
    return 'admin';
  }

  if (user.corporate && hasLeadershipTeams) {
    return 'teamLead';
  }

  if (user.corporate) {
    return 'corporate';
  }

  // Provide team base levels
  // when team orientation is active
  if (teamOrientation && hasTeams) {
    return 'teamMember';
  }

  if (teamOrientation && hasPropertyMemberships) {
    return 'teamProperty';
  }

  if (hasPropertyMemberships) {
    return 'propertyMember';
  }

  return 'noAccess';
};

// Checks that the user can delete inspection entry or not
export const canDeleteInspection = (user: userModel): boolean => user.admin;

// Checks that the user can create team record
export const canCreateTeam = (user: userModel): boolean => user.admin;

// Checks that the user can create property record
export const canCreateProperty = (user: userModel): boolean => user.admin;

// Checks that the user can create or edit property record
export const canEditProperty = (user: userModel): boolean => user.admin;

// Checks that the user can re-assign inspection entry against a property
export const canReassignInspectionProperty = (user: userModel): boolean =>
  user.admin;

// Checks if user has access to a property
const hasPropertyAccess = (user: userModel, propertyId: string): boolean =>
  getPropertyLevelAccess(user.properties, user.teams).includes(propertyId);

// Checks if user has access to a team
export const hasTeamAccess = (user: userModel, teamId: string): boolean =>
  user.admin || user.corporate || getTeams(user.teams).includes(teamId);

// Checks user has permission to CREATE property inspections
export const canCreateInspection = (
  user: userModel,
  propertyId: string
): boolean =>
  user.admin || user.corporate || hasPropertyAccess(user, propertyId);

// Checks user has permission to CREATE property inspections
export const canViewPropertyProfile = (
  user: userModel,
  propertyId: string
): boolean =>
  user.admin || user.corporate || hasPropertyAccess(user, propertyId);

// Checks if inspection is completed
export const isInspectionComplete = (inspection: inspectionModel): boolean =>
  inspection.inspectionCompleted;

// Checks if user is inspection owner
export const isInspectionOwner = (
  user: userModel,
  inspection: inspectionModel
): boolean => user.id === inspection.inspector;

// Checks if user have permission to edit inspection
export const canEditInspection = (
  user: userModel,
  inspection: inspectionModel,
  isAdminEditModeEnabled: boolean
): boolean =>
  // Allow user to update their own incomplete inspection
  (isInspectionOwner(user, inspection) && !isInspectionComplete(inspection)) ||
  // Allow privaleged user to update another user's comleted inspection in overwrite mode
  (canOverwriteInspection(user) && isAdminEditModeEnabled);

// Checks user have permission to overwight inspection
export const canOverwriteInspection = (user: userModel): boolean =>
  user.admin || user.corporate;

// Checks user has permission to UPDATE a completed inspection
export const canEnableOverwriteMode = (
  user: userModel,
  inspection: inspectionModel,
  isAdminEditModeEnabled: boolean
): boolean => canOverwriteInspection(user) && !isAdminEditModeEnabled;

// Checks user has permission to view property jobs
export const canAccessJobs = (user: userModel, propertyId: string): boolean =>
  user.admin || user.corporate || hasPropertyAccess(user, propertyId);

// Checks user has permission to view property jobs bids
export const canAccessBids = (user: userModel, propertyId: string): boolean =>
  user.admin || user.corporate || hasPropertyAccess(user, propertyId);

// Checks that the user can update company settings
export const canUpdateCompanySettings = (user: userModel): boolean =>
  user.admin;

// Checks user can authorize the job
export const canAuthorizeJob = (
  jobId: string,
  user: userModel,
  propertyId: string,
  job: jobModel,
  bids: bidModel[]
): boolean => {
  if (jobId === 'new' || job.state !== 'approved') {
    return false; // Cannot authorize new/unapproved jobs
  }

  const minBids = job.minBids || Infinity;
  const hasMetMinBidReq = bids.length >= minBids;
  const hasMetApprovedBidReq =
    bids.filter((bid) => bid.state === 'approved').length > 0;

  // Only allow admins to authorize, qualified, expedited jobs
  if (job.authorizedRules === 'expedite') {
    return user.admin && hasMetMinBidReq && hasMetApprovedBidReq;
  }

  // Only allow admins to authorize, qualified, large jobs
  if (job.authorizedRules === 'large') {
    return user.admin && hasMetMinBidReq && hasMetApprovedBidReq;
  }

  // Allow admins to authorize all qualifying jobs
  if (user.admin) {
    return hasMetMinBidReq && hasMetApprovedBidReq;
  }

  // Allow corporates to authorize any small job
  if (user.corporate) {
    return (
      job.type.search(/^small/i) === 0 &&
      hasMetMinBidReq &&
      hasMetApprovedBidReq
    );
  }

  // Allow property level users to authorize small pm jobs
  if (!user.corporate && !user.admin && hasPropertyAccess(user, propertyId)) {
    return job.type === 'small:pm' && hasMetMinBidReq && hasMetApprovedBidReq;
  }

  return false;
};

// User can transition job to approved state
export const canApproveJob = (
  isNewJob: boolean,
  user: userModel,
  propertyId: string,
  job: jobModel
): boolean => {
  if (!job.scopeOfWork && (job.scopeOfWorkAttachments || []).length === 0) {
    return false; // cannot approve if scope of work requirements are not met
  }

  if (isNewJob || job.state !== 'open') {
    return false; // cannot approve new/non-open jobs
  }

  // Allow admins to approve all open jobs
  if (user.admin) {
    return true;
  }

  // Allow corporate users to approve any small job
  if (user.corporate) {
    return job.type.search(/^small/i) === 0;
  }

  // Allow property managers to approve small property management jobs
  if (!user.corporate && !user.admin && hasPropertyAccess(user, propertyId)) {
    return job.type === 'small:pm';
  }

  return false;
};

// Checks user can expedite the job
// If job is in approved state
// And user is admin and job is not already expedited
export const canExpediteJob = (
  jobId: string,
  user: userModel,
  job: jobModel,
  bidsRequired: number
): boolean =>
  jobId !== 'new' &&
  job.state === 'approved' &&
  user.admin &&
  job.authorizedRules !== 'expedite' &&
  bidsRequired > 0;

// Checks user can approve the bid
export const canApproveBid = (
  isNewBid: boolean,
  user: userModel,
  propertyId: string,
  job: jobModel,
  bid: bidModel
): boolean => {
  if (isNewBid || bid.state !== 'open') {
    return false; // cannot approve new/non-open bids
  }

  // Allow admins to approve all
  if (user.admin) {
    return true;
  }

  // Allow corporate users to approve any small job
  if (user.corporate) {
    return job.type.search(/^small/i) === 0;
  }

  // Allow property managers to approve small property management jobs
  if (!user.corporate && !user.admin && hasPropertyAccess(user, propertyId)) {
    return job.type === 'small:pm';
  }

  return false;
};

// Checks that the user can create new team
export const canAccessCreateTeam = (user: userModel): boolean => user.admin;

// Checks that the user can update a team
export const canAccessUpdateTeam = (user: userModel): boolean =>
  user.admin || user.corporate;

// Checks that the user can close a deficient item
export const canCloseDeficientItem = (user: userModel): boolean =>
  user.admin || user.corporate;

// Checks that the user can send back a deficient item
export const canGoBackDeficientItem = (user: userModel): boolean =>
  user.admin || user.corporate;

// Checks that the user can defer a deficient item
export const canDeferDeficientItem = (user: userModel): boolean =>
  user.admin || user.corporate;

// Checks that the user can create trello card for a deficient item
export const canCreateTrelloCard = (user: userModel): boolean =>
  user.admin || user.corporate;

export const canCompleteDeficientItem = (
  user: userModel,
  propertyId: string
): boolean =>
  user.admin || user.corporate || hasPropertyAccess(user, propertyId);

// User has access to view templates
export const canViewTemplates = (user: userModel): boolean =>
  user.admin || user.corporate;

// User has access to update templates
export const canCreateTemplate = (user: userModel): boolean =>
  user.admin || user.corporate;

// User has access to update templates
export const canUpdateTemplate = (user: userModel): boolean =>
  user.admin || user.corporate;

// User has access to delete templates
export const canDeleteTemplate = (user: userModel): boolean => user.admin;

// User has access to create template categories
export const canCreateTemplateCategory = (user: userModel): boolean =>
  user.admin || user.corporate;

// User has access to update template categories
export const canUpdateTemplateCategory = (user: userModel): boolean =>
  user.admin || user.corporate;

// User has access to delete template categories
export const canDeleteTemplateCategory = (user: userModel): boolean =>
  user.admin || user.corporate;

// User has access to view all users
export const canViewUsers = (user: userModel): boolean => user.admin;

// User has ability to change property,
// corporate, team, or admin role(s)
export const canEditUserRoles = (user: userModel): boolean => user.admin;

// User has ability to update system settings,
export const canUpdateSystemSettings = (user: userModel): boolean => user.admin;
