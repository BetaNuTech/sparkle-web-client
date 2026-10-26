import customValues from '../../../__mocks__/yardi/customValues';
import { yardiWorkOrderOne } from '../../../__mocks__/yardi/workOrders';
import { toFormValues, toPayload, EMPTY_FORM_VALUES } from './formValues';

describe('Unit | Features | Property Work Orders | Work Order Edit | Form Values', () => {
  test('it loads empty form values for a new work order', () => {
    expect(toFormValues(null, customValues)).toEqual(EMPTY_FORM_VALUES);
  });

  test('it restores picker casing when loading a work order', () => {
    const workOrder = {
      ...yardiWorkOrderOne,
      priority: 'high',
      category: 'plumbing',
      subCategory: 'leak',
      status: 'on hold'
    };
    const actual = toFormValues(workOrder, customValues);
    expect(actual.priority).toEqual('High');
    expect(actual.category).toEqual('Plumbing');
    expect(actual.subCategory).toEqual('Leak');
    expect(actual.status).toEqual('On Hold');
    expect(actual.unit).toEqual('1724');
    expect(actual.permissionToEnter).toEqual(false);
    expect(actual.reason).toEqual('');
  });

  test('it only sends set attributes when creating', () => {
    const expected = {
      unit: '1724',
      description: 'Leak',
      permissionToEnter: true
    };
    const actual = toPayload(
      {
        ...EMPTY_FORM_VALUES,
        unit: ' 1724 ',
        description: 'Leak',
        permissionToEnter: true
      },
      null
    );
    expect(actual).toEqual(expected);
  });

  test('it only sends changed attributes when updating', () => {
    const original = toFormValues(yardiWorkOrderOne, customValues);
    const expected = {
      status: 'Canceled',
      reason: 'Duplicate',
      tenantCaused: true
    };
    const actual = toPayload(
      {
        ...original,
        status: 'Canceled',
        reason: 'Duplicate',
        tenantCaused: true
      },
      original
    );
    expect(actual).toEqual(expected);
    expect(toPayload(original, original)).toEqual({});
  });

  test('it sends a cleared attribute as an empty string when updating', () => {
    const original = toFormValues(yardiWorkOrderOne, customValues);
    const actual = toPayload({ ...original, technicianNotes: '' }, original);
    expect(actual).toEqual({ technicianNotes: '' });
  });
});
