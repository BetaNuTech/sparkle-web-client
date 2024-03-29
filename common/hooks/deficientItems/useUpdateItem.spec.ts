import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import { act, waitFor } from '@testing-library/react';
import moment from 'moment';
import createDeficientItem from '../../../__tests__/helpers/createDeficientItem';
import deficientItemsApi from '../../services/api/deficientItems';
import currentUser from '../../utils/currentUser';
import errorReports from '../../services/api/errorReports';
import useUpdateItem from './useUpdateItem';
import DeficientItemLocalUpdates from '../../models/deficientItems/unpublishedUpdates';
import { admin } from '../../../__mocks__/users';
import { unpublishedPhotoDataEntry } from '../../../__mocks__/deficientItems';

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
        deficientItem,
        admin
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
        deficientItem,
        admin
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
        deficientItem,
        admin
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
        deficientItem,
        admin
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
        deficientItem,
        admin
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
        deficientItem,
        admin
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
        deficientItem,
        admin
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
        deficientItem,
        admin
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

    const deficientItemUpdates = {
      currentPlanToFix: 'plan to fix',
      currentResponsibilityGroup: 'site_level_in-house',
      currentDueDate: moment().unix()
    } as DeficientItemLocalUpdates;

    await act(async () => {
      const { result } = renderHook(() =>
        useUpdateItem(
          'deficiency-1',
          'property-1',
          sendNotification,
          deficientItemUpdates,
          deficientItem,
          admin
        )
      );
      await result.current.publish();
      // wait 300 ms for state transition
      await new Promise((resolve) => setTimeout(resolve, 300));
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

    const deficientItemUpdates = {
      currentPlanToFix: 'plan to fix',
      currentResponsibilityGroup: 'site_level_in-house',
      currentDueDate: moment().unix()
    } as DeficientItemLocalUpdates;

    await act(async () => {
      const { result } = renderHook(() =>
        useUpdateItem(
          'deficiency-1',
          'property-1',
          sendNotification,
          deficientItemUpdates,
          deficientItem,
          admin
        )
      );
      await result.current.publish();
      // wait 300 ms for state transition
      await new Promise((resolve) => setTimeout(resolve, 300));
    });

    const actual = sendNotification.called;
    expect(actual).toEqual(expected);
  });

  test('should request to upload photos and publish deficiency', async () => {
    const expected = true;
    const sendNotification = sinon.spy();
    const updates = { state: 'closed' } as DeficientItemLocalUpdates;
    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);

    const photoUploadData = [unpublishedPhotoDataEntry];

    // Creates spy for method in deficientItemsApi to upload photo
    const uploadPhoto = sinon
      .stub(deficientItemsApi, 'uploadPhoto')
      .resolves(true);

    sinon.stub(errorReports, 'send').resolves(true);

    // Creates spy for method in deficientItemsApi to update deficiency
    const updateDeficiencyFn = sinon
      .stub(deficientItemsApi, 'update')
      .resolves(true);

    await act(async () => {
      const { result } = renderHook(() =>
        useUpdateItem(
          'deficiency-1',
          'property-1',
          sendNotification,
          updates,
          deficientItem,
          admin
        )
      );
      await result.current.publish(photoUploadData);
      // wait 300 ms for state transition
      await new Promise((resolve) => setTimeout(resolve, 300));
    });

    await waitFor(() => uploadPhoto.called);

    const actual = uploadPhoto.called;
    expect(actual).toEqual(expected);
    expect(updateDeficiencyFn.called).toBeTruthy();
  });

  test('should show alert with relevant message', async () => {
    const alertMock = sinon.stub(window, 'alert');
    const sendNotification = sinon.spy();
    const expected = [
      'Save Error: Current Plan to Fix is NOT SET',
      'Save Error: Current Responsibility Group is NOT SET',
      'Save Error: Current Due Date is NOT SET',
      'Save Error: Missing required information'
    ];

    const { result } = renderHook(() =>
      useUpdateItem(
        'deficiency-1',
        'property-1',
        sendNotification,
        {} as DeficientItemLocalUpdates,
        deficientItem,
        admin
      )
    );

    act(() => {
      result.current.handlePermissionWarning('pending');
    });

    let alertMessage = alertMock.getCall(0).args[0];
    expect(alertMock.called).toBeTruthy();
    expect(alertMessage).toEqual(expected[0]);

    await act(async () => {
      // wait for 100 ms for state update
      await new Promise((resolve) => setTimeout(resolve, 100));

      result.current.updateCurrentPlanToFix('current plan to fix');
      result.current.handlePermissionWarning('pending');
    });

    // eslint-disable-next-line prefer-destructuring
    alertMessage = alertMock.getCall(1).args[0];
    expect(alertMock.called).toBeTruthy();
    expect(alertMessage).toEqual(expected[1]);

    await act(async () => {
      // wait for 100 ms for state update
      await new Promise((resolve) => setTimeout(resolve, 100));

      result.current.updateCurrentResponsibilityGroup('site_level_in-house');
      result.current.handlePermissionWarning('pending');
    });

    // eslint-disable-next-line prefer-destructuring
    alertMessage = alertMock.getCall(2).args[0];
    expect(alertMock.called).toBeTruthy();
    expect(alertMessage).toEqual(expected[2]);

    await act(async () => {
      // wait for 100 ms for state update
      await new Promise((resolve) => setTimeout(resolve, 100));

      result.current.updateCurrentDueDate(moment().unix());
      result.current.handlePermissionWarning('pending');
    });

    // eslint-disable-next-line prefer-destructuring
    alertMessage = alertMock.getCall(3).args[0];
    expect(alertMock.called).toBeTruthy();
    expect(alertMessage).toEqual(expected[3]);
  });

  test('should clear all the updates of deficient item', async () => {
    const expected = {};
    const sendNotification = sinon.spy();

    const deficientItemUpdates = {
      currentPlanToFix: 'plan to fix',
      currentResponsibilityGroup: 'site_level_in-house',
      currentDueDate: moment().unix()
    } as DeficientItemLocalUpdates;

    const { result } = renderHook(() =>
      useUpdateItem(
        'deficiency-1',
        'property-1',
        sendNotification,
        deficientItemUpdates,
        deficientItem,
        admin
      )
    );

    await act(async () => {
      result.current.clearUpdates();
    });

    expect(result.current.updates).toMatchObject(expected);
  });
});
