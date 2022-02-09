import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import moment from 'moment';
import { act } from 'react-dom/test-utils';
import createDeficientItem from '../../../helpers/createDeficientItem';
import { admin } from '../../../../__mocks__/users';
import { fullProperty } from '../../../../__mocks__/properties';
import deficientItemsApi from '../../../../common/services/api/deficientItems';
import DeficientItemEdit from '../../../../features/DeficientItemEdit/index';
import currentUser from '../../../../common/utils/currentUser';
import errorReports from '../../../../common/services/api/errorReports';

describe('Unit | features | Deficient Item Edit', () => {
  afterEach(() => sinon.restore());

  it('should request for transition to pending', async () => {
    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);
    sinon.stub(errorReports, 'send').callsFake(() => true);
    // Stub update
    const update = sinon.stub(deficientItemsApi, 'update').resolves(true);

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

    act(() => {
      userEvent.click(updatePendingAction);
    });

    await waitFor(() => update.called);

    const result = update.called ? update.getCall(0).args[1] : {};

    expect(result).toMatchObject(expected);
  });

  it('should request for transition to incomplete', async () => {
    // Stub update
    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);
    sinon.stub(errorReports, 'send').callsFake(() => true);
    const update = sinon.stub(deficientItemsApi, 'update').resolves(true);

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

    act(() => {
      userEvent.click(action);
    });

    await waitFor(() => update.called);

    const result = update.called ? update.getCall(0).args[1] : {};

    expect(result).toMatchObject(expected);
  });

  it('should request for transition to go-back', async () => {
    // Stub update
    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);
    sinon.stub(errorReports, 'send').callsFake(() => true);
    const update = sinon.stub(deficientItemsApi, 'update').resolves(true);

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

    act(() => {
      userEvent.click(action);
    });

    await waitFor(() => update.called);

    const result = update.called ? update.getCall(0).args[1] : {};

    expect(result).toMatchObject(expected);
  });

  it('should request for transition to closed', async () => {
    // Stub update
    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);
    sinon.stub(errorReports, 'send').callsFake(() => true);
    const update = sinon.stub(deficientItemsApi, 'update').resolves(true);

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

    act(() => {
      userEvent.click(action);
    });

    await waitFor(() => update.called);

    const result = update.called ? update.getCall(0).args[1] : {};

    expect(result).toMatchObject(expected);
  });

  it('should request for transition to closed on "Confirm Complete Now"', async () => {
    // Stub update
    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);
    sinon.stub(errorReports, 'send').callsFake(() => true);
    const update = sinon.stub(deficientItemsApi, 'update').resolves(true);

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

    act(() => {
      const completeNowAction = screen.queryByTestId('action-complete-now');
      userEvent.click(completeNowAction);
    });

    const action = screen.queryByTestId('action-confirm-complete-now');
    expect(action).toBeTruthy();

    act(() => {
      userEvent.click(action);
    });

    await waitFor(() => update.called);

    const result = update.called ? update.getCall(0).args[1] : {};

    expect(result).toMatchObject(expected);
  });

  it('should request for transition to deferred', async () => {
    // Stub update
    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);
    sinon.stub(errorReports, 'send').callsFake(() => true);
    const update = sinon.stub(deficientItemsApi, 'update').resolves(true);

    const unpublishedUpdates = { currentDeferredDate: moment().unix() };
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

    act(() => {
      const deferAction = screen.queryByTestId('action-defer');
      userEvent.click(deferAction);
    });

    const action = screen.queryByTestId('action-confirm-defer');
    expect(action).toBeTruthy();

    act(() => {
      userEvent.click(action);
    });

    await waitFor(() => update.called);

    const result = update.called ? update.getCall(0).args[1] : {};

    expect(result).toMatchObject(expected);
  });
});
