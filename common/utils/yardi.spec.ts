import { yardiWorkOrderOne } from '../../__mocks__/yardi/workOrders';
import { yardiResidentOne } from '../../__mocks__/yardi/residents';
import { yardiOccupantOne } from '../../__mocks__/yardi/occupants';
import * as util from './yardi';

describe('Unit | Common | Utils | Yardi', () => {
  test('it creates a list of all discoverable contact information for a yardi occupant', () => {
    const expected = 4;
    const actual = util.toContacts(yardiOccupantOne).length;
    expect(actual).toEqual(expected);
  });

  test('it creates a list of all discoverable contact information for a yardi resident', () => {
    const expected = 4;
    const actual = util.toContacts(yardiResidentOne).length;
    expect(actual).toEqual(expected);
  });

  test('it creates a list of all discoverable contact information for a yardi work order', () => {
    const expected = 2;
    const actual = util.toContacts(yardiWorkOrderOne).length;
    expect(actual).toEqual(expected);
  });
});
