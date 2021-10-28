import { renderHook } from '@testing-library/react-hooks';
import { shuffle } from '.../../../__tests__/helpers/array';
import mockInspections from '../../../__mocks__/inspections';
import deepClone from '../../../__tests__/helpers/deepClone';
import useInspectionSorting from './useInspectionSorting';

describe('Unit | Features | Property Profile | Hooks | Use Inspection Sorting', () => {
  it('automatically sorts by descending inspection creation date for desktop users', async () => {
    const times = [1625244317, 1625244316, 1625244315];
    const expected = times.map((c) => `${c}`).join(' | ');
    const inspections = deepClone(mockInspections);
    shuffle(times).forEach((time, i) => {
      if (inspections[i]) {
        inspections[i].creationDate = time;
      }
    });

    const { result } = renderHook(() =>
      useInspectionSorting('', [], inspections)
    );
    const { sortedInspections } = result.current;

    const actual = sortedInspections
      .map((item) => item.creationDate)
      .join(' | ');
    expect(actual).toEqual(expected);
  });

  it('sorts inspections by inspector name', async () => {
    const inspectors = ['matt jensen', 'john wick', 'aaron thompson'];
    const expected = inspectors.map((c) => `${c.toLowerCase()}`).join(' | ');
    const inspections = deepClone(mockInspections);
    inspectors.forEach((inspector, i) => {
      if (inspections[i]) {
        inspections[i].inspectorName = inspector;
      }
    });
    let result;
    renderHook(() => {
      const { sortedInspections, onSortChange } = useInspectionSorting(
        '',
        [],
        inspections
      );

      onSortChange('inspectorName');
      result = sortedInspections;
    });
    const actual = result.map((item) => item.inspectorName).join(' | ');
    expect(actual).toEqual(expected);
  });
});
