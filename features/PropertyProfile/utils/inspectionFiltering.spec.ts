import {
  activeInspectionFilterName,
  getInspectionNoRecordText,
  nextInspectionsFilter
} from './inspectionFiltering';

describe('Spec | Property Profile | Utils | Inspection Filtering', () => {
  test('it should return empty text for no filter', () => {
    const expected = '';

    const actual = activeInspectionFilterName('');
    expect(actual).toEqual(expected);
  });

  test('it should return Completed text for completed filter', () => {
    const expected = 'Completed';

    const actual = activeInspectionFilterName('completed');
    expect(actual).toEqual(expected);
  });

  test('it should return Incomplete text for incomplete filter', () => {
    const expected = 'Incomplete';

    const actual = activeInspectionFilterName('incomplete');
    expect(actual).toEqual(expected);
  });

  test('it should return Deficiencies Exist text for deficiencies filter', () => {
    const expected = 'Deficiencies Exist';

    const actual = activeInspectionFilterName('deficienciesExist');
    expect(actual).toEqual(expected);
  });

  test('it should return No completed Inspections text for completed filter if no records found', () => {
    const expected = 'No completed Inspections';

    const actual = getInspectionNoRecordText('completed');
    expect(actual).toEqual(expected);
  });

  test('it should return No incomplete Inspections text for incomplete filter if no records found', () => {
    const expected = 'No incomplete Inspections';

    const actual = getInspectionNoRecordText('incomplete');
    expect(actual).toEqual(expected);
  });

  test('it should return No deficient Inspections text for deficienciesExist filter if no records found', () => {
    const expected = 'No deficient Inspections';

    const actual = getInspectionNoRecordText('deficienciesExist');
    expect(actual).toEqual(expected);
  });

  test('it should return completed when empty string given while finding next filter params', () => {
    const expected = 'completed';

    const actual = nextInspectionsFilter('');
    expect(actual).toEqual(expected);
  });

  test('it should return incomplete when completed string given while finding next filter params', () => {
    const expected = 'incomplete';

    const actual = nextInspectionsFilter('completed');
    expect(actual).toEqual(expected);
  });

  test('it should return deficienciesExist when incomplete string given while finding next filter params', () => {
    const expected = 'deficienciesExist';

    const actual = nextInspectionsFilter('incomplete');
    expect(actual).toEqual(expected);
  });

  test('it should return empty string when deficiencies exist string given while finding next filter params', () => {
    const expected = '';

    const actual = nextInspectionsFilter('deficienciesExist');
    expect(actual).toEqual(expected);
  });
});
