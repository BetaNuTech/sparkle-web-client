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
});
