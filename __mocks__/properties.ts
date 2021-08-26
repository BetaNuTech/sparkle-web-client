import propertyModel from '../common/models/property';

export const fullProperty: propertyModel = {
  id: 'property-1',
  name: 'A1400 Chestnut',
  addr1: '1221 New Meister Lane',
  addr2: 'Blugerville, TX 78660',
  city: 'Acapuco',
  state: 'KY',

  code: 'one',
  lastInspectionDate: 1595501032,
  lastInspectionScore: 92.7,
  loan_type: 'good', // eslint-disable-line camelcase
  maint_super_name: 'john', // eslint-disable-line camelcase
  manager_name: 'jane', // eslint-disable-line camelcase
  num_of_units: 94, // eslint-disable-line camelcase
  numOfInspections: 4,
  bannerPhotoName: 'Jpg', // NOTE: Deprecated by: `logoName` Issue #647
  bannerPhotoURL: '/url.jpg', // NOTE: Deprecated by: `logoURL` Issue #647
  logoName: 'Jpg',
  logoURL: '/url.jpg',
  photoName: 'Jpg',
  /* eslint-disable */
  photoURL:
    'https://firebasestorage.googleapis.com/v0/b/sparkle-jwc.appspot.com/o/propertyImages%2F3e1c1a56d1bd381af398.jpeg?alt=media&token=5d69f6db-f240-4db9-9e52-843c66ee1e05',
  /* eslint-enable */
  year_built: 1984, // eslint-disable-line camelcase
  slackChannel: 'one',
  zip: '85555',
  team: 'team-1',

  // Deficient Item Attributes
  numOfDeficientItems: 82,
  numOfFollowUpActionsForDeficientItems: 0,
  numOfRequiredActionsForDeficientItems: 82,
  numOfOverdueDeficientItems: 4,
  templates: {
    'template-1': true,
    'template-2': true
  }
};

export const propertyB: propertyModel = {
  id: 'property-2',
  name: 'CEmerson',
  addr1: '1221 New Meister Lane',
  addr2: 'Pflugerville, TX 78660',
  city: 'Bermuda',
  state: 'AY',
  numOfDeficientItems: 0,
  numOfFollowUpActionsForDeficientItems: 0,
  numOfRequiredActionsForDeficientItems: 10,
  lastInspectionDate: 1595521032,
  lastInspectionScore: 92.72727272727272
};

export const propertyC: propertyModel = {
  id: 'property-3',
  name: 'BWalnut Ridge',
  addr1: '1221 New Meister Lane',
  addr2: 'Pflugerville, TX 78660',
  city: 'Cape Cod',
  state: 'CY',
  numOfDeficientItems: 11,
  numOfFollowUpActionsForDeficientItems: 55,
  numOfRequiredActionsForDeficientItems: 2,
  lastInspectionDate: 1595621032,
  lastInspectionScore: 92.72727272727272
};

export const propertyD: propertyModel = {
  id: 'property-4',
  name: 'EEmerson',
  addr1: '1221 New Meister Lane',
  addr2: 'Pflugerville, TX 78660',
  city: 'Washington',
  state: 'KY',
  numOfDeficientItems: 5,
  numOfFollowUpActionsForDeficientItems: 24,
  numOfRequiredActionsForDeficientItems: 1,
  lastInspectionDate: 1595521032,
  lastInspectionScore: 92.72727272727272
};

export const propertyE: propertyModel = {
  id: 'property-5',
  name: 'DWalnut Ridge',
  addr1: '1221 New Meister Lane',
  addr2: 'Pflugerville, TX 78660',
  city: 'Zanzibar',
  state: 'BY',
  numOfDeficientItems: 1,
  numOfFollowUpActionsForDeficientItems: 22,
  numOfRequiredActionsForDeficientItems: 22,
  lastInspectionDate: 1593521032,
  lastInspectionScore: 92.72727272727272
};

export const partialProperty: propertyModel = {
  id: 'property-6',
  name: 'partial property'
};

export default [fullProperty, propertyB, propertyC, propertyD, propertyE];
