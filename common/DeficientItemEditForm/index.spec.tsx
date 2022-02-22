import { render, screen } from '@testing-library/react';
import sinon from 'sinon';
import createDeficientItem from '../../__tests__/helpers/createDeficientItem';
import { admin } from '../../__mocks__/users';
import { fullProperty } from '../../__mocks__/properties';
import settings from './settings';
import DeficientItemEditForm from './index';

const DEF_ITEM_STATES = settings.deficientItemStates;
const PLANS_TO_FIX_EDIT_STATES = settings.plansToFixEditStates;
const PROGRESS_NOTE_STATES = settings.progressNoteStates;
const PROGRESS_NOTE_EDIT_STATES = settings.progressNoteEditStates;
const RESP_GROUP_EDIT_STATES = settings.respGroupEditStates;
const DUE_DATE_EDIT_STATES = settings.dueDateEditStates;
const REASON_INCOMPLETE_STATES = settings.reasonIncompleteStates;

describe('Unit | Common | Deficient Item Edit Form', () => {
  afterEach(() => sinon.restore());

  it('should show notes section when DI has inspector notes', () => {
    const props = {
      user: admin,
      property: fullProperty,
      deficientItem: createDeficientItem({
        itemInspectorNotes: 'inspector notes'
      }),
      updates: {},
      isMobile: false,
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
    render(<DeficientItemEditForm {...props} />);

    const notesSection = screen.queryByTestId('item-notes');
    expect(notesSection).toBeTruthy();
  });

  it('should hide notes section when DI does not have inspector notes', () => {
    const props = {
      user: admin,
      property: fullProperty,
      deficientItem: createDeficientItem({
        itemInspectorNotes: ''
      }),
      updates: {},
      isMobile: false,
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
    render(<DeficientItemEditForm {...props} />);

    const notesSection = screen.queryByTestId('item-notes');
    expect(notesSection).toBeNull();
  });

  it('it renders responsibility groups section for expected deficient item states', () => {
    const props = {
      user: admin,
      property: fullProperty,
      deficientItem: createDeficientItem(),
      updates: {},
      isMobile: false,
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
      const expected = RESP_GROUP_EDIT_STATES.includes(state);

      const currentResponsibilityGroup =
        state === 'closed' ? 'current responsibility group' : null;
      return {
        // requires previous responsiblity group for closed state
        data: createDeficientItem(
          { state, currentResponsibilityGroup },
          { responsibilityGroups: 1 }
        ),
        expected
      };
    });

    const { rerender } = render(<DeficientItemEditForm {...props} />);

    // eslint-disable-next-line no-restricted-syntax
    for (const test of tests) {
      const { data, expected } = test;
      const componentProps = { ...props, deficientItem: data };
      rerender(<DeficientItemEditForm {...componentProps} />);
      const responsibilityGroupSection = screen.queryByTestId(
        'item-responsibility-group'
      );
      expect(Boolean(responsibilityGroupSection)).toEqual(expected);
    }
  });

  it('it hides current responsibility group section when not relevant', () => {
    const props = {
      user: admin,
      property: fullProperty,
      deficientItem: createDeficientItem(),
      updates: {},
      isMobile: false,
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
        isUpdatingDeferredDate: true,
        isUpdatingCurrentCompleteNowReason: false,
        data: createDeficientItem({ state: 'requires-action' }),
        expected: false
      },
      {
        isUpdatingDeferredDate: false,
        isUpdatingCurrentCompleteNowReason: true,
        data: createDeficientItem({ state: 'requires-action' }),
        expected: false
      },
      {
        isUpdatingDeferredDate: false,
        isUpdatingCurrentCompleteNowReason: false,
        data: createDeficientItem({ state: 'closed' }),
        expected: false
      },
      {
        isUpdatingDeferredDate: false,
        isUpdatingCurrentCompleteNowReason: false,
        data: createDeficientItem({ state: 'requires-action' }),
        expected: true
      }
    ];

    const { rerender } = render(<DeficientItemEditForm {...props} />);

    // eslint-disable-next-line no-restricted-syntax
    for (const test of tests) {
      const {
        data,
        expected,
        isUpdatingDeferredDate,
        isUpdatingCurrentCompleteNowReason
      } = test;
      const componentProps = {
        ...props,
        deficientItem: data,
        isUpdatingDeferredDate,
        isUpdatingCurrentCompleteNowReason
      };
      rerender(<DeficientItemEditForm {...componentProps} />);
      const responsibilityGroupSection = screen.queryByTestId(
        'item-responsibility-group'
      );

      expect(Boolean(responsibilityGroupSection)).toEqual(expected);
    }
  });

  it('it renders current plans to fix section for expected deficient item states', () => {
    const props = {
      user: admin,
      property: fullProperty,
      deficientItem: createDeficientItem(),
      updates: {},
      isMobile: false,
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
      const expected = PLANS_TO_FIX_EDIT_STATES.includes(state);

      const currentPlanToFix = state === 'closed' ? 'Plan to fix' : null;
      return {
        // previous plans to fix required for closed state
        data: createDeficientItem(
          { state, currentPlanToFix },
          { plansToFix: 1 }
        ),
        expected
      };
    });

    const { rerender } = render(<DeficientItemEditForm {...props} />);

    // eslint-disable-next-line no-restricted-syntax
    for (const test of tests) {
      const { data, expected } = test;
      const componentProps = { ...props, deficientItem: data };
      rerender(<DeficientItemEditForm {...componentProps} />);
      const planToFixSection = screen.queryByTestId('item-plan-to-fix');
      expect(Boolean(planToFixSection)).toEqual(expected);
    }
  });

  it('it hides current plan to fix section when not relevant', () => {
    const props = {
      user: admin,
      property: fullProperty,
      deficientItem: createDeficientItem(),
      updates: {},
      isMobile: false,
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
        isUpdatingDeferredDate: true,
        isUpdatingCurrentCompleteNowReason: false,
        data: createDeficientItem({ state: 'requires-action' }),
        expected: false
      },
      {
        isUpdatingDeferredDate: false,
        isUpdatingCurrentCompleteNowReason: true,
        data: createDeficientItem({ state: 'requires-action' }),
        expected: false
      },
      {
        isUpdatingDeferredDate: false,
        isUpdatingCurrentCompleteNowReason: false,
        data: createDeficientItem({ state: 'closed' }),
        expected: false
      },
      {
        isUpdatingDeferredDate: false,
        isUpdatingCurrentCompleteNowReason: false,
        data: createDeficientItem({ state: 'requires-action' }),
        expected: true
      }
    ];

    const { rerender } = render(<DeficientItemEditForm {...props} />);

    // eslint-disable-next-line no-restricted-syntax
    for (const test of tests) {
      const {
        data,
        expected,
        isUpdatingDeferredDate,
        isUpdatingCurrentCompleteNowReason
      } = test;
      const componentProps = {
        ...props,
        deficientItem: data,
        isUpdatingDeferredDate,
        isUpdatingCurrentCompleteNowReason
      };
      rerender(<DeficientItemEditForm {...componentProps} />);
      const planToFixSection = screen.queryByTestId('item-plan-to-fix');

      expect(Boolean(planToFixSection)).toEqual(expected);
    }
  });

  it('it renders due date section for all expected deficient item states', () => {
    const props = {
      user: admin,
      property: fullProperty,
      deficientItem: createDeficientItem(),
      updates: {},
      isMobile: false,
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
      const expected = DUE_DATE_EDIT_STATES.includes(state);

      return {
        // previous plans to fix required for closed state
        data: createDeficientItem({ state }, { dueDates: 1 }),
        expected
      };
    });

    const { rerender } = render(<DeficientItemEditForm {...props} />);

    // eslint-disable-next-line no-restricted-syntax
    for (const test of tests) {
      const { data, expected } = test;
      const componentProps = { ...props, deficientItem: data };
      rerender(<DeficientItemEditForm {...componentProps} />);
      const planToFixSection = screen.queryByTestId('item-due-date');
      expect(Boolean(planToFixSection)).toEqual(expected);
    }
  });

  it('it hides current due date section when not relevant', () => {
    const props = {
      user: admin,
      property: fullProperty,
      deficientItem: createDeficientItem(),
      updates: {},
      isMobile: false,
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
        isUpdatingDeferredDate: true,
        isUpdatingCurrentCompleteNowReason: false,
        data: createDeficientItem({ state: 'requires-action' }),
        expected: false
      },
      {
        isUpdatingDeferredDate: false,
        isUpdatingCurrentCompleteNowReason: true,
        data: createDeficientItem({ state: 'requires-action' }),
        expected: false
      },
      {
        isUpdatingDeferredDate: false,
        isUpdatingCurrentCompleteNowReason: false,
        data: createDeficientItem({ state: 'closed' }),
        expected: false
      },
      {
        isUpdatingDeferredDate: false,
        isUpdatingCurrentCompleteNowReason: false,
        data: createDeficientItem({ state: 'requires-action' }),
        expected: true
      }
    ];

    const { rerender } = render(<DeficientItemEditForm {...props} />);

    // eslint-disable-next-line no-restricted-syntax
    for (const test of tests) {
      const {
        data,
        expected,
        isUpdatingDeferredDate,
        isUpdatingCurrentCompleteNowReason
      } = test;
      const componentProps = {
        ...props,
        deficientItem: data,
        isUpdatingDeferredDate,
        isUpdatingCurrentCompleteNowReason
      };
      rerender(<DeficientItemEditForm {...componentProps} />);
      const planToFixSection = screen.queryByTestId('item-plan-to-fix');

      expect(Boolean(planToFixSection)).toEqual(expected);
    }
  });

  it('it renders reason incomplete section for expected deficient item states', () => {
    const props = {
      user: admin,
      property: fullProperty,
      deficientItem: createDeficientItem(),
      updates: {},
      isMobile: false,
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
      const expected = REASON_INCOMPLETE_STATES.includes(state);
      const currentReasonIncomplete =
        state === 'closed' ? 'reason incomplete' : null;
      return {
        // previous plans to fix required for closed state
        data: createDeficientItem(
          { state, currentReasonIncomplete },
          { reasonsIncomplete: 1 }
        ),
        expected
      };
    });

    const { rerender } = render(<DeficientItemEditForm {...props} />);

    // eslint-disable-next-line no-restricted-syntax
    for (const test of tests) {
      const { data, expected } = test;
      const componentProps = { ...props, deficientItem: data };
      rerender(<DeficientItemEditForm {...componentProps} />);
      const planToFixSection = screen.queryByTestId('item-reason-incomplete');
      expect(Boolean(planToFixSection)).toEqual(expected);
    }
  });

  it('it renders progress notes section for expected deficient item states', () => {
    const props = {
      user: admin,
      property: fullProperty,
      deficientItem: createDeficientItem(),
      updates: {},
      isMobile: false,
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
      const expected = PROGRESS_NOTE_STATES.includes(state);

      return {
        data: createDeficientItem({ state }, { progressNotes: 1 }),
        expected
      };
    });

    const { rerender } = render(<DeficientItemEditForm {...props} />);

    // eslint-disable-next-line no-restricted-syntax
    for (const test of tests) {
      const { data, expected } = test;
      const componentProps = { ...props, deficientItem: data };
      rerender(<DeficientItemEditForm {...componentProps} />);
      const progressNoteSection = screen.queryByTestId('item-progress-note');
      expect(Boolean(progressNoteSection)).toEqual(expected);
    }
  });

  it('it renders progress notes update field for expected deficient item states', () => {
    const props = {
      user: admin,
      property: fullProperty,
      deficientItem: createDeficientItem(),
      updates: {},
      isMobile: false,
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
        data: createDeficientItem({ state }, { progressNotes: 1 }),
        expected
      };
    });

    const { rerender } = render(<DeficientItemEditForm {...props} />);

    // eslint-disable-next-line no-restricted-syntax
    for (const test of tests) {
      const { data, expected } = test;
      const componentProps = { ...props, deficientItem: data };
      rerender(<DeficientItemEditForm {...componentProps} />);
      const progressNoteTextarea = screen.queryByTestId(
        'item-progress-note-textarea'
      );
      expect(Boolean(progressNoteTextarea)).toEqual(expected);
    }
  });

  it('it does not render progress note section when editing deferred dates', () => {
    const props = {
      user: admin,
      property: fullProperty,
      deficientItem: createDeficientItem(
        { state: PROGRESS_NOTE_EDIT_STATES[0] },
        { progressNotes: 1 }
      ),
      updates: {},
      isMobile: false,
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
      isUpdatingCurrentCompleteNowReason: false
    };

    render(<DeficientItemEditForm {...props} />);
    const progressNoteSection = screen.queryByTestId('item-progress-note');
    expect(Boolean(progressNoteSection)).toBeFalsy();
  });

  it('it hides completed details section when not relevant', () => {
    const props = {
      user: admin,
      property: fullProperty,
      deficientItem: createDeficientItem(),
      isMobile: false,
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

    const createdAt = new Date();
    const tests = [
      {
        isUpdatingCurrentCompleteNowReason: false,
        data: createDeficientItem({ state: 'requires-action', createdAt }),
        expected: false
      },
      {
        isUpdatingCurrentCompleteNowReason: true,
        data: createDeficientItem({ state: 'requires-action', createdAt }),
        expected: true
      },
      {
        isUpdatingCurrentCompleteNowReason: false,
        data: createDeficientItem({ state: 'closed' }),
        expected: false
      },
      {
        isUpdatingCurrentCompleteNowReason: false,
        data: createDeficientItem(
          { state: 'closed' },
          { completeNowReasons: 1 }
        ),
        expected: true
      }
    ];

    const { rerender } = render(<DeficientItemEditForm {...props} />);

    // eslint-disable-next-line no-restricted-syntax
    for (const test of tests) {
      const { data, isUpdatingCurrentCompleteNowReason, expected } = test;
      const componentProps = {
        ...props,
        deficientItem: data,
        isUpdatingCurrentCompleteNowReason
      };
      rerender(<DeficientItemEditForm {...componentProps} />);
      const completeNowReasonSection = screen.queryByTestId(
        'item-complete-now-reason'
      );
      expect(Boolean(completeNowReasonSection)).toEqual(expected);
    }
  });
});
