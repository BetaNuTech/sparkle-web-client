import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import sinon from 'sinon';
import moment from 'moment';
import { admin, corporate, teamMember } from '../../../../__mocks__/users';
import createDeficientItem from '../../../../__tests__/helpers/createDeficientItem';
import settings from '../../settings';
import Actions from './index';

const DEF_ITEM_STATES = settings.deficientItemStates;
const PENDING_STATE_ELIGIBLE_STATES =
  settings.deficientItemPendingEligibleStates;
const PROGRESS_NOTE_EDIT_STATES = settings.progressNoteEditStates;
const GO_BACK_ACTION_STATES = ['completed', 'incomplete', 'deferred'];
const DEFER_ACTION_STATES = ['requires-action', 'pending', 'go-back'];
const COMPLETE_NOW_ACTION_STATES = ['requires-action'];
const INCOMPLETE_UPDATE_STATES = ['overdue'];

describe('Unit | Common | Deficient Item Edit Form | fields | Actions ', () => {
  afterEach(() => sinon.restore());

  it('it only reveals "COMPLETED" button when deficient item is pending', () => {
    const props = {
      user: admin,
      deficientItem: createDeficientItem(),
      deficientItemUpdates: {},
      onShowHistory: sinon.spy(),
      onClickViewPhotos: sinon.spy(),
      onShowPlanToFix: sinon.spy(),
      onChangePlanToFix: sinon.spy(),
      onShowResponsibilityGroups: sinon.spy(),
      onChangeResponsibilityGroup: sinon.spy(),
      onShowDueDates: sinon.spy(),
      onChangeDueDate: sinon.spy(),
      onShowReasonIncomplete: sinon.spy(),
      onChangeReasonIncomplete: sinon.spy(),
      isUpdatingDeferredDate: false,
      isUpdatingCurrentCompleteNowReason: false
    };

    const tests = [
      {
        data: createDeficientItem({ state: 'requires-action' }),
        expected: false
      },
      {
        data: createDeficientItem({ state: 'pending' }),
        expected: true
      }
    ];

    const { rerender } = render(<Actions {...props} />);

    // eslint-disable-next-line no-restricted-syntax
    for (const test of tests) {
      const { data, expected } = test;
      const componentProps = { ...props, deficientItem: data };
      rerender(<Actions {...componentProps} />);
      const action = screen.queryByTestId('action-completed');
      expect(Boolean(action)).toEqual(expected);
    }
  });

  it('it only reveals "GO BACK" action when expected', () => {
    const props = {
      user: admin,
      deficientItem: createDeficientItem(),
      deficientItemUpdates: {},
      onShowHistory: sinon.spy(),
      onClickViewPhotos: sinon.spy(),
      onShowPlanToFix: sinon.spy(),
      onChangePlanToFix: sinon.spy(),
      onShowResponsibilityGroups: sinon.spy(),
      onChangeResponsibilityGroup: sinon.spy(),
      onShowDueDates: sinon.spy(),
      onChangeDueDate: sinon.spy(),
      onShowReasonIncomplete: sinon.spy(),
      onChangeReasonIncomplete: sinon.spy(),
      isUpdatingDeferredDate: false,
      isUpdatingCurrentCompleteNowReason: false
    };

    const tests = DEF_ITEM_STATES.map((state) => {
      const expected = GO_BACK_ACTION_STATES.includes(state);

      return {
        data: createDeficientItem({ state }),
        expected
      };
    });

    const { rerender } = render(<Actions {...props} />);

    // eslint-disable-next-line no-restricted-syntax
    for (const test of tests) {
      const { data, expected } = test;
      const componentProps = { ...props, deficientItem: data };
      rerender(<Actions {...componentProps} />);
      const action = screen.queryByTestId('action-go-back');
      expect(Boolean(action)).toEqual(expected);
    }
  });

  it('it only reveals "DUPLICATE" button when deficient item is deferred', () => {
    const props = {
      user: admin,
      deficientItem: createDeficientItem(),
      deficientItemUpdates: {},
      onShowHistory: sinon.spy(),
      onClickViewPhotos: sinon.spy(),
      onShowPlanToFix: sinon.spy(),
      onChangePlanToFix: sinon.spy(),
      onShowResponsibilityGroups: sinon.spy(),
      onChangeResponsibilityGroup: sinon.spy(),
      onShowDueDates: sinon.spy(),
      onChangeDueDate: sinon.spy(),
      onShowReasonIncomplete: sinon.spy(),
      onChangeReasonIncomplete: sinon.spy(),
      isUpdatingDeferredDate: false,
      isUpdatingCurrentCompleteNowReason: false
    };

    const tests = [
      {
        data: createDeficientItem({ state: 'requires-action' }),
        expected: false
      },
      {
        data: createDeficientItem({ state: 'completed' }),
        expected: false
      },
      {
        data: createDeficientItem({ state: 'incomplete' }),
        expected: false
      },
      {
        data: createDeficientItem({ state: 'deferred' }),
        expected: true
      }
    ];

    const { rerender } = render(<Actions {...props} />);

    // eslint-disable-next-line no-restricted-syntax
    for (const test of tests) {
      const { data, expected } = test;
      const componentProps = { ...props, deficientItem: data };
      rerender(<Actions {...componentProps} />);
      const action = screen.queryByTestId('action-duplicate');
      expect(Boolean(action)).toEqual(expected);
    }
  });

  it('it only reveals "DUPLICATE" permission warning button when lacking permissions', () => {
    const props = {
      user: admin,
      deficientItem: createDeficientItem(),
      deficientItemUpdates: {},
      onShowHistory: sinon.spy(),
      onClickViewPhotos: sinon.spy(),
      onShowPlanToFix: sinon.spy(),
      onChangePlanToFix: sinon.spy(),
      onShowResponsibilityGroups: sinon.spy(),
      onChangeResponsibilityGroup: sinon.spy(),
      onShowDueDates: sinon.spy(),
      onChangeDueDate: sinon.spy(),
      onShowReasonIncomplete: sinon.spy(),
      onChangeReasonIncomplete: sinon.spy(),
      isUpdatingDeferredDate: false,
      isUpdatingCurrentCompleteNowReason: false
    };

    const tests = [
      {
        data: createDeficientItem({ state: 'deferred' }),
        user: admin,
        expected: false
      },
      {
        data: createDeficientItem({ state: 'deferred' }),
        user: corporate,
        expected: false
      },
      {
        data: createDeficientItem({ state: 'deferred' }),
        user: teamMember,
        expected: true
      }
    ];

    const { rerender } = render(<Actions {...props} />);

    // eslint-disable-next-line no-restricted-syntax
    for (const test of tests) {
      const { data, user, expected } = test;
      const componentProps = { ...props, deficientItem: data, user };
      rerender(<Actions {...componentProps} />);
      const action = screen.queryByTestId('action-unpermitted-duplicate');
      expect(Boolean(action)).toEqual(expected);
    }
  });

  it('it only reveals "CLOSE" button when deficient item is completed or incomplete', () => {
    const props = {
      user: admin,
      deficientItem: createDeficientItem(),
      deficientItemUpdates: {},
      onShowHistory: sinon.spy(),
      onClickViewPhotos: sinon.spy(),
      onShowPlanToFix: sinon.spy(),
      onChangePlanToFix: sinon.spy(),
      onShowResponsibilityGroups: sinon.spy(),
      onChangeResponsibilityGroup: sinon.spy(),
      onShowDueDates: sinon.spy(),
      onChangeDueDate: sinon.spy(),
      onShowReasonIncomplete: sinon.spy(),
      onChangeReasonIncomplete: sinon.spy(),
      isUpdatingDeferredDate: false,
      isUpdatingCurrentCompleteNowReason: false
    };

    const tests = [
      {
        data: createDeficientItem({ state: 'requires-action' }),
        expected: false
      },
      {
        data: createDeficientItem({ state: 'completed' }),
        expected: true
      },
      {
        data: createDeficientItem({ state: 'incomplete' }),
        expected: true
      }
    ];

    const { rerender } = render(<Actions {...props} />);

    // eslint-disable-next-line no-restricted-syntax
    for (const test of tests) {
      const { data, expected } = test;
      const componentProps = { ...props, deficientItem: data };
      rerender(<Actions {...componentProps} />);
      const action = screen.queryByTestId('action-close');
      expect(Boolean(action)).toEqual(expected);
    }
  });

  it('it only reveals "DEFER" action when expected', () => {
    const props = {
      user: admin,
      deficientItem: createDeficientItem(),
      deficientItemUpdates: {},
      onShowHistory: sinon.spy(),
      onClickViewPhotos: sinon.spy(),
      onShowPlanToFix: sinon.spy(),
      onChangePlanToFix: sinon.spy(),
      onShowResponsibilityGroups: sinon.spy(),
      onChangeResponsibilityGroup: sinon.spy(),
      onShowDueDates: sinon.spy(),
      onChangeDueDate: sinon.spy(),
      onShowReasonIncomplete: sinon.spy(),
      onChangeReasonIncomplete: sinon.spy(),
      isUpdatingDeferredDate: false,
      isUpdatingCurrentCompleteNowReason: false
    };

    const tests = DEF_ITEM_STATES.map((state) => {
      const expected = DEFER_ACTION_STATES.includes(state);

      return {
        data: createDeficientItem({ state }),
        expected
      };
    });

    const { rerender } = render(<Actions {...props} />);

    // eslint-disable-next-line no-restricted-syntax
    for (const test of tests) {
      const { data, expected } = test;
      const componentProps = { ...props, deficientItem: data };
      rerender(<Actions {...componentProps} />);
      const action = screen.queryByTestId('action-defer');
      expect(Boolean(action)).toEqual(expected);
    }
  });

  it('it triggers an unpermitted defer when initiating defer without permission', () => {
    const expected = true;
    const onUnpermittedDefer = sinon.spy();
    const props = {
      user: teamMember,
      deficientItem: createDeficientItem({ state: 'requires-action' }),
      deficientItemUpdates: {},
      onShowHistory: sinon.spy(),
      onClickViewPhotos: sinon.spy(),
      onShowPlanToFix: sinon.spy(),
      onChangePlanToFix: sinon.spy(),
      onShowResponsibilityGroups: sinon.spy(),
      onChangeResponsibilityGroup: sinon.spy(),
      onShowDueDates: sinon.spy(),
      onChangeDueDate: sinon.spy(),
      onShowReasonIncomplete: sinon.spy(),
      onChangeReasonIncomplete: sinon.spy(),
      isUpdatingDeferredDate: false,
      isUpdatingCurrentCompleteNowReason: false,
      onUnpermittedDefer
    };

    render(<Actions {...props} />);

    const action = screen.queryByTestId('action-unpermitted-defer');
    act(() => {
      userEvent.click(action);
    });

    const actual = onUnpermittedDefer.called;
    expect(actual).toBe(expected);
  });

  it('it allows user to cancel selecting a deferred date', () => {
    const expected = true;
    const onCancelDefer = sinon.spy();
    const props = {
      user: admin,
      deficientItem: createDeficientItem({ state: 'requires-action' }),
      deficientItemUpdates: {},
      onShowHistory: sinon.spy(),
      onClickViewPhotos: sinon.spy(),
      onShowPlanToFix: sinon.spy(),
      onChangePlanToFix: sinon.spy(),
      onShowResponsibilityGroups: sinon.spy(),
      onChangeResponsibilityGroup: sinon.spy(),
      onShowDueDates: sinon.spy(),
      onChangeDueDate: sinon.spy(),
      onShowReasonIncomplete: sinon.spy(),
      onChangeReasonIncomplete: sinon.spy(),
      isUpdatingDeferredDate: true,
      isUpdatingCurrentCompleteNowReason: false,
      onCancelDefer
    };

    render(<Actions {...props} />);

    const action = screen.queryByTestId('action-cancel-defer');

    expect(action).toBeTruthy();

    act(() => {
      userEvent.click(action);
    });

    const actual = onCancelDefer.called;
    expect(actual).toBe(expected);
  });

  it('it allows completing defer once a defer date is set', () => {
    const expected = true;
    const onConfirmDefer = sinon.spy();
    const props = {
      user: admin,
      deficientItem: createDeficientItem({ state: 'requires-action' }),
      showDeferAction: true,
      deficientItemUpdates: { currentDeferredDate: new Date() },
      isUpdatingDeferredDate: true,
      onShowHistory: sinon.spy(),
      onClickViewPhotos: sinon.spy(),
      onShowPlanToFix: sinon.spy(),
      onChangePlanToFix: sinon.spy(),
      onShowResponsibilityGroups: sinon.spy(),
      onChangeResponsibilityGroup: sinon.spy(),
      onShowDueDates: sinon.spy(),
      onChangeDueDate: sinon.spy(),
      onShowReasonIncomplete: sinon.spy(),
      onChangeReasonIncomplete: sinon.spy(),
      isUpdatingCurrentCompleteNowReason: false,
      onConfirmDefer
    };

    render(<Actions {...props} />);

    const action = screen.queryByTestId('action-confirm-defer');

    expect(action).toBeTruthy();

    act(() => {
      userEvent.click(action);
    });

    const actual = onConfirmDefer.called;
    expect(actual).toBe(expected);
  });

  it('it only reveals "COMPLETE NOW" action for expected states', () => {
    const props = {
      user: admin,
      deficientItem: createDeficientItem(),
      deficientItemUpdates: {},
      onShowHistory: sinon.spy(),
      onClickViewPhotos: sinon.spy(),
      onShowPlanToFix: sinon.spy(),
      onChangePlanToFix: sinon.spy(),
      onShowResponsibilityGroups: sinon.spy(),
      onChangeResponsibilityGroup: sinon.spy(),
      onShowDueDates: sinon.spy(),
      onChangeDueDate: sinon.spy(),
      onShowReasonIncomplete: sinon.spy(),
      onChangeReasonIncomplete: sinon.spy(),
      isUpdatingDeferredDate: false,
      isUpdatingCurrentCompleteNowReason: false
    };

    const tests = DEF_ITEM_STATES.map((state) => {
      const expected = COMPLETE_NOW_ACTION_STATES.includes(state);

      return {
        data: createDeficientItem({
          state,
          createdAt: new Date() // less than 48hrs old
        }),
        expected
      };
    });

    const { rerender } = render(<Actions {...props} />);

    // eslint-disable-next-line no-restricted-syntax
    for (const test of tests) {
      const { data, expected } = test;
      const componentProps = { ...props, deficientItem: data };
      rerender(<Actions {...componentProps} />);
      const action = screen.queryByTestId('action-complete-now');
      expect(Boolean(action)).toEqual(expected);
    }
  });

  it('it only reveals "COMPLETE NOW" action for 72 hours for normal users', () => {
    const props = {
      user: teamMember,
      deficientItem: createDeficientItem(),
      deficientItemUpdates: {},
      onShowHistory: sinon.spy(),
      onClickViewPhotos: sinon.spy(),
      onShowPlanToFix: sinon.spy(),
      onChangePlanToFix: sinon.spy(),
      onShowResponsibilityGroups: sinon.spy(),
      onChangeResponsibilityGroup: sinon.spy(),
      onShowDueDates: sinon.spy(),
      onChangeDueDate: sinon.spy(),
      onShowReasonIncomplete: sinon.spy(),
      onChangeReasonIncomplete: sinon.spy(),
      isUpdatingDeferredDate: false,
      isUpdatingCurrentCompleteNowReason: false
    };

    const seventyOneHoursAgo = moment().subtract(71, 'hours').unix();
    const seventyThreeHoursAgo = moment().subtract(73, 'hours').unix();
    // seventyThreeHoursAgo.setHours(now.getHours() - 73);

    const tests = [
      {
        data: createDeficientItem({
          state: 'requires-action',
          createdAt: 1562255644 // Old: 7/4/19
        }),
        expected: false
      },
      {
        data: createDeficientItem({
          state: 'requires-action',
          createdAt: new Date(null) // UNIX Epoche
        }),
        expected: false
      },
      {
        data: createDeficientItem({
          state: 'requires-action',
          createdAt: Date.now() / 1000
        }),
        expected: true
      },
      {
        data: createDeficientItem({
          state: 'requires-action',
          createdAt: new Date()
        }),
        expected: true
      },
      {
        data: createDeficientItem({
          state: 'requires-action',
          createdAt: seventyOneHoursAgo
        }),
        expected: true
      },
      {
        data: createDeficientItem({
          state: 'requires-action',
          createdAt: seventyThreeHoursAgo
        }),
        expected: false
      }
    ];
    const { rerender } = render(<Actions {...props} />);

    // eslint-disable-next-line no-restricted-syntax
    for (const test of tests) {
      const { data, expected } = test;
      const componentProps = { ...props, deficientItem: data };
      rerender(<Actions {...componentProps} />);
      const action = screen.queryByTestId('action-complete-now');
      expect(Boolean(action)).toEqual(expected);
    }
  });

  it('it only reveals "COMPLETE NOW" action for 7 days for corporate users', () => {
    const props = {
      user: corporate,
      deficientItem: createDeficientItem(),
      deficientItemUpdates: {},
      onShowHistory: sinon.spy(),
      onClickViewPhotos: sinon.spy(),
      onShowPlanToFix: sinon.spy(),
      onChangePlanToFix: sinon.spy(),
      onShowResponsibilityGroups: sinon.spy(),
      onChangeResponsibilityGroup: sinon.spy(),
      onShowDueDates: sinon.spy(),
      onChangeDueDate: sinon.spy(),
      onShowReasonIncomplete: sinon.spy(),
      onChangeReasonIncomplete: sinon.spy(),
      isUpdatingDeferredDate: false,
      isUpdatingCurrentCompleteNowReason: false
    };

    const sixDaysAgo = moment().subtract(6, 'days').unix();
    const eightDaysAgo = moment().subtract(8, 'days').unix();

    const tests = [
      {
        data: createDeficientItem({
          state: 'requires-action',
          createdAt: moment().unix()
        }),
        expected: true
      },
      {
        data: createDeficientItem({
          state: 'requires-action',
          createdAt: sixDaysAgo
        }),
        expected: true
      },
      {
        data: createDeficientItem({
          state: 'requires-action',
          createdAt: eightDaysAgo
        }),
        expected: false
      }
    ];

    const { rerender } = render(<Actions {...props} />);

    // eslint-disable-next-line no-restricted-syntax
    for (const test of tests) {
      const { data, expected } = test;
      const componentProps = { ...props, deficientItem: data };
      rerender(<Actions {...componentProps} />);
      const action = screen.queryByTestId('action-complete-now');
      expect(Boolean(action)).toEqual(expected);
    }
  });

  it('it always reveals "COMPLETE NOW" action for admin users', () => {
    const props = {
      user: admin,
      deficientItem: createDeficientItem(),
      deficientItemUpdates: {},
      onShowHistory: sinon.spy(),
      onClickViewPhotos: sinon.spy(),
      onShowPlanToFix: sinon.spy(),
      onChangePlanToFix: sinon.spy(),
      onShowResponsibilityGroups: sinon.spy(),
      onChangeResponsibilityGroup: sinon.spy(),
      onShowDueDates: sinon.spy(),
      onChangeDueDate: sinon.spy(),
      onShowReasonIncomplete: sinon.spy(),
      onChangeReasonIncomplete: sinon.spy(),
      isUpdatingDeferredDate: false,
      isUpdatingCurrentCompleteNowReason: false
    };

    const sixDaysAgo = moment().subtract(6, 'days').unix();
    const eightDaysAgo = moment().subtract(8, 'days').unix();

    const tests = [
      {
        data: createDeficientItem({
          state: 'requires-action',
          createdAt: moment().unix()
        }),
        expected: true
      },
      {
        data: createDeficientItem({
          state: 'requires-action',
          createdAt: sixDaysAgo
        }),
        expected: true
      },
      {
        data: createDeficientItem({
          state: 'requires-action',
          createdAt: eightDaysAgo
        }),
        expected: true
      }
    ];

    const { rerender } = render(<Actions {...props} />);

    // eslint-disable-next-line no-restricted-syntax
    for (const test of tests) {
      const { data, expected } = test;
      const componentProps = { ...props, deficientItem: data };
      rerender(<Actions {...componentProps} />);
      const action = screen.queryByTestId('action-complete-now');
      expect(Boolean(action)).toEqual(expected);
    }
  });

  it('it allows user to trigger canceling a complete now', () => {
    const expected = true;
    const onCancelCompleteNow = sinon.spy();
    const props = {
      user: admin,
      deficientItem: createDeficientItem({ state: 'requires-action' }),
      showCompleteNowAction: true,
      deficientItemUpdates: {},
      isUpdatingCurrentCompleteNowReason: true,
      onShowHistory: sinon.spy(),
      onClickViewPhotos: sinon.spy(),
      onShowPlanToFix: sinon.spy(),
      onChangePlanToFix: sinon.spy(),
      onShowResponsibilityGroups: sinon.spy(),
      onChangeResponsibilityGroup: sinon.spy(),
      onShowDueDates: sinon.spy(),
      onChangeDueDate: sinon.spy(),
      onShowReasonIncomplete: sinon.spy(),
      onChangeReasonIncomplete: sinon.spy(),
      onCancelCompleteNow
    };

    render(<Actions {...props} />);

    const action = screen.queryByTestId('action-cancel-complete-now');

    expect(action).toBeTruthy();

    act(() => {
      userEvent.click(action);
    });

    const actual = onCancelCompleteNow.called;
    expect(actual).toBe(expected);
  });

  it('it only reveals pending "UPDATE" action for expected states', () => {
    const props = {
      user: admin,
      deficientItem: createDeficientItem(),
      deficientItemUpdates: {
        currentPlanToFix: 'valid',
        currentResponsibilityGroup: 'valid',
        currentDueDate: 'date'
      },
      onShowHistory: sinon.spy(),
      onClickViewPhotos: sinon.spy(),
      onShowPlanToFix: sinon.spy(),
      onChangePlanToFix: sinon.spy(),
      onShowResponsibilityGroups: sinon.spy(),
      onChangeResponsibilityGroup: sinon.spy(),
      onShowDueDates: sinon.spy(),
      onChangeDueDate: sinon.spy(),
      onShowReasonIncomplete: sinon.spy(),
      onChangeReasonIncomplete: sinon.spy(),
      isUpdatingDeferredDate: false,
      isUpdatingCurrentCompleteNowReason: false
    };

    const tests = DEF_ITEM_STATES.map((state) => {
      const expected = PENDING_STATE_ELIGIBLE_STATES.includes(state);

      return {
        data: createDeficientItem({ state }),
        expected
      };
    });

    const { rerender } = render(<Actions {...props} />);

    // eslint-disable-next-line no-restricted-syntax
    for (const test of tests) {
      const { data, expected } = test;
      const componentProps = { ...props, deficientItem: data };
      rerender(<Actions {...componentProps} />);
      const action = screen.queryByTestId('action-update-pending');
      expect(Boolean(action)).toEqual(expected);
    }
  });

  it('it does not reveal any update pending actions before user has made any updates', () => {
    const props = {
      user: admin,
      deficientItem: createDeficientItem({ state: 'requires-action' }),
      deficientItemUpdates: {},
      onShowHistory: sinon.spy(),
      onClickViewPhotos: sinon.spy(),
      onShowPlanToFix: sinon.spy(),
      onChangePlanToFix: sinon.spy(),
      onShowResponsibilityGroups: sinon.spy(),
      onChangeResponsibilityGroup: sinon.spy(),
      onShowDueDates: sinon.spy(),
      onChangeDueDate: sinon.spy(),
      onShowReasonIncomplete: sinon.spy(),
      onChangeReasonIncomplete: sinon.spy(),
      isUpdatingDeferredDate: false,
      isUpdatingCurrentCompleteNowReason: false
    };

    render(<Actions {...props} />);

    const updatePendingAction = screen.queryByTestId('action-update-pending');
    const updatePendingUnpermittedAction = screen.queryByTestId(
      'action-unpermitted-pending'
    );

    expect(updatePendingAction).toBeNull();
    expect(updatePendingUnpermittedAction).toBeNull();
  });

  it('it triggers unpermitted pending when lacking required user updates', () => {
    const onUnpermittedPending = sinon.spy();
    const props = {
      user: admin,
      deficientItem: createDeficientItem({ state: 'requires-action' }),
      deficientItemUpdates: {},
      onShowHistory: sinon.spy(),
      onClickViewPhotos: sinon.spy(),
      onShowPlanToFix: sinon.spy(),
      onChangePlanToFix: sinon.spy(),
      onShowResponsibilityGroups: sinon.spy(),
      onChangeResponsibilityGroup: sinon.spy(),
      onShowDueDates: sinon.spy(),
      onChangeDueDate: sinon.spy(),
      onShowReasonIncomplete: sinon.spy(),
      onChangeReasonIncomplete: sinon.spy(),
      isUpdatingDeferredDate: false,
      isUpdatingCurrentCompleteNowReason: false,
      onUnpermittedPending
    };

    const tests = [
      {
        data: { currentPlanToFix: 'valid' },
        expected: true
      },
      {
        data: {
          currentPlanToFix: 'valid',
          currentResponsibilityGroup: 'valid'
        },
        expected: true
      },
      {
        data: {
          currentPlanToFix: 'valid',
          currentResponsibilityGroup: 'valid',
          currentDueDate: 'valid'
        },
        expected: false
      }
    ];

    const { rerender } = render(<Actions {...props} />);

    // eslint-disable-next-line no-restricted-syntax
    for (const test of tests) {
      const { data, expected } = test;
      const componentProps = { ...props, deficientItemUpdates: data };
      rerender(<Actions {...componentProps} />);
      const action = screen.queryByTestId('action-unpermitted-pending');

      expect(Boolean(action)).toEqual(expected);
      if (action) {
        act(() => {
          userEvent.click(action);
        });

        const actual = onUnpermittedPending.called;
        expect(actual).toEqual(expected);
      }
    }
  });

  it('it only reveals add progress note action when expected', () => {
    const props = {
      user: admin,
      deficientItem: createDeficientItem(),
      deficientItemUpdates: {
        progressNote: 'valid'
      },
      onShowHistory: sinon.spy(),
      onClickViewPhotos: sinon.spy(),
      onShowPlanToFix: sinon.spy(),
      onChangePlanToFix: sinon.spy(),
      onShowResponsibilityGroups: sinon.spy(),
      onChangeResponsibilityGroup: sinon.spy(),
      onShowDueDates: sinon.spy(),
      onChangeDueDate: sinon.spy(),
      onShowReasonIncomplete: sinon.spy(),
      onChangeReasonIncomplete: sinon.spy(),
      isUpdatingDeferredDate: false,
      isUpdatingCurrentCompleteNowReason: false
    };

    const tests = DEF_ITEM_STATES.map((state) => {
      const expected = PROGRESS_NOTE_EDIT_STATES.includes(state);

      return {
        data: createDeficientItem({ state }),
        expected
      };
    });

    const { rerender } = render(<Actions {...props} />);

    // eslint-disable-next-line no-restricted-syntax
    for (const test of tests) {
      const { data, expected } = test;
      const componentProps = { ...props, deficientItem: data };
      rerender(<Actions {...componentProps} />);
      const action = screen.queryByTestId('action-add-progress-note');
      expect(Boolean(action)).toEqual(expected);
    }
  });

  it('it allows adding a progress note after user provides valid update', () => {
    const onAddProgressNote = sinon.spy();
    const props = {
      user: admin,
      deficientItem: createDeficientItem({
        state: PROGRESS_NOTE_EDIT_STATES[0]
      }),
      deficientItemUpdates: {},
      onShowHistory: sinon.spy(),
      onClickViewPhotos: sinon.spy(),
      onShowPlanToFix: sinon.spy(),
      onChangePlanToFix: sinon.spy(),
      onShowResponsibilityGroups: sinon.spy(),
      onChangeResponsibilityGroup: sinon.spy(),
      onShowDueDates: sinon.spy(),
      onChangeDueDate: sinon.spy(),
      onShowReasonIncomplete: sinon.spy(),
      onChangeReasonIncomplete: sinon.spy(),
      isUpdatingDeferredDate: false,
      isUpdatingCurrentCompleteNowReason: false,
      onAddProgressNote
    };

    const tests = [
      {
        data: { progressNote: '' },
        expected: false
      },
      {
        data: {
          progressNote: 'valid'
        },
        expected: true
      }
    ];

    const { rerender } = render(<Actions {...props} />);

    // eslint-disable-next-line no-restricted-syntax
    for (const test of tests) {
      const { data, expected } = test;
      const componentProps = { ...props, deficientItemUpdates: data };
      rerender(<Actions {...componentProps} />);
      const action = screen.queryByTestId('action-add-progress-note');

      expect(Boolean(action)).toEqual(expected);
      if (action) {
        act(() => {
          userEvent.click(action);
        });

        const actual = onAddProgressNote.called;
        expect(actual).toEqual(expected);
      }
    }
  });

  it('it only reveals incomplete "UPDATE" action for expected states', () => {
    const props = {
      user: admin,
      deficientItem: createDeficientItem(),
      deficientItemUpdates: { currentReasonIncomplete: 'valid' },
      onShowHistory: sinon.spy(),
      onClickViewPhotos: sinon.spy(),
      onShowPlanToFix: sinon.spy(),
      onChangePlanToFix: sinon.spy(),
      onShowResponsibilityGroups: sinon.spy(),
      onChangeResponsibilityGroup: sinon.spy(),
      onShowDueDates: sinon.spy(),
      onChangeDueDate: sinon.spy(),
      onShowReasonIncomplete: sinon.spy(),
      onChangeReasonIncomplete: sinon.spy(),
      isUpdatingDeferredDate: false,
      isUpdatingCurrentCompleteNowReason: false
    };

    const tests = DEF_ITEM_STATES.map((state) => {
      const expected = INCOMPLETE_UPDATE_STATES.includes(state);

      return {
        data: createDeficientItem({ state }),
        expected
      };
    });

    const { rerender } = render(<Actions {...props} />);

    // eslint-disable-next-line no-restricted-syntax
    for (const test of tests) {
      const { data, expected } = test;
      const componentProps = { ...props, deficientItem: data };
      rerender(<Actions {...componentProps} />);
      const action = screen.queryByTestId('action-update-incomplete');
      expect(Boolean(action)).toEqual(expected);
    }
  });

  it('it allows transitioning to incomplete after user provides valid reason', () => {
    const onUpdateIncomplete = sinon.spy();
    const props = {
      user: admin,
      deficientItem: createDeficientItem({
        state: INCOMPLETE_UPDATE_STATES[0]
      }),
      deficientItemUpdates: {},
      onShowHistory: sinon.spy(),
      onClickViewPhotos: sinon.spy(),
      onShowPlanToFix: sinon.spy(),
      onChangePlanToFix: sinon.spy(),
      onShowResponsibilityGroups: sinon.spy(),
      onChangeResponsibilityGroup: sinon.spy(),
      onShowDueDates: sinon.spy(),
      onChangeDueDate: sinon.spy(),
      onShowReasonIncomplete: sinon.spy(),
      onChangeReasonIncomplete: sinon.spy(),
      isUpdatingDeferredDate: false,
      isUpdatingCurrentCompleteNowReason: false,
      onUpdateIncomplete
    };

    const tests = [
      {
        data: { currentReasonIncomplete: '' },
        expected: false
      },
      {
        data: {
          currentReasonIncomplete: 'valid'
        },
        expected: true
      }
    ];

    const { rerender } = render(<Actions {...props} />);

    // eslint-disable-next-line no-restricted-syntax
    for (const test of tests) {
      const { data, expected } = test;
      const componentProps = { ...props, deficientItemUpdates: data };
      rerender(<Actions {...componentProps} />);
      const action = screen.queryByTestId('action-update-incomplete');

      expect(Boolean(action)).toEqual(expected);
      if (action) {
        act(() => {
          userEvent.click(action);
        });

        const actual = onUpdateIncomplete.called;
        expect(actual).toEqual(expected);
      }
    }
  });

  it('it triggers each actions for each relvant DI state', () => {
    const onComplete = sinon.spy();
    const onGoBack = sinon.spy();
    const onClose = sinon.spy();
    const onInitiateDefer = sinon.spy();
    const props = {
      user: admin,
      deficientItem: createDeficientItem({
        state: PROGRESS_NOTE_EDIT_STATES[0]
      }),
      deficientItemUpdates: {},
      onShowHistory: sinon.spy(),
      onClickViewPhotos: sinon.spy(),
      onShowPlanToFix: sinon.spy(),
      onChangePlanToFix: sinon.spy(),
      onShowResponsibilityGroups: sinon.spy(),
      onChangeResponsibilityGroup: sinon.spy(),
      onShowDueDates: sinon.spy(),
      onChangeDueDate: sinon.spy(),
      onShowReasonIncomplete: sinon.spy(),
      onChangeReasonIncomplete: sinon.spy(),
      isUpdatingDeferredDate: false,
      isUpdatingCurrentCompleteNowReason: false,
      onComplete,
      onGoBack,
      onClose,
      onInitiateDefer
    };

    const tests = [
      {
        data: createDeficientItem({ state: 'pending' }),
        selector: 'action-completed',
        expected: true,
        method: onComplete
      },
      {
        data: createDeficientItem({ state: 'completed' }),
        selector: 'action-go-back',
        expected: false,
        method: onGoBack
      },
      {
        data: createDeficientItem({ state: 'incomplete' }),
        selector: 'action-close',
        expected: false,
        method: onClose
      },
      {
        data: createDeficientItem({ state: 'requires-action' }),
        selector: 'action-defer',
        expected: true,
        method: onInitiateDefer
      }
    ];

    const { rerender } = render(<Actions {...props} />);

    // eslint-disable-next-line no-restricted-syntax
    for (const test of tests) {
      const { data, selector, method, expected } = test;
      const componentProps = { ...props, deficientItemUpdates: data };
      rerender(<Actions {...componentProps} />);
      const action = screen.queryByTestId(selector);

      expect(Boolean(action)).toEqual(expected);
      if (action) {
        act(() => {
          userEvent.click(action);
        });

        const actual = method.called;
        expect(actual).toBeTruthy();
      }
    }
  });

  it('it only reveals show completed photos button when deficient item has completed photos', () => {
    const props = {
      user: admin,
      deficientItem: createDeficientItem(),
      deficientItemUpdates: { currentReasonIncomplete: 'valid' },
      onShowHistory: sinon.spy(),
      onClickViewPhotos: sinon.spy(),
      onShowPlanToFix: sinon.spy(),
      onChangePlanToFix: sinon.spy(),
      onShowResponsibilityGroups: sinon.spy(),
      onChangeResponsibilityGroup: sinon.spy(),
      onShowDueDates: sinon.spy(),
      onChangeDueDate: sinon.spy(),
      onShowReasonIncomplete: sinon.spy(),
      onChangeReasonIncomplete: sinon.spy(),
      isUpdatingDeferredDate: false,
      isUpdatingCurrentCompleteNowReason: false
    };

    const tests = [
      {
        data: createDeficientItem({ state: 'pending' }), // no completed photos
        expected: false
      },
      {
        data: createDeficientItem({ state: 'pending' }, { completedPhotos: 1 }), // has completed photos
        expected: true
      },
      {
        data: createDeficientItem({ state: 'closed' }, { completedPhotos: 1 }), // has completed photos
        expected: true
      }
    ];

    const { rerender } = render(<Actions {...props} />);

    // eslint-disable-next-line no-restricted-syntax
    for (const test of tests) {
      const { data, expected } = test;
      const componentProps = { ...props, deficientItem: data };
      rerender(<Actions {...componentProps} />);
      const action = screen.queryByTestId('action-show-completed-photos');
      expect(Boolean(action)).toEqual(expected);
    }
  });

  it('it triggers request to show completed photos when present', () => {
    const expected = true;
    const onShowCompletedPhotos = sinon.spy();
    const props = {
      user: admin,
      deficientItem: createDeficientItem(
        { state: 'pending' },
        { completedPhotos: 1 }
      ),
      deficientItemUpdates: {},
      onShowHistory: sinon.spy(),
      onClickViewPhotos: sinon.spy(),
      onShowPlanToFix: sinon.spy(),
      onChangePlanToFix: sinon.spy(),
      onShowResponsibilityGroups: sinon.spy(),
      onChangeResponsibilityGroup: sinon.spy(),
      onShowDueDates: sinon.spy(),
      onChangeDueDate: sinon.spy(),
      onShowReasonIncomplete: sinon.spy(),
      onChangeReasonIncomplete: sinon.spy(),
      isUpdatingDeferredDate: false,
      isUpdatingCurrentCompleteNowReason: false,
      onShowCompletedPhotos
    };

    render(<Actions {...props} />);

    const action = screen.queryByTestId('action-show-completed-photos');
    expect(action).toBeTruthy();

    act(() => {
      userEvent.click(action);
    });

    const actual = onShowCompletedPhotos.called;
    expect(actual).toEqual(expected);
  });
});
