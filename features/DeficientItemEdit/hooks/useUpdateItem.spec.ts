import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import { act } from '@testing-library/react';
import moment from 'moment';
import createDeficientItem from '../../../__tests__/helpers/createDeficientItem';
import deficientItemsApi from '../../../common/services/api/deficientItems';
import currentUser from '../../../common/utils/currentUser';
import errorReports from '../../../common/services/api/errorReports';
import useUpdateItem from './useUpdateItem';
import DeficientItemLocalUpdates from '../../../common/models/deficientItems/unpublishedUpdates';

const deficientItem = createDeficientItem({ state: 'require-action' });

describe('Unit | Features | Deficient Item Edit | Hooks | Use Update Item', () => {
  afterEach(() => sinon.restore());

  test('should update state value', () => {
    const sendNotification = sinon.spy();
    const expected = {
      hasUpdates: true,
      state: 'go-back'
    };

    const { result } = renderHook(() =>
      useUpdateItem(
        'deficiency-1',
        'property-1',
        sendNotification,
        {} as DeficientItemLocalUpdates,
        deficientItem
      )
    );

    act(() => {
      result.current.updateState(expected.state);
    });

    const updates = result.current.updates || ({} as DeficientItemLocalUpdates);
    const actual = {
      hasUpdates: result.current.hasUpdates,
      state: updates.state
    };

    expect(actual).toEqual(expected);
  });

  test('should update current due date value', () => {
    const sendNotification = sinon.spy();
    const expected = {
      hasUpdates: true,
      currentDueDate: moment().unix()
    };

    const { result } = renderHook(() =>
      useUpdateItem(
        'deficiency-1',
        'property-1',
        sendNotification,
        {} as DeficientItemLocalUpdates,
        deficientItem
      )
    );

    act(() => {
      result.current.updateCurrentDueDate(expected.currentDueDate);
    });

    const updates = result.current.updates || ({} as DeficientItemLocalUpdates);
    const actual = {
      hasUpdates: result.current.hasUpdates,
      currentDueDate: updates.currentDueDate
    };

    expect(actual).toEqual(expected);
  });

  test('should update current deferred date value', () => {
    const sendNotification = sinon.spy();
    const expected = {
      hasUpdates: true,
      currentDeferredDate: moment().unix()
    };

    const { result } = renderHook(() =>
      useUpdateItem(
        'deficiency-1',
        'property-1',
        sendNotification,
        {} as DeficientItemLocalUpdates,
        deficientItem
      )
    );

    act(() => {
      result.current.updateCurrentDeferredDate(expected.currentDeferredDate);
    });

    const updates = result.current.updates || ({} as DeficientItemLocalUpdates);
    const actual = {
      hasUpdates: result.current.hasUpdates,
      currentDeferredDate: updates.currentDeferredDate
    };

    expect(actual).toEqual(expected);
  });

  test('should update current plan to fix value', () => {
    const sendNotification = sinon.spy();
    const expected = {
      hasUpdates: true,
      currentPlanToFix: 'plan to fix'
    };

    const { result } = renderHook(() =>
      useUpdateItem(
        'deficiency-1',
        'property-1',
        sendNotification,
        {} as DeficientItemLocalUpdates,
        deficientItem
      )
    );

    act(() => {
      result.current.updateCurrentPlanToFix(expected.currentPlanToFix);
    });

    const updates = result.current.updates || ({} as DeficientItemLocalUpdates);
    const actual = {
      hasUpdates: result.current.hasUpdates,
      currentPlanToFix: updates.currentPlanToFix
    };

    expect(actual).toEqual(expected);
  });

  test('should update current responsibility group value', () => {
    const sendNotification = sinon.spy();
    const expected = {
      hasUpdates: true,
      currentResponsibilityGroup: 'site_level_in-house'
    };

    const { result } = renderHook(() =>
      useUpdateItem(
        'deficiency-1',
        'property-1',
        sendNotification,
        {} as DeficientItemLocalUpdates,
        deficientItem
      )
    );

    act(() => {
      result.current.updateCurrentResponsibilityGroup(
        expected.currentResponsibilityGroup
      );
    });

    const updates = result.current.updates || ({} as DeficientItemLocalUpdates);
    const actual = {
      hasUpdates: result.current.hasUpdates,
      currentResponsibilityGroup: updates.currentResponsibilityGroup
    };

    expect(actual).toEqual(expected);
  });

  test('should update progress note value', () => {
    const sendNotification = sinon.spy();
    const expected = {
      hasUpdates: true,
      progressNote: 'progress note'
    };

    const { result } = renderHook(() =>
      useUpdateItem(
        'deficiency-1',
        'property-1',
        sendNotification,
        {} as DeficientItemLocalUpdates,
        deficientItem
      )
    );

    act(() => {
      result.current.updateProgressNote(expected.progressNote);
    });

    const updates = result.current.updates || ({} as DeficientItemLocalUpdates);
    const actual = {
      hasUpdates: result.current.hasUpdates,
      progressNote: updates.progressNote
    };

    expect(actual).toEqual(expected);
  });

  test('should update current reason incomplete value', () => {
    const sendNotification = sinon.spy();
    const expected = {
      hasUpdates: true,
      currentReasonIncomplete: 'current reason for incomplete'
    };

    const { result } = renderHook(() =>
      useUpdateItem(
        'deficiency-1',
        'property-1',
        sendNotification,
        {} as DeficientItemLocalUpdates,
        deficientItem
      )
    );

    act(() => {
      result.current.updateCurrentReasonIncomplete(
        expected.currentReasonIncomplete
      );
    });

    const updates = result.current.updates || ({} as DeficientItemLocalUpdates);
    const actual = {
      hasUpdates: result.current.hasUpdates,
      currentReasonIncomplete: updates.currentReasonIncomplete
    };

    expect(actual).toEqual(expected);
  });

  test('should update current complete now reason value', () => {
    const sendNotification = sinon.spy();
    const expected = {
      hasUpdates: true,
      currentCompleteNowReason: 'current reason for incomplete'
    };

    const { result } = renderHook(() =>
      useUpdateItem(
        'deficiency-1',
        'property-1',
        sendNotification,
        {} as DeficientItemLocalUpdates,
        deficientItem
      )
    );

    act(() => {
      result.current.updateCurrentCompleteNowReason(
        expected.currentCompleteNowReason
      );
    });

    const updates = result.current.updates || ({} as DeficientItemLocalUpdates);
    const actual = {
      hasUpdates: result.current.hasUpdates,
      currentCompleteNowReason: updates.currentCompleteNowReason
    };

    expect(actual).toEqual(expected);
  });

  test('should call the update deficient item method of api', async () => {
    const expected = true;
    const sendNotification = sinon.spy();
    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);
    sinon.stub(errorReports, 'send').callsFake(() => true);

    // Stub update response
    const update = sinon.stub(deficientItemsApi, 'update').resolves(true);

    await act(async () => {
      const { result } = renderHook(() =>
        useUpdateItem(
          'deficiency-1',
          'property-1',
          sendNotification,
          {} as DeficientItemLocalUpdates,
          deficientItem
        )
      );
      await result.current.publish();
    });

    const actual = update.called;
    expect(actual).toEqual(expected);
  });

  test('should send error notification if update request unsuccessful', async () => {
    const expected = true;
    const sendNotification = sinon.spy();
    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);
    sinon.stub(errorReports, 'send').callsFake(() => true);

    // Stub update response
    sinon.stub(deficientItemsApi, 'update').rejects();

    await act(async () => {
      const { result } = renderHook(() =>
        useUpdateItem(
          'deficiency-1',
          'property-1',
          sendNotification,
          {} as DeficientItemLocalUpdates,
          deficientItem
        )
      );
      await result.current.publish();
    });

    const actual = sendNotification.called;
    expect(actual).toEqual(expected);
  });
});