import {
  admin,
  corporate,
  teamLead,
  propertyMember,
  noAccess
} from '../../../__mocks__/users';
import hasInspectionUpdateActions from './hasInspectionUpdateActions';

describe('Unit | Property Profile | Utils | Has inspection Update Actions', () => {
  test('it should only allow admins to hav inspection actions permission', () => {
    const expected = [true, false, false, false, false];

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
