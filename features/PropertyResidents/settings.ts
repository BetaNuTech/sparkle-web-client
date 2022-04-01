export default {
  residentAttributes: [
    'email',
    'eviction',
    'firstName',
    'homeNumber',
    'lastName',
    'lastNote',
    'leaseFrom',
    'leaseSqFt',
    'leaseTo',
    'leaseUnit',
    'middleName',
    'mobileNumber',
    'moveIn',
    'paymentPlan',
    'paymentPlanDelinquent',
    'status',
    'totalCharges',
    'totalOwed',
    'yardiStatus',
    'sortLeaseUnit',
    'sortLeaseUnit'
  ],
  selectableSorts: ['leaseUnit', 'id', 'firstName', 'lastName', 'yardiStatus'],
  sortTypes: {
    leaseUnit: 'number',
    id: 'string',
    firstName: 'string',
    lastName: 'string',
    yardiStatus: 'string'
  },
  userFriendlySortNames: {
    leaseUnit: 'Unit',
    id: 'Resident ID',
    firstName: 'Resident First Name',
    lastName: 'Resident Last Name',
    yardiStatus: 'Current Status'
  },
  filterOrder: ['all', 'current', 'future', 'eviction', 'notice', 'vacant']
};
