interface yardiOccupant {
  id?: string;
  email?: string;
  firstName?: string;
  homeNumber?: string;
  lastName?: string;
  middleName?: string;
  mobileNumber?: string;
  officeNumber?: string;
  relationship?: string;
  responsibleForLease: boolean;
  resident: string; // relationship
}

export default yardiOccupant;
