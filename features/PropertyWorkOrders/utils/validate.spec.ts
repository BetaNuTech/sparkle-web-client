import customValues from '../../../__mocks__/yardi/customValues';
import validateWorkOrder, { errorMessages, todayIsoDate } from './validate';

describe('Unit | Features | Property Work Orders | Utils | Validate', () => {
  test('it never requires a unit, but a request without one needs a summary', () => {
    expect(validateWorkOrder({}, customValues, true).unit).toBeUndefined();
    expect(validateWorkOrder({}, customValues, true).briefDescription).toEqual(
      errorMessages.summaryRequired
    );
    expect(
      validateWorkOrder(
        { unit: ' ', briefDescription: ' ' },
        customValues,
        true
      ).briefDescription
    ).toEqual(errorMessages.summaryRequired);
    expect(
      validateWorkOrder({ briefDescription: 'Pool gate' }, customValues, true)
        .briefDescription
    ).toBeUndefined();
    expect(
      validateWorkOrder({ unit: '1724' }, customValues, true).briefDescription
    ).toBeUndefined();
    expect(
      validateWorkOrder({}, customValues, false).briefDescription
    ).toBeUndefined();
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
      customValues,
      false,
      '2026-10-26'
    );
    expect(valid).toEqual({});
  });

  it('should reject a due date before today and accept today or later', () => {
    const past = validateWorkOrder(
      { dueDate: '2026-10-26' } as any,
      customValues,
      true,
      '2026-10-27'
    );
    expect(past.dueDate).toEqual(errorMessages.dueDatePast);

    const today = validateWorkOrder(
      { dueDate: '2026-10-27' } as any,
      customValues,
      true,
      '2026-10-27'
    );
    expect(today.dueDate).toBeUndefined();

    const later = validateWorkOrder(
      { dueDate: '2027-01-01' } as any,
      customValues,
      true,
      '2026-10-27'
    );
    expect(later.dueDate).toBeUndefined();
  });

  it('should format today as a local YYYY-MM-DD date', () => {
    expect(todayIsoDate(new Date(2026, 0, 5, 23, 59))).toEqual('2026-01-05');
  });
});
