import yardiOccupant from '../../common/models/yardi/occupant';

export const yardiOccupantOne: yardiOccupant = {
  id: 'yardi-occupant-1',
  email: 'email@mock.com',
  firstName: 'Kyle',
  homeNumber: '5555555555',
  lastName: 'Simpson',
  middleName: 'Gene',
  mobileNumber: '8888888888',
  officeNumber: '7777777777',
  relationship: 'guarantor',
  responsibleForLease: false,
  resident: 'yardi-resident-1'
};

export const yardiOccupantTwo: yardiOccupant = {
  id: 'yardi-occupant-2',
  email: 'email2@mock.com',
  firstName: 'John',
  homeNumber: '5555555555',
  lastName: 'Johnson',
  middleName: 'Aaron',
  mobileNumber: '8888888888',
  officeNumber: '7777777777',
  relationship: 'guarantor',
  responsibleForLease: false,
  resident: 'yardi-resident-2'
};

export default [yardiOccupantOne, yardiOccupantTwo];
