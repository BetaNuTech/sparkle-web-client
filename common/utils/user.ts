import userModel from '../models/user';

// Collect user's first/last names and titlize them
export const getUserFullname = (user: userModel): string =>
  [`${user.firstName || ''}`.trim(), `${user.lastName || ''}`.trim()]
    .map((s) => s.slice(0, 1).toUpperCase() + s.slice(1).toLowerCase())
    .join(' ')
    .trim();
