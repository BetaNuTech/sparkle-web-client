import sinon from 'sinon';
import moment from 'moment';
import date from './date';

describe('Unit | Common | Utils | Date', () => {
  afterEach(() => sinon.restore());

  test('it converts a timestamp to user date time display format', () => {
    const expected = true;
    const result = date.toUserDateTimeDisplay(1622676604);
    const actual = /\d\d\/\d\d\/\d\d,\s\d{1,2}:\d\d\s(AM|PM)/.test(result);
    expect(actual).toEqual(expected);
  });

  test('it creates user date time display formatted date from current timestamp when none provided', () => {
    const expected = false;
    const sinonUnix = sinon.stub(moment, 'unix').callThrough();
    date.toUserDateTimeDisplay();
    const actual = sinonUnix.called;
    expect(actual).toEqual(expected);
  });

  test('it converts a timestamp to user date display format', () => {
    const expected = true;
    const result = date.toUserDateDisplay(1622676604);
    const actual = /\d\d\/\d\d\/\d\d/.test(result);
    expect(actual).toEqual(expected);
  });

  test('it converts a timestamp to user date display format with full year', () => {
    const expected = true;
    const result = date.toUserDateDisplayWithFullYear(1622676604);
    const actual = /\d\d\/\d\d\/\d\d\d\d/.test(result);
    expect(actual).toEqual(expected);
  });

  test('it creates user date display formatted date from current timestamp when none provided', () => {
    const expected = false;
    const sinonUnix = sinon.stub(moment, 'unix').callThrough();
    date.toUserDateDisplay();
    const actual = sinonUnix.called;
    expect(actual).toEqual(expected);
  });

  test('it converts a timestamp to user time display format', () => {
    const expected = true;
    const result = date.toUserTimeDisplay(1622676604);
    const actual = /\d{1,2}:\d\d\s(AM|PM)/.test(result);
    expect(actual).toEqual(expected);
  });

  test('it creates user time display formatted date from current timestamp when none provided', () => {
    const expected = false;
    const sinonUnix = sinon.stub(moment, 'unix').callThrough();
    date.toUserTimeDisplay();
    const actual = sinonUnix.called;
    expect(actual).toEqual(expected);
  });

  test('it creates a full month, partial day, full year date formatted time', () => {
    const expected = true;
    const result = date.toUserFullDateDisplay(1595350271);
    const actual = /\w+\s\d{1,2},\s\d\d\d\d/.test(result);
    expect(actual).toEqual(expected);
  });

  test('it converts a ISO date string to a unix timestamp', () => {
    const expected = 1595350271;
    const actual = date.isoToTimestamp('2020-07-21T16:51:11+00:00');
    expect(actual).toEqual(expected);
  });

  test('it converts a ISO date string to a unix timestamp', () => {
    const expected = -5;
    const unixTimeStamp = moment().subtract(5, 'minutes').unix();
    const actual = date.getTimeDifferenceInMinutes(unixTimeStamp);
    expect(actual).toEqual(expected);
  });
});
