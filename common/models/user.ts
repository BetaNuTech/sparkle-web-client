interface user {
  id: string;
  admin: boolean;
  corporate: boolean;
  email: string;
  firstName: string;
  lastName: string;
  pushOptOut: boolean;
  properties?: any;

  /**
   * Property level access granted via team associations
   * NOTE: property associations w/ teams are nested under
   *       their team ID: `{ teamId: { propertyId: true } }`
   */
  teams?: any;

  // UNIX timestame of creation date
  createdAt: number;

  // UNIX timestamp of last login
  lastSignInDate?: number;

  // User agent string of last sign up OS/Browser
  lastUserAgent?: string;
}

export default user;
