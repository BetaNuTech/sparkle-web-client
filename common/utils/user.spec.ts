import sinon from 'sinon';
import { admin } from '../../__mocks__/users';
import deepClone from '../../__tests__/helpers/deepClone';
import * as util from './user';

describe('Unit | Common | Utils | User', () => {
  afterEach(() => sinon.restore());

  test('it should return titlized first name only when no last name present', () => {
    const expected = 'Admin';
    const user = deepClone(admin);
    user.firstName = 'admin';
    user.lastName = '';
    const actual = util.getUserFullname(user);
    expect(actual).toEqual(expected);
  });

  test('it should return titlized full name when first and last name present', () => {
    const expected = 'Admin User';
    const user = deepClone(admin);
    user.firstName = 'admin';
    user.lastName = 'user';
    const actual = util.getUserFullname(user);
    expect(actual).toEqual(expected);
  });
});
