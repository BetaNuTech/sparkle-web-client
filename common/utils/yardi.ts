export interface YardiContact {
  name: string;
  category: string;
  subCategory: string;
  value: string;
}

// Any type like a yardi
// resident, work order, or occupant
export interface YardiDocument {
  requestorName?: string;
  requestorEmail?: string;
  requestorPhone?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  homeNumber?: string;
  officeNumber?: string;
  mobileNumber?: string;
}

/**
 * Convert an occupant,
 * resident, or work order
 * to a contact record
 * @param  {Object} source
 * @return {Contact[]} - contacts
 */
export function toContacts(source: YardiDocument): YardiContact[] {
  const results = [];
  const name = [
    source.requestorName,
    source.firstName,
    source.middleName,
    source.lastName
  ]
    .filter(Boolean)
    .join(' ');

  if (source.email) {
    results.push({
      name,
      category: 'email',
      subCategory: '',
      value: source.email
    });
  }

  if (source.requestorEmail) {
    results.push({
      name,
      category: 'email',
      subCategory: '',
      value: source.requestorEmail
    });
  }

  if (source.homeNumber) {
    results.push({
      name,
      category: 'phone',
      subCategory: 'H', // home number
      value: source.homeNumber
    });
  }

  if (source.officeNumber) {
    results.push({
      name,
      category: 'phone',
      subCategory: 'O', // office number
      value: source.officeNumber
    });
  }

  if (source.mobileNumber) {
    results.push({
      name,
      category: 'phone',
      subCategory: 'M',
      value: source.mobileNumber
    });
  }

  if (source.requestorPhone) {
    results.push({
      name,
      category: 'phone',
      subCategory: '',
      value: source.requestorPhone
    });
  }

  return results;
}
