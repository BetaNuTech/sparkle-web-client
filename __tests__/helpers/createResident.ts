import ResidentModel from '../../common/models/yardi/resident';

const createResident = (
  id: string,
  config: Record<string, any>
): ResidentModel => {
  const now = new Date().toISOString();

  return {
    id,
    firstName: 'first',
    middleName: 'middle',
    lastName: 'last',
    email: 'test@email.com',
    mobileNumber: '12345678910',
    homeNumber: '12345678911',
    officeNumber: '12345678912',
    status: 'current resident',
    yardiStatus: 'current',
    leaseUnit: '1235',
    leaseSqFt: '123',
    leaseFrom: now,
    leaseTo: now,
    moveIn: now,
    occupants: [],
    ...config
  };
};

export default createResident;
