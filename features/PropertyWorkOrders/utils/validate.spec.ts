import customValues from '../../../__mocks__/yardi/customValues';
import validateWorkOrder, { errorMessages } from './validate';

describe('Unit | Features | Property Work Orders | Utils | Validate', () => {
  test('it requires a unit only when creating', () => {
    expect(validateWorkOrder({}, customValues, true).unit).toEqual(
      errorMessages.unitRequired
    );
    expect(validateWorkOrder({ unit: ' ' }, customValues, true).unit).toEqual(
      errorMessages.unitRequired
    );
    expect(validateWorkOrder({}, customValues, false).unit).toBeUndefined();
  });

  test('it rejects values longer than yardi allows', () => {
    const actual = validateWorkOrder(
      {
        unit: '123456789',
        briefDescription: 'a'.repeat(36),
        description: 'a'.repeat(1500)
      },
      customValues
    );
    expect(actual.unit).toEqual(errorMessages.tooLong(8));
    expect(actual.briefDescription).toEqual(errorMessages.tooLong(35));
    expect(actual.description).toBeUndefined();
  });

  test('it requires a reason for statuses with required reasons', () => {
    expect(
      validateWorkOrder({ status: 'On Hold' }, customValues).reason
    ).toEqual(errorMessages.reasonRequired);
    expect(
      validateWorkOrder(
        { status: 'On Hold', reason: 'Awaiting parts' },
        customValues
      ).reason
    ).toBeUndefined();
    expect(
      validateWorkOrder({ status: 'Canceled' }, customValues).reason
    ).toBeUndefined();
  });

  test('it validates due date and requestor email formats', () => {
    const actual = validateWorkOrder(
      { dueDate: '10/26/2026', requestorEmail: 'nope' },
      customValues
    );
    expect(actual.dueDate).toEqual(errorMessages.dueDateFormat);
    expect(actual.requestorEmail).toEqual(errorMessages.emailFormat);

    const valid = validateWorkOrder(
      { dueDate: '2026-10-26', requestorEmail: 'a@b.co' },
      customValues
    );
    expect(valid).toEqual({});
  });
});
