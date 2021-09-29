import sinon from 'sinon';
import moment from 'moment';
import getLastInspectionEntry from './getLastInspectionEntry';
import { fullProperty } from '../../../__mocks__/properties';
import deepClone from '../../../__tests__/helpers/deepClone';

describe('Spec | Properties | Utils | Calculate Last Inspections', () => {
  afterEach(() => sinon.restore());

  test('it should return empty for no inspection at property', () => {
    const property = deepClone(fullProperty);
    property.numOfInspections = 0;
    const expected = 'No Inspections';

    const actual = getLastInspectionEntry(property);
    expect(actual).toEqual(expected);
  });

  test('it should return last inspection at property singular', () => {
    const expected = true;
    const regExp = /1 Entry \[ Last: \d{1,2}%, Jul \d{1,2} \]/;
    const property = deepClone(fullProperty);
    property.lastInspectionScore = 92.7;
    property.lastInspectionDate = moment('2021-07-07').unix();
    property.numOfInspections = 1;

    const result = getLastInspectionEntry(property);
    const actual = regExp.test(result);
    expect(actual).toEqual(expected);
  });

  test('it should return last inspection at property plural', () => {
    const expected = true;
    const regExp = /3 Entries \[ Last: \d{1,2}%, Jul \d{1,2} \]/;
    const property = deepClone(fullProperty);
    property.lastInspectionScore = 92.7;
    property.lastInspectionDate = moment('2021-07-07').unix();
    property.numOfInspections = 3;

    const result = getLastInspectionEntry(property);
    const actual = regExp.test(result);
    expect(actual).toEqual(expected);
  });
});
