import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import moment from 'moment';
import { act } from 'react-dom/test-utils';
import createDeficientItem from '../../../helpers/createDeficientItem';
import { admin } from '../../../../__mocks__/users';
import { fullProperty } from '../../../../__mocks__/properties';
import deficientItemsApi from '../../../../common/services/api/deficientItems';
import DeficientItems from '../../../../features/DeficientItems/index';
import deepClone from '../../../helpers/deepClone';
import wait from '../../../helpers/wait';
import stubIntersectionObserver from '../../../helpers/stubIntersectionObserver';

const validDate = moment().add(2, 'days').format('YYYY-MM-DD');

describe('Unit | features | Deficient Items', () => {
  afterEach(() => sinon.restore());
  beforeEach(() => stubIntersectionObserver());

  it('should request 2 items for transition to pending', async () => {
    // Stub update
    const update = sinon.stub(deficientItemsApi, 'update').resolves();

    const expected = {
      currentPlanToFix: 'plan to fix',
      currentResponsibilityGroup: 'site_level_manages_vendor',
      currentDueDate: moment(validDate).unix(),
      state: 'pending'
    };

    const expectedIds = ['deficiency-1', 'deficiency-2'];

    const deficientItems = [
      createDeficientItem({
        state: 'requires-action',
        id: expectedIds[0],
        currentDueDate: 0
      }),
      createDeficientItem({
        state: 'requires-action',
        id: expectedIds[1],
        currentDueDate: 0
      })
    ];

    const props = {
      user: admin,
      property: fullProperty,
      deficientItems,
      sendNotification: sinon.spy(),
      isMobile: false,
      isOnline: true,
      forceVisible: true
    };
    render(<DeficientItems {...props} />);

    const checkBoxEl = screen.queryByTestId('header-checkbox');
    const moveToEl = screen.queryAllByTestId('move-to-item');
    const DIcheckbox = screen.queryAllByTestId('item-checkbox');
    fireEvent.click(checkBoxEl);

    // all the items has been selected;
    // eslint-disable-next-line  no-restricted-syntax
    for (const checkbox of DIcheckbox) {
      expect(checkbox).toBeChecked();
    }

    fireEvent.click(moveToEl[0]);
    await waitFor(() => screen.queryByTestId('bulk-update-modal'));

    act(() => {
      const planToFixEl = screen.queryByTestId('item-plan-to-fix-textarea');
      const responsibilityGroupEl = screen.queryByTestId(
        'item-responsibility-group-select'
      );
      const dueDateEl = screen.queryByTestId('item-due-date-input');
      fireEvent.change(planToFixEl, {
        target: { value: expected.currentPlanToFix }
      });
      fireEvent.change(responsibilityGroupEl, {
        target: { value: expected.currentResponsibilityGroup }
      });
      fireEvent.change(dueDateEl, { target: { value: validDate } });
    });

    const updatePendingAction = screen.queryAllByTestId(
      'action-update-pending'
    )[0];
    expect(updatePendingAction).toBeTruthy();

    let actual = null;
    let actualIds = null;
    await act(async () => {
      userEvent.click(updatePendingAction);
      await waitFor(() => update.called);
      actual = deepClone(update.getCall(0).args[1]); // copy published state
      actualIds = deepClone(update.getCall(0).args[0]); // copy published state
    });

    expect(actual).toMatchObject(expected);
    expect(actualIds).toMatchObject(expectedIds);
  });

  it('should request 2 items for transition to deferred', async () => {
    // Stub update
    const update = sinon.stub(deficientItemsApi, 'update').resolves();

    const expected = {
      currentDeferredDate: moment(validDate).unix(),
      state: 'deferred'
    };

    const expectedIds = ['deficiency-1', 'deficiency-2'];

    const deficientItems = [
      createDeficientItem({
        state: 'requires-action',
        id: expectedIds[0],
        currentDueDate: 0
      }),
      createDeficientItem({
        state: 'requires-action',
        id: expectedIds[1],
        currentDueDate: 0
      })
    ];

    const props = {
      user: admin,
      property: fullProperty,
      deficientItems,
      sendNotification: sinon.spy(),
      isMobile: false,
      isOnline: true,
      forceVisible: true
    };
    render(<DeficientItems {...props} />);

    const checkBoxEl = screen.queryByTestId('header-checkbox');
    const moveToEl = screen.queryAllByTestId('move-to-item');
    const DIcheckbox = screen.queryAllByTestId('item-checkbox');
    fireEvent.click(checkBoxEl);

    // all the items has been selected;
    // eslint-disable-next-line  no-restricted-syntax
    for (const checkbox of DIcheckbox) {
      expect(checkbox).toBeChecked();
    }

    fireEvent.click(moveToEl[1]);
    await waitFor(() => screen.queryByTestId('bulk-update-modal'));

    act(() => {
      const deferredDateEl = screen.queryByTestId('item-deferred-date-input');
      fireEvent.change(deferredDateEl, { target: { value: validDate } });
    });

    const completeDeferAction = screen.queryAllByTestId(
      'action-complete-defer'
    )[0];
    expect(completeDeferAction).toBeTruthy();

    let actual = null;
    let actualIds = null;
    await act(async () => {
      userEvent.click(completeDeferAction);
      await waitFor(() => update.called);
      actual = deepClone(update.getCall(0).args[1]); // copy published state
      actualIds = deepClone(update.getCall(0).args[0]); // copy published state
    });

    expect(actual).toMatchObject(expected);
    expect(actualIds).toMatchObject(expectedIds);
  });

  it('should request 2 items for transition to go-back', async () => {
    // Stub update
    const update = sinon.stub(deficientItemsApi, 'update').resolves();

    const expected = {
      state: 'go-back'
    };

    const expectedIds = ['deficiency-1', 'deficiency-2'];

    const deficientItems = [
      createDeficientItem({
        state: 'incomplete',
        id: expectedIds[0],
        currentDueDate: 0
      }),
      createDeficientItem({
        state: 'incomplete',
        id: expectedIds[1],
        currentDueDate: 0
      })
    ];

    const props = {
      user: admin,
      property: fullProperty,
      deficientItems,
      sendNotification: sinon.spy(),
      isMobile: false,
      isOnline: true,
      forceVisible: true
    };
    render(<DeficientItems {...props} />);

    const checkBoxEl = screen.queryByTestId('header-checkbox');
    const moveToEl = screen.queryAllByTestId('move-to-item');
    const DIcheckbox = screen.queryAllByTestId('item-checkbox');
    fireEvent.click(checkBoxEl);

    // all the items has been selected;
    // eslint-disable-next-line  no-restricted-syntax
    for (const checkbox of DIcheckbox) {
      expect(checkbox).toBeChecked();
    }

    fireEvent.click(moveToEl[0]);
    await waitFor(() => screen.queryByTestId('bulk-update-modal'));

    const goBackAction = screen.queryAllByTestId('action-go-back')[0];
    expect(goBackAction).toBeTruthy();

    let actual = null;
    let actualIds = null;
    await act(async () => {
      userEvent.click(goBackAction);
      await waitFor(() => update.called);
      actual = deepClone(update.getCall(0).args[1]); // copy published state
      actualIds = deepClone(update.getCall(0).args[0]); // copy published state
      await wait(300);
    });

    expect(actual).toMatchObject(expected);
    expect(actualIds).toMatchObject(expectedIds);
  });

  it('should request 2 items for transition to closed', async () => {
    // Stub update
    const update = sinon.stub(deficientItemsApi, 'update').resolves();

    const expected = {
      state: 'closed'
    };

    const expectedIds = ['deficiency-1', 'deficiency-2'];

    const deficientItems = [
      createDeficientItem({
        state: 'incomplete',
        id: expectedIds[0],
        currentDueDate: 0
      }),
      createDeficientItem({
        state: 'incomplete',
        id: expectedIds[1],
        currentDueDate: 0
      })
    ];

    const props = {
      user: admin,
      property: fullProperty,
      deficientItems,
      sendNotification: sinon.spy(),
      isMobile: false,
      isOnline: true,
      forceVisible: true
    };
    render(<DeficientItems {...props} />);

    const checkBoxEl = screen.queryByTestId('header-checkbox');
    const moveToEl = screen.queryAllByTestId('move-to-item');
    const DIcheckbox = screen.queryAllByTestId('item-checkbox');
    fireEvent.click(checkBoxEl);

    // all the items has been selected;
    // eslint-disable-next-line  no-restricted-syntax
    for (const checkbox of DIcheckbox) {
      expect(checkbox).toBeChecked();
    }

    fireEvent.click(moveToEl[1]);
    await waitFor(() => screen.queryByTestId('bulk-update-modal'));

    const closeAction = screen.queryAllByTestId('action-close')[0];
    expect(closeAction).toBeTruthy();

    let actual = null;
    let actualIds = null;
    await act(async () => {
      userEvent.click(closeAction);
      await waitFor(() => update.called);
      actual = deepClone(update.getCall(0).args[1]); // copy published state
      actualIds = deepClone(update.getCall(0).args[0]); // copy published state
      await wait(300);
    });

    expect(actual).toMatchObject(expected);
    expect(actualIds).toMatchObject(expectedIds);
  });

  it('should request 2 items for transition to closed as duplicate', async () => {
    // Stub update
    const update = sinon.stub(deficientItemsApi, 'update').resolves();

    const expected = {
      state: 'closed',
      isDuplicate: true
    };

    const expectedIds = ['deficiency-1', 'deficiency-2'];

    const deficientItems = [
      createDeficientItem({
        state: 'deferred',
        id: expectedIds[0],
        currentDueDate: 0
      }),
      createDeficientItem({
        state: 'deferred',
        id: expectedIds[1],
        currentDueDate: 0
      })
    ];

    const props = {
      user: admin,
      property: fullProperty,
      deficientItems,
      sendNotification: sinon.spy(),
      isMobile: false,
      isOnline: true,
      forceVisible: true
    };
    render(<DeficientItems {...props} />);

    const checkBoxEl = screen.queryByTestId('header-checkbox');
    const moveToEl = screen.queryAllByTestId('move-to-item');
    const DIcheckbox = screen.queryAllByTestId('item-checkbox');
    fireEvent.click(checkBoxEl);

    // all the items has been selected;
    // eslint-disable-next-line  no-restricted-syntax
    for (const checkbox of DIcheckbox) {
      expect(checkbox).toBeChecked();
    }

    fireEvent.click(moveToEl[1]);
    await waitFor(() => screen.queryByTestId('bulk-update-modal'));

    const duplicateAction = screen.queryAllByTestId('action-duplicate')[0];
    expect(duplicateAction).toBeTruthy();

    let actual = null;
    let actualIds = null;
    await act(async () => {
      userEvent.click(duplicateAction);
      await waitFor(() => update.called);
      actual = deepClone(update.getCall(0).args[1]); // copy published state
      actualIds = deepClone(update.getCall(0).args[0]); // copy published state
      await wait(300);
    });

    expect(actual).toMatchObject(expected);
    expect(actualIds).toMatchObject(expectedIds);
  });

  it('should request 2 items for transition to incomplete', async () => {
    // Stub update
    const update = sinon.stub(deficientItemsApi, 'update').resolves();

    const expected = {
      state: 'incomplete',
      currentReasonIncomplete: 'reason incomplete'
    };

    const expectedIds = ['deficiency-1', 'deficiency-2'];

    const deficientItems = [
      createDeficientItem({
        state: 'overdue',
        id: expectedIds[0],
        currentDueDate: 0
      }),
      createDeficientItem({
        state: 'overdue',
        id: expectedIds[1],
        currentDueDate: 0
      })
    ];

    const props = {
      user: admin,
      property: fullProperty,
      deficientItems,
      sendNotification: sinon.spy(),
      isMobile: false,
      isOnline: true,
      forceVisible: true
    };
    render(<DeficientItems {...props} />);

    const checkBoxEl = screen.queryByTestId('header-checkbox');
    const moveToEl = screen.queryAllByTestId('move-to-item');
    const DIcheckbox = screen.queryAllByTestId('item-checkbox');
    fireEvent.click(checkBoxEl);

    // all the items has been selected;
    // eslint-disable-next-line  no-restricted-syntax
    for (const checkbox of DIcheckbox) {
      expect(checkbox).toBeChecked();
    }

    fireEvent.click(moveToEl[0]);
    await waitFor(() => screen.queryByTestId('bulk-update-modal'));

    act(() => {
      const reasonIncompleteEl = screen.queryByTestId(
        'item-reason-incomplete-textarea'
      );
      fireEvent.change(reasonIncompleteEl, {
        target: { value: expected.currentReasonIncomplete }
      });
    });

    const updateIncompleteAction = screen.queryAllByTestId(
      'action-update-incomplete'
    )[0];
    expect(updateIncompleteAction).toBeTruthy();

    let actual = null;
    let actualIds = null;
    await act(async () => {
      userEvent.click(updateIncompleteAction);
      await waitFor(() => update.called);
      actual = deepClone(update.getCall(0).args[1]); // copy published state
      actualIds = deepClone(update.getCall(0).args[0]); // copy published state
    });
    // await wait(300);
    expect(actual).toMatchObject(expected);
    expect(actualIds).toMatchObject(expectedIds);
  });

  it('should request 2 items to update with progress note', async () => {
    // Stub update
    const update = sinon.stub(deficientItemsApi, 'update').resolves();

    const expected = {
      progressNote: 'progress note'
    };

    const expectedIds = ['deficiency-1', 'deficiency-2'];

    const deficientItems = [
      createDeficientItem({
        state: 'requires-progress-update',
        id: expectedIds[0],
        currentDueDate: 0
      }),
      createDeficientItem({
        state: 'requires-progress-update',
        id: expectedIds[1],
        currentDueDate: 0
      })
    ];

    const props = {
      user: admin,
      property: fullProperty,
      deficientItems,
      sendNotification: sinon.spy(),
      isMobile: false,
      isOnline: true,
      forceVisible: true
    };
    render(<DeficientItems {...props} />);

    const checkBoxEl = screen.queryByTestId('header-checkbox');
    const moveToEl = screen.queryAllByTestId('move-to-item');
    const DIcheckbox = screen.queryAllByTestId('item-checkbox');
    fireEvent.click(checkBoxEl);

    // all the items has been selected;
    // eslint-disable-next-line  no-restricted-syntax
    for (const checkbox of DIcheckbox) {
      expect(checkbox).toBeChecked();
    }

    fireEvent.click(moveToEl[0]);
    await waitFor(() => screen.queryByTestId('bulk-update-modal'));

    act(() => {
      const progressNoteEl = screen.queryByTestId(
        'item-progress-note-textarea'
      );
      fireEvent.change(progressNoteEl, {
        target: { value: expected.progressNote }
      });
    });

    const addProgressNoteAction = screen.queryAllByTestId(
      'action-add-progress-note'
    )[0];
    expect(addProgressNoteAction).toBeTruthy();

    let actual = null;
    let actualIds = null;
    await act(async () => {
      userEvent.click(addProgressNoteAction);
      await waitFor(() => update.called);
      actual = deepClone(update.getCall(0).args[1]); // copy published state
      actualIds = deepClone(update.getCall(0).args[0]); // copy published state
      await wait(300);
    });
    // await wait(300);
    expect(actual).toMatchObject(expected);
    expect(actualIds).toMatchObject(expectedIds);
  });
});
