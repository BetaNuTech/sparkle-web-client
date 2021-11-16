import yardiResident from '../../common/models/yardi/resident';

export const yardiResidentOne: yardiResident = {
  id: 'yardi-resident-1',
  email: 'amy@123.com',
  eviction: false,
  firstName: 'amy',
  homeNumber: '4444444444',
  lastName: 'Hutcherson',
  lastNote: 'final word',
  lastNoteUpdatedAt: 0,
  leaseFrom: '2021-07-07T00:00:00',
  leaseSqFt: '1068',
  leaseTo: '2022-07-06T00:00:00',
  leaseUnit: '0123',
  middleName: 'Hubert',
  mobileNumber: '6666666666',
  moveIn: '2017-11-11T00:00:00',
  officeNumber: '8888888888',
  paymentPlan: false,
  paymentPlanDelinquent: false,
  status: 'current resident',
  totalCharges: 0,
  totalOwed: 0,
  yardiStatus: 'current',
  sortLeaseUnit: 1,
  occupants: ['yardi-occupant-1']
};

export const yardiResidentTwo: yardiResident = {
  id: 'yardi-resident-2',
  email: 'jake@123.com',
  eviction: false,
  firstName: 'jake',
  homeNumber: '4444444444',
  lastName: 'Blane',
  lastNote: 'final word',
  lastNoteUpdatedAt: 0,
  leaseFrom: '2021-07-07T00:00:00',
  leaseSqFt: '1068',
  leaseTo: '2022-07-06T00:00:00',
  leaseUnit: '0123',
  middleName: 'Hubert',
  mobileNumber: '6666666666',
  moveIn: '2017-11-11T00:00:00',
  officeNumber: '8888888888',
  paymentPlan: false,
  paymentPlanDelinquent: false,
  status: 'current resident',
  totalCharges: 0,
  totalOwed: 0,
  yardiStatus: 'current',
  sortLeaseUnit: 1,
  occupants: ['yardi-occupant-2']
};

export default [yardiResidentOne, yardiResidentTwo];
