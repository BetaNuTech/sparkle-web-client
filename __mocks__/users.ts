import userModel from '../common/models/user';

export const admin: userModel = {
  id: 'user-1',
  admin: true,
  corporate: false,
  email: 'admin@gmail.com',
  firstName: 'admin',
  lastName: 'user',
  pushOptOut: false,
  createdAt: 1624289498,
  lastSignInDate: 1624299410,
  lastUserAgent: 'Web · OS X · Chrome (Sparkle v0.1.0)'
};

export const corporate: userModel = {
  id: 'user-2',
  admin: false,
  corporate: true,
  email: 'corporate@gmail.com',
  firstName: 'corporate',
  lastName: 'user',
  pushOptOut: false,
  createdAt: 1624289498,
  lastSignInDate: 1624299410,
  lastUserAgent: 'Web · OS X · Chrome (Sparkle v0.1.0)'
};

export const teamLead: userModel = {
  id: 'user-3',
  admin: false,
  corporate: true,
  email: 'team-lead@gmail.com',
  firstName: 'team',
  lastName: 'lead',
  pushOptOut: false,
  createdAt: 1624289498,
  lastSignInDate: 1624299410,
  teams: {
    'team-1': {
      'property-1': true
    }
  },
  lastUserAgent: 'Web · OS X · Chrome (Sparkle v0.1.0)'
};

export const teamMember: userModel = {
  id: 'user-4',
  admin: false,
  corporate: false,
  email: 'team-member@gmail.com',
  firstName: 'team',
  lastName: 'member',
  pushOptOut: false,
  createdAt: 1624289498,
  lastSignInDate: 1624299410,
  teams: {
    'team-1': true
  },
  properties: {
    'property-1': true
  },
  lastUserAgent: 'Web · OS X · Chrome (Sparkle v0.1.0)'
};

export const propertyMember: userModel = {
  id: 'user-5',
  admin: false,
  corporate: false,
  email: 'property-member@gmail.com',
  firstName: 'property',
  lastName: 'member',
  pushOptOut: false,
  createdAt: 1624289498,
  lastSignInDate: 1624299410,
  properties: {
    'property-1': true
  },
  lastUserAgent: 'Web · OS X · Chrome (Sparkle v0.1.0)'
};

export const noAccess: userModel = {
  id: 'user-6',
  admin: false,
  corporate: false,
  email: 'no-access@gmail.com',
  firstName: 'no',
  lastName: 'access',
  pushOptOut: false,
  createdAt: 1624289498,
  lastSignInDate: 1624299410,
  lastUserAgent: 'Web · OS X · Chrome (Sparkle v0.1.0)'
};

export default [
  admin,
  corporate,
  teamLead,
  teamMember,
  propertyMember,
  noAccess
];
