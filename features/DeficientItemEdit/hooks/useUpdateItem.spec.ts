import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import { act } from '@testing-library/react';
import moment from 'moment';
import DeficientItemModel from '../../../common/models/deficientItem';
import createDeficientItem from '../../../__tests__/helpers/createDeficientItem';
import useUpdateItem from './useUpdateItem';

const deficientItem = createDeficientItem({ state: 'require-action' });

describe('Unit | Features | Deficient Item Edit | Hooks | Use Update Item', () => {
  afterEach(() => sinon.restore());

  test('should update state value', () => {
    const expected = {
      hasUpdates: true,
      state: 'go-back'
    };

    const { result } = renderHook(() =>
      useUpdateItem({} as DeficientItemModel, deficientItem)
    );

    act(() => {
      result.current.updateState(expected.state);
    });

    const updates = result.current.updates || ({} as DeficientItemModel);
    const actual = {
      hasUpdates: result.current.hasUpdates,
      state: updates.state
    };

    expect(actual).toEqual(expected);
  });

  test('should update current due date value', () => {
    const expected = {
      hasUpdates: true,
      currentDueDate: moment().unix()
    };

    const { result } = renderHook(() =>
      useUpdateItem({} as DeficientItemModel, deficientItem)
    );

    act(() => {
      result.current.updateCurrentDueDate(expected.currentDueDate);
    });

    const updates = result.current.updates || ({} as DeficientItemModel);
    const actual = {
      hasUpdates: result.current.hasUpdates,
      currentDueDate: updates.currentDueDate
    };

    expect(actual).toEqual(expected);
  });

  test('should update current deferred date value', () => {
    const expected = {
      hasUpdates: true,
      currentDeferredDate: moment().unix()
    };

    const { result } = renderHook(() =>
      useUpdateItem({} as DeficientItemModel, deficientItem)
    );

    act(() => {
      result.current.updateCurrentDeferredDate(expected.currentDeferredDate);
    });

    const updates = result.current.updates || ({} as DeficientItemModel);
    const actual = {
      hasUpdates: result.current.hasUpdates,
      currentDeferredDate: updates.currentDeferredDate
    };

    expect(actual).toEqual(expected);
  });

  test('should update current plan to fix value', () => {
    const expected = {
      hasUpdates: true,
      currentPlanToFix: 'plan to fix'
    };

    const { result } = renderHook(() =>
      useUpdateItem({} as DeficientItemModel, deficientItem)
    );

    act(() => {
      result.current.updateCurrentPlanToFix(expected.currentPlanToFix);
    });

    const updates = result.current.updates || ({} as DeficientItemModel);
    const actual = {
      hasUpdates: result.current.hasUpdates,
      currentPlanToFix: updates.currentPlanToFix
    };

    expect(actual).toEqual(expected);
  });

  test('should update current responsibility group value', () => {
    const expected = {
      hasUpdates: true,
      currentResponsibilityGroup: 'site_level_in-house'
    };

    const { result } = renderHook(() =>
      useUpdateItem({} as DeficientItemModel, deficientItem)
    );

    act(() => {
      result.current.updateCurrentResponsibilityGroup(
        expected.currentResponsibilityGroup
      );
    });

    const updates = result.current.updates || ({} as DeficientItemModel);
    const actual = {
      hasUpdates: result.current.hasUpdates,
      currentResponsibilityGroup: updates.currentResponsibilityGroup
    };

    expect(actual).toEqual(expected);
  });

  test('should update progress note value', () => {
    const expected = {
      hasUpdates: true,
      progressNote: 'progress note'
    };

    const { result } = renderHook(() =>
      useUpdateItem({} as DeficientItemModel, deficientItem)
    );

    act(() => {
      result.current.updateProgressNote(expected.progressNote);
    });

    const updates = result.current.updates || ({} as DeficientItemModel);
    const actual = {
      hasUpdates: result.current.hasUpdates,
      progressNote: updates.progressNote
    };

    expect(actual).toEqual(expected);
  });

  test('should update current reason incomplete value', () => {
    const expected = {
      hasUpdates: true,
      currentReasonIncomplete: 'current reason for incomplete'
    };

    const { result } = renderHook(() =>
      useUpdateItem({} as DeficientItemModel, deficientItem)
    );

    act(() => {
      result.current.updateCurrentReasonIncomplete(
        expected.currentReasonIncomplete
      );
    });

    const updates = result.current.updates || ({} as DeficientItemModel);
    const actual = {
      hasUpdates: result.current.hasUpdates,
      currentReasonIncomplete: updates.currentReasonIncomplete
    };

    expect(actual).toEqual(expected);
  });

  test('should update current complete now reason value', () => {
    const expected = {
      hasUpdates: true,
      currentCompleteNowReason: 'current reason for incomplete'
    };

    const { result } = renderHook(() =>
      useUpdateItem({} as DeficientItemModel, deficientItem)
    );

    act(() => {
      result.current.updateCurrentCompleteNowReason(
        expected.currentCompleteNowReason
      );
    });

    const updates = result.current.updates || ({} as DeficientItemModel);
    const actual = {
      hasUpdates: result.current.hasUpdates,
      currentCompleteNowReason: updates.currentCompleteNowReason
    };

    expect(actual).toEqual(expected);
  });
});
