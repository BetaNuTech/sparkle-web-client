import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import moment from 'moment';
import { act } from 'react-dom/test-utils';
import createDeficientItem from '../../../helpers/createDeficientItem';
import { admin } from '../../../../__mocks__/users';
import { fullProperty } from '../../../../__mocks__/properties';
import deficientItemsApi from '../../../../common/services/api/deficientItems';
import DeficientItemEdit from '../../../../features/DeficientItemEdit/index';
import deepClone from '../../../helpers/deepClone';
import wait from '../../../helpers/wait';

describe('Unit | features | Deficient Item Edit', () => {
  afterEach(() => sinon.restore());

  it('should request for transition to pending', async () => {
    // Stub update
    const update = sinon.stub(deficientItemsApi, 'update').resolves();

    const unpublishedUpdates = {
      currentPlanToFix: 'plan to fix',
      currentResponsibilityGroup: 'site_level_manages_vendor',
      currentDueDate: moment().unix()
    };
    const expected = { ...unpublishedUpdates, state: 'pending' };
    const props = {
      user: admin,
      property: fullProperty,
      deficientItem: createDeficientItem({
        state: 'requires-action',
        id: 'deficiency-1'
      }),
      propertyIntegration: {},
      sendNotification: sinon.spy(),
      unpublishedUpdates,
      firestore: {},
      isMobile: false,
      isOnline: true
    };
    render(<DeficientItemEdit {...props} />);

    const updatePendingAction = screen.queryByTestId('action-update-pending');
    expect(updatePendingAction).toBeTruthy();

    let actual = null;
    await act(async () => {
      userEvent.click(updatePendingAction);
      await waitFor(() => update.called);
      actual = deepClone(update.getCall(0).args[1]); // copy published state
      await wait(600);
    });

    expect(actual).toMatchObject(expected);
  });

  it('should request for transition to incomplete', async () => {
    // Stub update
    const update = sinon.stub(deficientItemsApi, 'update').resolves();

    const unpublishedUpdates = {
      currentReasonIncomplete: 'current reason incomplete'
    };
    const expected = { ...unpublishedUpdates, state: 'incomplete' };
    const props = {
      user: admin,
      property: fullProperty,
      deficientItem: createDeficientItem({
        state: 'overdue',
        id: 'deficiency-1'
      }),
      propertyIntegration: {},
      sendNotification: sinon.spy(),
      unpublishedUpdates,
      firestore: {},
      isMobile: false,
      isOnline: true
    };
    render(<DeficientItemEdit {...props} />);

    const action = screen.queryByTestId('action-update-incomplete');
    expect(action).toBeTruthy();

    let actual = null;
    await act(async () => {
      userEvent.click(action);
      await waitFor(() => update.called);
      actual = deepClone(update.getCall(0).args[1]); // copy published state
      await wait(600);
    });

    expect(actual).toMatchObject(expected);
  });

  it('should request for transition to go-back', async () => {
    // Stub update
    const update = sinon.stub(deficientItemsApi, 'update').resolves();

    const unpublishedUpdates = {};
    const expected = { ...unpublishedUpdates, state: 'go-back' };
    const props = {
      user: admin,
      property: fullProperty,
      deficientItem: createDeficientItem({
        state: 'incomplete',
        id: 'deficiency-1'
      }),
      propertyIntegration: {},
      sendNotification: sinon.spy(),
      unpublishedUpdates,
      firestore: {},
      isMobile: false,
      isOnline: true
    };
    render(<DeficientItemEdit {...props} />);

    const action = screen.queryByTestId('action-go-back');
    expect(action).toBeTruthy();

    let actual = null;
    await act(async () => {
      userEvent.click(action);
      await waitFor(() => update.called);
      actual = deepClone(update.getCall(0).args[1]); // copy published state
      await wait(600);
    });

    expect(actual).toMatchObject(expected);
  });

  it('should request for transition to closed', async () => {
    // Stub update
    const update = sinon.stub(deficientItemsApi, 'update').resolves();

    const unpublishedUpdates = {};
    const expected = { ...unpublishedUpdates, state: 'closed' };
    const props = {
      user: admin,
      property: fullProperty,
      deficientItem: createDeficientItem({
        state: 'deferred',
        id: 'deficiency-1'
      }),
      propertyIntegration: {},
      sendNotification: sinon.spy(),
      unpublishedUpdates,
      firestore: {},
      isMobile: false,
      isOnline: true
    };
    render(<DeficientItemEdit {...props} />);

    const action = screen.queryByTestId('action-duplicate');
    expect(action).toBeTruthy();

    let actual = null;
    await act(async () => {
      userEvent.click(action);
      await waitFor(() => update.called);
      actual = deepClone(update.getCall(0).args[1]); // copy published state
      await wait(600);
    });

    expect(actual).toMatchObject(expected);
  });

  it('should request for transition to closed on "Confirm Complete Now"', async () => {
    // Stub update
    const update = sinon.stub(deficientItemsApi, 'update').resolves();

    const unpublishedUpdates = {
      currentCompleteNowReason: 'complete now reason'
    };
    const expected = { ...unpublishedUpdates, state: 'closed' };
    const props = {
      user: admin,
      property: fullProperty,
      deficientItem: createDeficientItem({
        state: 'requires-action',
        id: 'deficiency-1'
      }),
      propertyIntegration: {},
      sendNotification: sinon.spy(),
      unpublishedUpdates,
      firestore: {},
      isMobile: false,
      isOnline: true
    };
    render(<DeficientItemEdit {...props} />);

    await act(async () => {
      const completeNowAction = screen.queryByTestId('action-complete-now');
      userEvent.click(completeNowAction);
      await wait(100);
    });

    act(() => {
      const completeNowReasonTextarea = screen.queryByTestId(
        'item-complete-now-reason-textarea'
      );
      fireEvent.change(completeNowReasonTextarea, {
        target: { value: 'complete now reason' }
      });
    });

    const action = screen.queryByTestId('action-confirm-complete-now');
    expect(action).toBeTruthy();
    expect(action).toBeEnabled();

    let actual = null;
    await act(async () => {
      userEvent.click(action);
      await waitFor(() => update.called);
      actual = deepClone(update.getCall(0).args[1]); // copy published state
      await wait(600);
    });

    expect(actual).toMatchObject(expected);
  });

  it('should request for transition to deferred', async () => {
    // Stub update
    const update = sinon.stub(deficientItemsApi, 'update').resolves();

    const deferredDate = moment().add(2, 'days');
    const formatedDeferredDate = deferredDate.format('YYYY-MM-DD');

    const unpublishedUpdates = {
      currentDeferredDate: moment(formatedDeferredDate).unix()
    };
    const expected = { ...unpublishedUpdates, state: 'deferred' };
    const props = {
      user: admin,
      property: fullProperty,
      deficientItem: createDeficientItem({
        state: 'requires-action',
        id: 'deficiency-1'
      }),
      propertyIntegration: {},
      sendNotification: sinon.spy(),
      unpublishedUpdates,
      firestore: {},
      isMobile: false,
      isOnline: true
    };
    render(<DeficientItemEdit {...props} />);

    await act(async () => {
      const deferAction = screen.queryByTestId('action-defer');
      userEvent.click(deferAction);
      await wait(100);
    });

    act(() => {
      const deferredDateInput = screen.queryByTestId(
        'item-deferred-date-input'
      );
      fireEvent.change(deferredDateInput, {
        target: { value: formatedDeferredDate }
      });
    });

    const action = screen.queryByTestId('action-confirm-defer');
    expect(action).toBeTruthy();

    let actual = null;
    await act(async () => {
      userEvent.click(action);
      await waitFor(() => update.called);
      actual = deepClone(update.getCall(0).args[1]); // copy published state
      await wait(600);
    });

    expect(actual).toMatchObject(expected);
  });
});
