interface property {
  id: string;
  name: string;
  addr1?: string;
  addr2?: string;
  city?: string;
  code?: string;
  lastInspectionDate?: number;
  lastInspectionScore?: number;
  loan_type?: string; // eslint-disable-line camelcase
  maint_super_name?: string; // eslint-disable-line camelcase
  manager_name?: string; // eslint-disable-line camelcase
  num_of_units?: number; // eslint-disable-line camelcase
  numOfInspections?: number;
  bannerPhotoName?: string; // NOTE: Deprecated by: `logoName` Issue #647
  bannerPhotoURL?: string; // NOTE: Deprecated by: `logoURL` Issue #647
  logoName?: string;
  logoURL?: string;
  photoName?: string;
  photoURL?: string;
  state?: string;
  year_built?: number; // eslint-disable-line camelcase
  slackChannel?: string;
  zip?: string;

  // Relationships
  templates?: any;
  team?: string;

  // Deficient Item Attributes
  numOfDeficientItems?: number;
  numOfRequiredActionsForDeficientItems?: number;
  numOfFollowUpActionsForDeficientItems?: number;
  numOfOverdueDeficientItems?: number;
}

export default property;
