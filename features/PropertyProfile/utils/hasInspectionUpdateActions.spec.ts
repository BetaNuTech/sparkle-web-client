import {
  admin,
  corporate,
  teamLead,
  propertyMember,
  noAccess
} from '../../../__mocks__/users';
import hasInspectionUpdateActions from './hasInspectionUpdateActions';

describe('Unit | Property Profile | Utils | Has inspection Update Actions', () => {
  test('it should allow all users to have inspection actions for unit # updates', () => {
    const expected = [true, true, true, true, true];

    const actual = [
      hasInspectionUpdateActions(admin),
      hasInspectionUpdateActions(corporate),
      hasInspectionUpdateActions(teamLead),
      hasInspectionUpdateActions(propertyMember),
      hasInspectionUpdateActions(noAccess)
    ];
    expect(actual).toEqual(expected);
  });
});
