import { renderHook } from '@testing-library/react-hooks';
import mockInspections from '../../../__mocks__/inspections';
import deepClone from '../../../__tests__/helpers/deepClone';
import useInspectionFilter from './useInspectionFilter';

describe('Unit | Features | Property Profile | Hooks | Use Inspection Filter', () => {
  test('should return all items if no filter was applied', () => {
    const expected = 3;
    const inspections = deepClone(mockInspections);
    const { result } = renderHook(() => useInspectionFilter('', inspections));
    const { filteredInspections } = result.current;

    const actual = filteredInspections.length;
    expect(actual).toEqual(expected);
  });

  test('should return 2 items if completed filter was applied', () => {
    const expected = 2;
    const inspections = deepClone(mockInspections);
    const { result } = renderHook(() =>
      useInspectionFilter('completed', inspections)
    );
    const { filteredInspections } = result.current;

    const actual = filteredInspections.length;
    expect(actual).toEqual(expected);
  });

  test('should return 1 items if incomplete filter was applied', () => {
    const expected = 1;
    const inspections = deepClone(mockInspections);
    const { result } = renderHook(() =>
      useInspectionFilter('incomplete', inspections)
    );
    const { filteredInspections } = result.current;

    const actual = filteredInspections.length;
    expect(actual).toEqual(expected);
  });

  test('should return 1 items if deficiencies exsist filter was applied', () => {
    const expected = 1;
    const inspections = deepClone(mockInspections);
    const { result } = renderHook(() =>
      useInspectionFilter('deficienciesExist', inspections)
    );
    const { filteredInspections } = result.current;

    const actual = filteredInspections.length;
    expect(actual).toEqual(expected);
  });
});
