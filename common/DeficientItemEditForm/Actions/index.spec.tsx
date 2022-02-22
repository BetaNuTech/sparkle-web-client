import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import sinon from 'sinon';
import moment from 'moment';
import {
  admin,
  corporate,
  noAccess,
  propertyMember,
  teamMember
} from '../../../__mocks__/users';
import createDeficientItem from '../../../__tests__/helpers/createDeficientItem';
import settings from '../settings';
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

  it('only reveals "COMPLETED" button when deficient item is pending and has unpublished photos', () => {
    const props = {
      user: admin,
      isOnline: true,
      deficientItem: createDeficientItem(),
      updates: {},
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
      hasUnpublishedPhotos: true
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

  // eslint-disable-next-line max-len
  it('only reveals "COMPLETE" button to admin, corporate, or property level users when deficient item state is pending', () => {
    const deficientItem = createDeficientItem({
      state: 'pending',
      property: 'property-1'
    });
    const props = {
      user: admin,
      isOnline: true,
      deficientItem,
      updates: {},
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
      hasUnpublishedPhotos: true
    };

    const tests = [
      {
        user: noAccess,
        expected: false,
        message: 'should not render COMPLETE button'
      },
      {
        user: admin,
        expected: true,
        message: 'should render COMPLETE button for admin user'
      },
      {
        user: corporate,
        expected: true,
        message: 'should render COMPLETE button for corporate user'
      },
      {
        user: propertyMember,
        expected: true,
        message: 'should render COMPLETE button for property level user'
      }
    ];

    const { rerender } = render(<Actions {...props} />);

    // eslint-disable-next-line no-restricted-syntax
    for (const test of tests) {
      const { user, expected, message } = test;
      const componentProps = { ...props, user };
      rerender(<Actions {...componentProps} />);
      const action = screen.queryByTestId('action-completed');
      expect(Boolean(action), message).toEqual(expected);
    }
  });

  it('reveals "GO BACK" action for expected deficiency states', () => {
    const props = {
      user: admin,
      isOnline: true,
      deficientItem: createDeficientItem(),
      updates: {},
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

  it('reveals "GO BACK" action when user requests to move to go back', () => {
    const expected = true;
    const state = GO_BACK_ACTION_STATES[0];
    const props = {
      user: admin,
      isOnline: true,
      deficientItem: createDeficientItem({ state }),
      updates: {},
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
      nextState: 'go-back' // requested state
    };

    render(<Actions {...props} />);

    // eslint-disable-next-line no-restricted-syntax
    const actual = Boolean(screen.queryByTestId('action-go-back'));
    expect(actual).toEqual(expected);
  });

  it('only reveals "DUPLICATE" button when deficient item is deferred', () => {
    const props = {
      user: admin,
      isOnline: true,
      deficientItem: createDeficientItem(),
      updates: {},
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

  it('only reveals "DUPLICATE" permission warning button when lacking permissions', () => {
    const props = {
      user: admin,
      isOnline: true,
      deficientItem: createDeficientItem(),
      updates: {},
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

  it('only reveals "CLOSE" button when deficient item is completed or incomplete', () => {
    const props = {
      user: admin,
      isOnline: true,
      deficientItem: createDeficientItem(),
      updates: {},
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

  it('reveals "CLOSE" action when user requests to move to closed', () => {
    const expected = true;
    const props = {
      user: admin,
      isOnline: true,
      deficientItem: createDeficientItem({ state: 'completed' }),
      updates: {},
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
      nextState: 'closed' // requested state
    };

    render(<Actions {...props} />);

    // eslint-disable-next-line no-restricted-syntax
    const actual = Boolean(screen.queryByTestId('action-close'));
    expect(actual).toEqual(expected);
  });

  it('only reveals "DEFER" action when expected', () => {
    const props = {
      user: admin,
      isOnline: true,
      deficientItem: createDeficientItem(),
      updates: {},
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

  it('reveals "DEFER" action when user requests to move to deferred', () => {
    const expected = true;
    const props = {
      user: admin,
      isOnline: true,
      deficientItem: createDeficientItem({ state: DEFER_ACTION_STATES[0] }),
      updates: {},
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
      nextState: 'deferred' // requested state
    };

    render(<Actions {...props} />);

    // eslint-disable-next-line no-restricted-syntax
    const actual = Boolean(screen.queryByTestId('action-defer'));
    expect(actual).toEqual(expected);
  });

  it('triggers an unpermitted defer when initiating defer without permission', () => {
    const expected = true;
    const onUnpermittedDefer = sinon.spy();
    const props = {
      user: teamMember,
      isOnline: true,
      deficientItem: createDeficientItem({ state: 'requires-action' }),
      updates: {},
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

  it('allows user to cancel selecting a deferred date', () => {
    const expected = true;
    const onCancelDefer = sinon.spy();
    const props = {
      user: admin,
      isOnline: true,
      deficientItem: createDeficientItem({ state: 'requires-action' }),
      updates: {},
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

  it('allows completing defer once a defer date is set', () => {
    const expected = true;
    const onConfirmDefer = sinon.spy();
    const props = {
      user: admin,
      isOnline: true,
      deficientItem: createDeficientItem({ state: 'requires-action' }),
      showDeferAction: true,
      updates: { currentDeferredDate: new Date() },
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

  it('only reveals "COMPLETE NOW" action for expected states', () => {
    const props = {
      user: admin,
      isOnline: true,
      deficientItem: createDeficientItem(),
      updates: {},
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

  it('only reveals "COMPLETE NOW" action for 72 hours for normal users', () => {
    const props = {
      user: teamMember,
      deficientItem: createDeficientItem(),
      updates: {},
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

  it('only reveals "COMPLETE NOW" action for 7 days for corporate users', () => {
    const props = {
      user: corporate,
      deficientItem: createDeficientItem(),
      updates: {},
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

  it('always reveals "COMPLETE NOW" action for admin users', () => {
    const props = {
      user: admin,
      isOnline: true,
      deficientItem: createDeficientItem(),
      updates: {},
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

  it('allows user to trigger canceling a complete now', () => {
    const expected = true;
    const onCancelCompleteNow = sinon.spy();
    const props = {
      user: admin,
      isOnline: true,
      deficientItem: createDeficientItem({ state: 'requires-action' }),
      showCompleteNowAction: true,
      updates: {},
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

  it('only reveals pending "UPDATE" action for expected states', () => {
    const props = {
      user: admin,
      isOnline: true,
      deficientItem: createDeficientItem(),
      updates: {
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

  it('does not enable any update pending actions before user has made any updates', () => {
    const props = {
      user: admin,
      isOnline: true,
      deficientItem: createDeficientItem({ state: 'requires-action' }),
      updates: {},
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
    expect(updatePendingUnpermittedAction).toBeDisabled();
  });

  it('triggers unpermitted pending when lacking required user updates', () => {
    const onUnpermittedPending = sinon.spy();
    const props = {
      user: admin,
      isOnline: true,
      deficientItem: createDeficientItem({ state: 'requires-action' }),
      updates: {},
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
      const componentProps = { ...props, updates: data };
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

  it('only reveals add progress note action when expected', () => {
    const props = {
      user: admin,
      isOnline: true,
      deficientItem: createDeficientItem(),
      updates: {
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

  it('allows adding a progress note after user provides valid update', () => {
    const onAddProgressNote = sinon.spy();
    const props = {
      user: admin,
      isOnline: true,
      deficientItem: createDeficientItem({
        state: PROGRESS_NOTE_EDIT_STATES[0]
      }),
      updates: {},
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
      const componentProps = { ...props, updates: data };
      rerender(<Actions {...componentProps} />);
      const action = screen.queryByTestId('action-add-progress-note');

      if (expected) {
        expect(action).toBeEnabled();
      } else {
        expect(action).toBeDisabled();
      }

      if (action) {
        act(() => {
          userEvent.click(action);
        });

        const actual = onAddProgressNote.called;
        expect(actual).toEqual(expected);
      }
    }
  });

  it('only reveals incomplete "UPDATE" action for expected states', () => {
    const props = {
      user: admin,
      isOnline: true,
      deficientItem: createDeficientItem(),
      updates: { currentReasonIncomplete: 'valid' },
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

  it('allows transitioning to incomplete after user provides valid reason', () => {
    const onUpdateIncomplete = sinon.spy();
    const props = {
      user: admin,
      isOnline: true,
      deficientItem: createDeficientItem({
        state: INCOMPLETE_UPDATE_STATES[0]
      }),
      updates: {},
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
      const componentProps = { ...props, updates: data };
      rerender(<Actions {...componentProps} />);
      const action = screen.queryByTestId('action-update-incomplete');

      if (expected) {
        expect(action).toBeEnabled();
      } else {
        expect(action).toBeDisabled();
      }

      if (action) {
        act(() => {
          userEvent.click(action);
        });

        const actual = onUpdateIncomplete.called;
        expect(actual).toEqual(expected);
      }
    }
  });

  it('triggers each actions for each relvant DI state', () => {
    const onComplete = sinon.spy();
    const onAddCompletionPhotos = sinon.spy();
    const onGoBack = sinon.spy();
    const onClose = sinon.spy();
    const onInitiateDefer = sinon.spy();
    const props = {
      user: admin,
      isOnline: true,
      deficientItem: createDeficientItem({
        state: PROGRESS_NOTE_EDIT_STATES[0]
      }),
      updates: {},
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
      onInitiateDefer,
      onAddCompletionPhotos
    };

    const tests = [
      {
        data: createDeficientItem({ state: 'pending' }),
        selector: 'action-add-completion-photos',
        expected: true,
        method: onAddCompletionPhotos
      },

      {
        data: createDeficientItem({ state: 'pending' }),
        selector: 'action-completed',
        expected: true,
        method: onComplete,
        message: 'should render COMPLETE button'
      },
      {
        data: createDeficientItem({ state: 'completed' }),
        selector: 'action-go-back',
        expected: false,
        method: onGoBack,
        message: 'should render GO BACK button'
      },
      {
        data: createDeficientItem({ state: 'incomplete' }),
        selector: 'action-close',
        expected: false,
        method: onClose,
        message: 'should render CLOSE button'
      },
      {
        data: createDeficientItem({ state: 'requires-action' }),
        selector: 'action-defer',
        expected: true,
        method: onInitiateDefer,
        message: 'should render DEFER button'
      }
    ];

    const { rerender } = render(<Actions {...props} />);

    // eslint-disable-next-line no-restricted-syntax
    for (const test of tests) {
      const { data, selector, method, expected, message } = test;
      const hasUnpublishedPhotos = selector === 'action-completed';
      const componentProps = { ...props, updates: data, hasUnpublishedPhotos };
      rerender(<Actions {...componentProps} />);
      const action = screen.queryByTestId(selector);

      expect(Boolean(action), message).toEqual(expected);
      if (action) {
        act(() => {
          userEvent.click(action);
        });

        const actual = method.called;
        expect(actual, message).toBeTruthy();
      }
    }
  });

  // eslint-disable-next-line max-len
  it('only reveals show completed photos button when deficient item has completed photos, or state is pending with unpublished photos', () => {
    const props = {
      user: admin,
      isOnline: true,
      deficientItem: createDeficientItem(),
      updates: { currentReasonIncomplete: 'valid' },
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
        expected: false,
        message: 'should not render show completed photos button'
      },
      {
        data: createDeficientItem({ state: 'pending' }, { completedPhotos: 1 }), // has completed photos
        expected: true,
        message: 'should render show completed photos button'
      },
      {
        data: createDeficientItem({ state: 'closed' }, { completedPhotos: 1 }), // has completed photos
        expected: true,
        message: 'should render show completed photos button'
      },
      {
        data: createDeficientItem({ state: 'pending' }), // has completed photos,
        hasUnpublishedPhotos: true,
        expected: true,
        message:
          'should render show completed photos button if item has unpublished photos'
      }
    ];

    const { rerender } = render(<Actions {...props} />);

    // eslint-disable-next-line no-restricted-syntax
    for (const test of tests) {
      const { data, expected, message, hasUnpublishedPhotos } = test;
      const componentProps = {
        ...props,
        deficientItem: data,
        hasUnpublishedPhotos
      };
      rerender(<Actions {...componentProps} />);
      const action = screen.queryByTestId('action-show-completed-photos');
      expect(Boolean(action), message).toEqual(expected);
    }
  });

  it('triggers request to show completed photos when present', () => {
    const expected = true;
    const onShowCompletedPhotos = sinon.spy();
    const props = {
      user: admin,
      isOnline: true,
      deficientItem: createDeficientItem(
        { state: 'pending' },
        { completedPhotos: 1 }
      ),
      updates: {},
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
