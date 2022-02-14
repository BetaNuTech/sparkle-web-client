import { ChangeEvent } from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';
import moment from 'moment';

import createDeficientItem from '../../../__tests__/helpers/createDeficientItem';
import DeficientItem from '../../../common/models/deficientItem';
import { shuffle } from '../../../__tests__/helpers/array';
import useSorting from './useSorting';

import { deficientItemResponsibilityGroups } from '../../../config/deficientItems';

describe('Unit | features | Deficient Items | Hooks | useSorting', () => {
  test('should sort deficient items by updated date from newest to oldest date', () => {
    const expected = [1, 2, 3, 4, 5, 6];

    const currentDate = moment();
    const dueDates = [
      currentDate.unix(),
      currentDate.subtract('1', 'day').unix(),
      currentDate.subtract('2', 'day').unix(),
      currentDate.subtract('3', 'day').unix(),
      currentDate.subtract('4', 'day').unix(),
      0
    ];
    const deficientItems = shuffle([
      createDeficientItem({ state: 'pending', updatedAt: dueDates[0], id: 1 }),
      createDeficientItem({ state: 'pending', updatedAt: dueDates[1], id: 2 }),
      createDeficientItem({ state: 'pending', updatedAt: dueDates[2], id: 3 }),
      createDeficientItem({ state: 'pending', updatedAt: dueDates[3], id: 4 }),
      createDeficientItem({ state: 'pending', updatedAt: dueDates[4], id: 5 }),
      createDeficientItem({ state: 'pending', updatedAt: dueDates[5], id: 6 })
    ]);

    const { result } = renderHook(() => useSorting(deficientItems, 'desc'));

    const { sortedDeficientItems } = result.current;

    sortedDeficientItems.forEach((item: DeficientItem, i: number) => {
      expect(item.id).toEqual(expected[i]);
    });
  });

  test('should sort deficient items by updated date from oldest to newest date', () => {
    const expected = [6, 5, 4, 3, 2, 1];

    const currentDate = moment();
    const dueDates = [
      currentDate.unix(),
      currentDate.subtract('1', 'day').unix(),
      currentDate.subtract('2', 'day').unix(),
      currentDate.subtract('3', 'day').unix(),
      currentDate.subtract('4', 'day').unix(),
      0
    ];
    const deficientItems = shuffle([
      createDeficientItem({ state: 'pending', updatedAt: dueDates[0], id: 1 }),
      createDeficientItem({ state: 'pending', updatedAt: dueDates[1], id: 2 }),
      createDeficientItem({ state: 'pending', updatedAt: dueDates[2], id: 3 }),
      createDeficientItem({ state: 'pending', updatedAt: dueDates[3], id: 4 }),
      createDeficientItem({ state: 'pending', updatedAt: dueDates[4], id: 5 }),
      createDeficientItem({ state: 'pending', updatedAt: dueDates[5], id: 6 })
    ]);

    const { result } = renderHook(() => useSorting(deficientItems, 'desc'));
    act(() => {
      result.current.onSortDirChange();
    });

    const { sortedDeficientItems } = result.current;
    sortedDeficientItems.forEach((item: DeficientItem, i: number) => {
      expect(item.id).toEqual(expected[i]);
    });
  });

  test('should sort deficient items by current due date or current deferred date from newest to oldest date', () => {
    const expected = [1, 2, 3, 4, 5, 6];

    const currentDate = moment();
    const dueDates = [
      currentDate.unix(),
      currentDate.subtract('1', 'day').unix(),
      currentDate.subtract('2', 'day').unix(),
      currentDate.subtract('3', 'day').unix(),
      currentDate.subtract('4', 'day').unix(),
      0
    ];
    const deficientItems = shuffle([
      createDeficientItem({
        state: 'pending',
        currentDueDate: dueDates[0],
        id: 1
      }),
      createDeficientItem({
        state: 'pending',
        currentDueDate: dueDates[1],
        id: 2
      }),
      createDeficientItem({
        state: 'pending',
        currentDeferredDate: dueDates[2],
        currentDueDate: null,
        id: 3
      }),
      createDeficientItem({
        state: 'pending',
        currentDueDate: dueDates[3],
        id: 4
      }),
      createDeficientItem({
        state: 'pending',
        currentDeferredDate: dueDates[4],
        currentDueDate: null,
        id: 5
      }),
      createDeficientItem({
        state: 'pending',
        currentDueDate: dueDates[5],
        id: 6
      })
    ]);

    const { result } = renderHook(() => useSorting(deficientItems, 'desc'));
    act(() => {
      result.current.onSortChange({
        target: { value: 'finalDueDate' }
      } as ChangeEvent<HTMLSelectElement>);
    });

    const { sortedDeficientItems } = result.current;
    sortedDeficientItems.forEach((item: DeficientItem, i: number) => {
      expect(item.id).toEqual(expected[i]);
    });
  });

  test('should sort deficient items by current due date or current deferred date from oldest to newest date', () => {
    const expected = [6, 5, 4, 3, 2, 1];

    const currentDate = moment();
    const dueDates = [
      currentDate.unix(),
      currentDate.subtract('1', 'day').unix(),
      currentDate.subtract('2', 'day').unix(),
      currentDate.subtract('3', 'day').unix(),
      currentDate.subtract('4', 'day').unix(),
      0
    ];

    const deficientItems = shuffle([
      createDeficientItem({
        state: 'pending',
        currentDueDate: dueDates[0],
        id: 1
      }),
      createDeficientItem({
        state: 'pending',
        currentDueDate: dueDates[1],
        id: 2
      }),
      createDeficientItem({
        state: 'pending',
        currentDeferredDate: dueDates[2],
        currentDueDate: null,
        id: 3
      }),
      createDeficientItem({
        state: 'pending',
        currentDueDate: dueDates[3],
        id: 4
      }),
      createDeficientItem({
        state: 'pending',
        currentDeferredDate: dueDates[4],
        currentDueDate: null,
        id: 5
      }),
      createDeficientItem({
        state: 'pending',
        currentDueDate: dueDates[5],
        id: 6
      })
    ]);

    const { result } = renderHook(() => useSorting(deficientItems, 'desc'));
    act(() => {
      result.current.onSortChange({
        target: { value: 'finalDueDate' }
      } as ChangeEvent<HTMLSelectElement>);
      result.current.onSortDirChange();
    });
    const { sortedDeficientItems } = result.current;
    sortedDeficientItems.forEach((item: DeficientItem, i: number) => {
      expect(item.id).toEqual(expected[i]);
    });
  });

  // eslint-disable-next-line max-len
  test('should sort deficient items by current due date or current deferred date from oldest to newest date for mobile users', () => {
    const expected = [6, 5, 4, 3, 2, 1];

    const currentDate = moment();
    const dueDates = [
      currentDate.unix(),
      currentDate.subtract('1', 'day').unix(),
      currentDate.subtract('2', 'day').unix(),
      currentDate.subtract('3', 'day').unix(),
      currentDate.subtract('4', 'day').unix(),
      0
    ];
    const deficientItems = shuffle([
      createDeficientItem({
        state: 'pending',
        currentDueDate: dueDates[0],
        id: 1
      }),
      createDeficientItem({
        state: 'pending',
        currentDueDate: dueDates[1],
        id: 2
      }),
      createDeficientItem({
        state: 'pending',
        currentDeferredDate: dueDates[2],
        currentDueDate: null,
        id: 3
      }),
      createDeficientItem({
        state: 'pending',
        currentDueDate: dueDates[3],
        id: 4
      }),
      createDeficientItem({
        state: 'pending',
        currentDeferredDate: dueDates[4],
        currentDueDate: null,
        id: 5
      }),
      createDeficientItem({
        state: 'pending',
        currentDueDate: dueDates[5],
        id: 6
      })
    ]);

    const { result } = renderHook(() => useSorting(deficientItems, 'desc'));
    act(() => {
      result.current.nextDeficientItemSort('finalDueDate');
    });
    const { sortedDeficientItems } = result.current;
    sortedDeficientItems.forEach((item: DeficientItem, i: number) => {
      expect(item.id).toEqual(expected[i]);
    });
  });

  test('should sort deficient items by current responsibility group in A to Z order for mobile users', () => {
    const expected = [1, 2, 3, 4, 5];

    const deficientItems = shuffle([
      createDeficientItem({
        state: 'pending',
        currentResponsibilityGroup: deficientItemResponsibilityGroups[2].value,
        id: 1
      }),
      createDeficientItem({
        state: 'pending',
        currentResponsibilityGroup: deficientItemResponsibilityGroups[3].value,
        id: 2
      }),
      createDeficientItem({
        state: 'pending',
        currentResponsibilityGroup: deficientItemResponsibilityGroups[0].value,
        id: 3
      }),
      createDeficientItem({
        state: 'pending',
        currentResponsibilityGroup: deficientItemResponsibilityGroups[1].value,
        id: 4
      }),
      createDeficientItem({
        state: 'pending',
        currentResponsibilityGroup: '',
        id: 5
      })
    ]);

    const { result } = renderHook(() => useSorting(deficientItems, 'desc'));
    act(() => {
      result.current.nextDeficientItemSort('currentResponsibilityGroup');
    });
    const { sortedDeficientItems } = result.current;
    sortedDeficientItems.forEach((item: DeficientItem, i: number) => {
      expect(item.id).toEqual(expected[i]);
    });
  });

  test('should sort deficient items by current responsibility group in Z to A order ', () => {
    const expected = [5, 4, 3, 2, 1];

    const deficientItems = shuffle([
      createDeficientItem({
        state: 'pending',
        currentResponsibilityGroup: deficientItemResponsibilityGroups[2].value,
        id: 1
      }),
      createDeficientItem({
        state: 'pending',
        currentResponsibilityGroup: deficientItemResponsibilityGroups[3].value,
        id: 2
      }),
      createDeficientItem({
        state: 'pending',
        currentResponsibilityGroup: deficientItemResponsibilityGroups[0].value,
        id: 3
      }),
      createDeficientItem({
        state: 'pending',
        currentResponsibilityGroup: deficientItemResponsibilityGroups[1].value,
        id: 4
      }),
      createDeficientItem({
        state: 'pending',
        currentResponsibilityGroup: '',
        id: 5
      })
    ]);

    const { result } = renderHook(() => useSorting(deficientItems, 'desc'));
    act(() => {
      result.current.onSortChange({
        target: { value: 'currentResponsibilityGroup' }
      } as ChangeEvent<HTMLSelectElement>);
    });
    const { sortedDeficientItems } = result.current;
    sortedDeficientItems.forEach((item: DeficientItem, i: number) => {
      expect(item.id).toEqual(expected[i]);
    });
  });

  test('should sort deficient items by current responsibility group in A to Z order', () => {
    const expected = [1, 2, 3, 4, 5];

    const deficientItems = shuffle([
      createDeficientItem({
        state: 'pending',
        currentResponsibilityGroup: deficientItemResponsibilityGroups[2].value,
        id: 1
      }),
      createDeficientItem({
        state: 'pending',
        currentResponsibilityGroup: deficientItemResponsibilityGroups[3].value,
        id: 2
      }),
      createDeficientItem({
        state: 'pending',
        currentResponsibilityGroup: deficientItemResponsibilityGroups[0].value,
        id: 3
      }),
      createDeficientItem({
        state: 'pending',
        currentResponsibilityGroup: deficientItemResponsibilityGroups[1].value,
        id: 4
      }),
      createDeficientItem({
        state: 'pending',
        currentResponsibilityGroup: '',
        id: 5
      })
    ]);

    const { result } = renderHook(() => useSorting(deficientItems, 'desc'));
    act(() => {
      result.current.onSortChange({
        target: { value: 'currentResponsibilityGroup' }
      } as ChangeEvent<HTMLSelectElement>);
      result.current.onSortDirChange();
    });
    const { sortedDeficientItems } = result.current;
    sortedDeficientItems.forEach((item: DeficientItem, i: number) => {
      expect(item.id).toEqual(expected[i]);
    });
  });

  test('should sort deficient items by creation date date from newest to oldest date', () => {
    const expected = [1, 2, 3, 4, 5, 6];

    const currentDate = moment();
    const createdAtDates = [
      currentDate.unix(),
      currentDate.subtract('1', 'day').unix(),
      currentDate.subtract('2', 'day').unix(),
      currentDate.subtract('3', 'day').unix(),
      currentDate.subtract('4', 'day').unix(),
      0
    ];
    const deficientItems = shuffle([
      createDeficientItem({
        state: 'pending',
        createdAt: createdAtDates[0],
        id: 1
      }),
      createDeficientItem({
        state: 'pending',
        createdAt: createdAtDates[1],
        id: 2
      }),
      createDeficientItem({
        state: 'pending',
        createdAt: createdAtDates[2],
        id: 3
      }),
      createDeficientItem({
        state: 'pending',
        createdAt: createdAtDates[3],
        id: 4
      }),
      createDeficientItem({
        state: 'pending',
        createdAt: createdAtDates[4],
        id: 5
      }),
      createDeficientItem({
        state: 'pending',
        createdAt: createdAtDates[5],
        id: 6
      })
    ]);

    const { result } = renderHook(() => useSorting(deficientItems, 'desc'));
    act(() => {
      result.current.onSortChange({
        target: { value: 'createdAt' }
      } as ChangeEvent<HTMLSelectElement>);
    });

    const { sortedDeficientItems } = result.current;
    sortedDeficientItems.forEach((item: DeficientItem, i: number) => {
      expect(item.id).toEqual(expected[i]);
    });
  });

  test('should sort deficient items by creation date from oldest to newest date', () => {
    const expected = [6, 5, 4, 3, 2, 1];

    const currentDate = moment();
    const createdAtDates = [
      currentDate.unix(),
      currentDate.subtract('1', 'day').unix(),
      currentDate.subtract('2', 'day').unix(),
      currentDate.subtract('3', 'day').unix(),
      currentDate.subtract('4', 'day').unix(),
      0
    ];
    const deficientItems = shuffle([
      createDeficientItem({
        state: 'pending',
        createdAt: createdAtDates[0],
        id: 1
      }),
      createDeficientItem({
        state: 'pending',
        createdAt: createdAtDates[1],
        id: 2
      }),
      createDeficientItem({
        state: 'pending',
        createdAt: createdAtDates[2],
        id: 3
      }),
      createDeficientItem({
        state: 'pending',
        createdAt: createdAtDates[3],
        id: 4
      }),
      createDeficientItem({
        state: 'pending',
        createdAt: createdAtDates[4],
        id: 5
      }),
      createDeficientItem({
        state: 'pending',
        createdAt: createdAtDates[5],
        id: 6
      })
    ]);

    const { result } = renderHook(() => useSorting(deficientItems, 'desc'));
    act(() => {
      result.current.onSortChange({
        target: { value: 'createdAt' }
      } as ChangeEvent<HTMLSelectElement>);
      result.current.onSortDirChange();
    });
    const { sortedDeficientItems } = result.current;
    sortedDeficientItems.forEach((item: DeficientItem, i: number) => {
      expect(item.id).toEqual(expected[i]);
    });
  });

  test('should sort deficient items by creation date from oldest to newest date for mobile users', () => {
    const expected = [6, 5, 4, 3, 2, 1];

    const currentDate = moment();
    const createdAtDates = [
      currentDate.unix(),
      currentDate.subtract('1', 'day').unix(),
      currentDate.subtract('2', 'day').unix(),
      currentDate.subtract('3', 'day').unix(),
      currentDate.subtract('4', 'day').unix(),
      0
    ];
    const deficientItems = shuffle([
      createDeficientItem({
        state: 'pending',
        createdAt: createdAtDates[0],
        id: 1
      }),
      createDeficientItem({
        state: 'pending',
        createdAt: createdAtDates[1],
        id: 2
      }),
      createDeficientItem({
        state: 'pending',
        createdAt: createdAtDates[2],
        id: 3
      }),
      createDeficientItem({
        state: 'pending',
        createdAt: createdAtDates[3],
        id: 4
      }),
      createDeficientItem({
        state: 'pending',
        createdAt: createdAtDates[4],
        id: 5
      }),
      createDeficientItem({
        state: 'pending',
        createdAt: createdAtDates[5],
        id: 6
      })
    ]);

    const { result } = renderHook(() => useSorting(deficientItems, 'desc'));
    act(() => {
      result.current.nextDeficientItemSort('createdAt');
    });
    const { sortedDeficientItems } = result.current;
    sortedDeficientItems.forEach((item: DeficientItem, i: number) => {
      expect(item.id).toEqual(expected[i]);
    });
  });
});
