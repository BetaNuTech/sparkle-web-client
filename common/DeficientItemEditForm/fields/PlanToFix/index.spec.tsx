import { act } from 'react-dom/test-utils';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import PlanToFix from './index';

import createDeficientItem from '../../../../__tests__/helpers/createDeficientItem';

describe('Unit | Common | Deficient Item Edit Form | fields | Plan To Fix', () => {
  afterEach(() => sinon.restore());

  it('should not show previous plans to fix button when deficient item has past plans to fix', () => {
    render(
      <PlanToFix
        deficientItem={createDeficientItem({})}
        isMobile={false}
        onShowPlanToFix={sinon.spy()}
        onChangePlanToFix={sinon.spy()}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
      />
    );

    const showPreviousBtn = screen.queryByTestId(
      'show-previous-plan-to-fix-btn'
    );
    expect(showPreviousBtn).toBeNull();
  });

  it('should allows updating a plan to fix when deficient item has no current plan', () => {
    render(
      <PlanToFix
        deficientItem={createDeficientItem({ currentPlanToFix: '' })}
        isMobile={false}
        onShowPlanToFix={sinon.spy()}
        onChangePlanToFix={sinon.spy()}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
      />
    );

    const textareaEl = screen.queryByTestId('item-plan-to-fix-textarea');

    const planToFixText = screen.queryByTestId('item-plan-to-fix-text');
    expect(textareaEl).toBeTruthy();
    expect(planToFixText).toBeNull();
  });

  it('should render currnet plan to fix', () => {
    const expected = 'Current Plan To Fix';

    render(
      <PlanToFix
        deficientItem={createDeficientItem({ currentPlanToFix: expected })}
        isMobile={false}
        onShowPlanToFix={sinon.spy()}
        onChangePlanToFix={sinon.spy()}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
      />
    );

    const planToFixText = screen.queryByTestId('item-plan-to-fix-text');
    expect(planToFixText).toBeTruthy();
    expect(planToFixText).toHaveTextContent(expected);
  });

  it('should render show previous plans to fix button when deficient item has past plans to fix', async () => {
    const onShowPlanToFix = sinon.spy();
    render(
      <PlanToFix
        deficientItem={createDeficientItem({}, { plansToFix: 1 })}
        isMobile={false}
        onShowPlanToFix={onShowPlanToFix}
        onChangePlanToFix={sinon.spy()}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
      />
    );

    const showPreviousBtn = screen.queryByTestId(
      'show-previous-plan-to-fix-btn'
    );
    expect(showPreviousBtn).toBeTruthy();
  });

  it('should trigger request to show previous plans to fix when deficient item has previous plans', async () => {
    const expected = true;
    const onShowPlanToFix = sinon.spy();
    render(
      <PlanToFix
        deficientItem={createDeficientItem({}, { plansToFix: 1 })}
        isMobile={false}
        onShowPlanToFix={onShowPlanToFix}
        onChangePlanToFix={sinon.spy()}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
      />
    );

    const showPreviousBtn = screen.queryByTestId(
      'show-previous-plan-to-fix-btn'
    );
    expect(showPreviousBtn).toBeTruthy();
    act(() => {
      userEvent.click(showPreviousBtn);
    });
    const actual = onShowPlanToFix.called;
    expect(actual).toBe(expected);
  });

  // eslint-disable-next-line max-len
  it('should trigger update to plans to fix on user changes in textarea when item has no current plans to fix', async () => {
    const expected = true;
    const onChangePlanToFix = sinon.spy();

    render(
      <PlanToFix
        deficientItem={createDeficientItem({ currentPlanToFix: '' })}
        isMobile={false}
        onShowPlanToFix={sinon.spy()}
        onChangePlanToFix={onChangePlanToFix}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
      />
    );

    const textareaEl = screen.queryByTestId('item-plan-to-fix-textarea');
    expect(textareaEl).toBeTruthy();
    act(() => {
      fireEvent.change(textareaEl, { target: { value: expected } });
    });
    const actual = onChangePlanToFix.called;
    expect(actual).toBe(expected);
  });
});
