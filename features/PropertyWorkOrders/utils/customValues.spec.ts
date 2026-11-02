import customValues from '../../../__mocks__/yardi/customValues';
import {
  getCategoryNames,
  getEmployeeName,
  getEmployees,
  getReasons,
  getStatusNames,
  getSubCategories,
  isReasonRequired,
  toAssigneeLabels,
  toAssigneeSummary,
  toDisplayValue
} from './customValues';

describe('Unit | Features | Property Work Orders | Utils | Custom Values', () => {
  test('it restores the custom values casing of a lowercased value', () => {
    const tests = [
      { value: 'high', expected: 'High' },
      { value: 'High', expected: 'High' },
      { value: 'unknown', expected: 'unknown' },
      { value: '', expected: '' }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { value, expected } = tests[i];
      const actual = toDisplayValue(customValues.priorities, value);
      expect(actual).toEqual(expected);
    }
  });

  test('it only returns real sub categories of a category', () => {
    const tests = [
      { category: 'Plumbing', expected: ['Leak', 'Clog'] },
      { category: 'plumbing', expected: ['Leak', 'Clog'] },
      { category: 'Electrical', expected: [] },
      { category: 'Doors', expected: [] },
      { category: 'Unknown', expected: [] },
      { category: '', expected: [] }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { category, expected } = tests[i];
      const actual = getSubCategories(customValues, category);
      expect(actual).toEqual(expected);
    }
  });

  test('it returns the reasons belonging to a status', () => {
    const expected = ['Awaiting parts', 'Resident unavailable'];
    const actual = getReasons(customValues, 'on hold').map((r) => r.reason);
    expect(actual).toEqual(expected);
    expect(getReasons(customValues, 'Call')).toEqual([]);
    expect(getReasons(customValues, '')).toEqual([]);
  });

  test('it requires a reason only when a status has a required reason', () => {
    const tests = [
      { status: 'On Hold', expected: true },
      { status: 'Canceled', expected: false },
      { status: 'Call', expected: false }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { status, expected } = tests[i];
      const actual = isReasonRequired(customValues, status);
      expect(actual).toEqual(expected);
    }
  });

  test('it lists status and category names', () => {
    expect(getStatusNames(customValues)).toContain('Canceled');
    expect(getCategoryNames(customValues)).toEqual([
      'Plumbing',
      'Electrical',
      'Doors'
    ]);
    expect(getStatusNames(null)).toEqual([]);
    expect(getCategoryNames(null)).toEqual([]);
  });

  test('it names assignees from the employees list and falls back to the code', () => {
    expect(getEmployees(customValues)).toHaveLength(3);
    expect(getEmployeeName(customValues, 'Y1001249')).toEqual('David Ramirez');
    expect(getEmployeeName(customValues, 'y9999')).toEqual('y9999');
    expect(
      toAssigneeLabels(customValues, [
        { code: 'y1001249', hours: 2 },
        { code: 'y1001290' },
        { code: 'y9999', hours: 0 }
      ])
    ).toEqual(['David Ramirez (2 h)', 'Victor Olivo', 'y9999']);
    expect(
      toAssigneeLabels({ ...customValues, employees: undefined }, [])
    ).toEqual([]);
  });

  test('it summarises assignees on one line or says Unassigned', () => {
    expect(
      toAssigneeSummary(customValues, [
        { code: 'y1001249', hours: 2 },
        { code: 'y1001290' }
      ])
    ).toEqual('David Ramirez (2 h), Victor Olivo');
    expect(toAssigneeSummary(customValues, [])).toEqual('Unassigned');
    expect(toAssigneeSummary(customValues, undefined)).toEqual('Unassigned');
  });
});
