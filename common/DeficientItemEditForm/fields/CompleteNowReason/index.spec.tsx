import { act } from 'react-dom/test-utils';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import CompleteNowReason from './index';

import createDeficientItem from '../../../../__tests__/helpers/createDeficientItem';

describe('Unit | Common | Deficient Item Edit Form | fields | Complete Now Reason', () => {
  afterEach(() => sinon.restore());

  // eslint-disable-next-line max-len
  it('should not render show complete now reasons button when deficient item does not have complete now reasons', () => {
    render(
      <CompleteNowReason
        deficientItem={createDeficientItem({ state: 'requires-action' })}
        isMobile={false}
        onShowHistory={sinon.spy()}
        onChange={sinon.spy()}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
        isEditable={true} // eslint-disable-line react/jsx-boolean-value
      />
    );

    const showCompleteNowReasonBtn = screen.queryByTestId(
      'show-previous-complete-now-reason-btn'
    );
    expect(showCompleteNowReasonBtn).toBeNull();
  });

  it('should allow updating a complete now reason when deficient item has no current complete now reason', () => {
    render(
      <CompleteNowReason
        deficientItem={createDeficientItem({
          state: 'requires-action',
          currentCompleteNowReason: ''
        })}
        isMobile={false}
        onShowHistory={sinon.spy()}
        onChange={sinon.spy()}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
        isEditable={true} // eslint-disable-line react/jsx-boolean-value
      />
    );

    const textareaEl = screen.queryByTestId(
      'item-complete-now-reason-textarea'
    );
    expect(textareaEl).toBeTruthy();
  });

  it('should render show complete now reasons button when deficient item has past complete now reasons', () => {
    const onShowHistory = sinon.spy();
    render(
      <CompleteNowReason
        deficientItem={createDeficientItem(
          { state: 'requires-action' },
          { completeNowReasons: 1 }
        )}
        isMobile={false}
        onShowHistory={onShowHistory}
        onChange={sinon.spy()}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
        isEditable={true} // eslint-disable-line react/jsx-boolean-value
      />
    );

    const showCompleteNowReasonBtn = screen.queryByTestId(
      'show-previous-complete-now-reason-btn'
    );
    expect(showCompleteNowReasonBtn).toBeTruthy();
  });

  // eslint-disable-next-line max-len
  it('should trigger request to show previous complete now reason when deficient item has past complete now reasons', () => {
    const expected = true;
    const onShowHistory = sinon.spy();
    render(
      <CompleteNowReason
        deficientItem={createDeficientItem(
          { state: 'closed' },
          { completeNowReasons: 1 }
        )}
        isMobile={false}
        onShowHistory={onShowHistory}
        onChange={sinon.spy()}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
        isEditable={true} // eslint-disable-line react/jsx-boolean-value
      />
    );

    const showCompleteNowReasonBtn = screen.queryByTestId(
      'show-previous-complete-now-reason-btn'
    );
    expect(showCompleteNowReasonBtn).toBeTruthy();
    act(() => {
      userEvent.click(showCompleteNowReasonBtn);
    });
    const actual = onShowHistory.called;
    expect(actual).toBe(expected);
  });

  // eslint-disable-next-line max-len
  it('should trigger update to complete now reason on user changes in textarea when item has no current complete now reason', () => {
    const expected = true;
    const onChange = sinon.spy();

    render(
      <CompleteNowReason
        deficientItem={createDeficientItem({
          state: 'requires-action',
          currentCompleteNowReason: ''
        })}
        isMobile={false}
        onShowHistory={sinon.spy()}
        onChange={onChange}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
        isEditable={true} // eslint-disable-line react/jsx-boolean-value
      />
    );

    const textareaEl = screen.queryByTestId(
      'item-complete-now-reason-textarea'
    );
    expect(textareaEl).toBeTruthy();
    act(() => {
      fireEvent.change(textareaEl, { target: { value: expected } });
    });
    const actual = onChange.called;
    expect(actual).toBe(expected);
  });

  it('should render currnet complete now reason', () => {
    const expected = 'Current Plan To Fix';

    render(
      <CompleteNowReason
        deficientItem={createDeficientItem({
          state: 'requires-action',
          currentCompleteNowReason: expected
        })}
        isMobile={false}
        onShowHistory={sinon.spy()}
        onChange={sinon.spy()}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
        isEditable={false}
      />
    );

    const currentCompletedNowReasonText = screen.queryByTestId(
      'item-current-completed-now-reason-text'
    );
    expect(currentCompletedNowReasonText).toBeTruthy();
    expect(currentCompletedNowReasonText).toHaveTextContent(expected);
  });
});
