import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import { render, screen, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import createDeficientItem from '../../../../__tests__/helpers/createDeficientItem';
import ReasonIncomplete from './index';
import settings from '../../settings';

const STATE = 'overdue';
const DEF_ITEM_STATES = settings.deficientItemStates;
const REASON_INCOMPLETE_EDIT_STATES = settings.reasonIncompleteEditStates;

describe('Unit | Common | Deficient Item Edit Form | fields | Reason Incomplete', () => {
  afterEach(() => sinon.restore());

  it('should hide reason incomplete section when hidden', () => {
    render(
      <ReasonIncomplete
        deficientItem={createDeficientItem({ state: STATE })}
        isMobile={false}
        onShowHistory={sinon.spy()}
        onChange={sinon.spy()}
        isVisible={false} // eslint-disable-line react/jsx-boolean-value
      />
    );

    const reasonIncompleteSection = screen.queryByTestId(
      'item-reason-incomplete'
    );
    expect(reasonIncompleteSection).toBeNull();
  });

  it('it only allows editing for reason incomplete for specific states', () => {
    const props = {
      deficientItem: createDeficientItem({ state: STATE }),
      isMobile: false,
      onShowHistory: sinon.spy(),
      onChange: sinon.spy(),
      isVisible: true
    };

    const tests = DEF_ITEM_STATES.map((state) => ({
      expected: REASON_INCOMPLETE_EDIT_STATES.includes(state),
      data: createDeficientItem({ state }),
      msg: `should${
        REASON_INCOMPLETE_EDIT_STATES.includes(state) ? '' : ' not'
      } be editable for state: ${state}`
    }));

    const { rerender } = render(<ReasonIncomplete {...props} />);

    // eslint-disable-next-line no-restricted-syntax
    for (const test of tests) {
      const { data, expected, msg } = test;
      const componentProps = {
        ...props,
        deficientItem: data
      };
      rerender(<ReasonIncomplete {...componentProps} />);
      const editableField = screen.queryByTestId(
        'item-reason-incomplete-textarea'
      );

      const actual = Boolean(editableField);
      expect(actual, msg).toEqual(expected);
    }
  });

  it('should not render show previous button when deficient item does not have reasons incomplete', () => {
    render(
      <ReasonIncomplete
        deficientItem={createDeficientItem({ state: STATE })}
        isMobile={false}
        onShowHistory={sinon.spy()}
        onChange={sinon.spy()}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
      />
    );

    const showPreviousBtn = screen.queryByTestId(
      'show-previous-reason-incomplete-btn'
    );
    expect(showPreviousBtn).toBeNull();
  });

  it('should allows updating a reason incomplete when deficient item has no current reason incomplete', () => {
    render(
      <ReasonIncomplete
        deficientItem={createDeficientItem({
          currentReasonIncomplete: '',
          state: STATE
        })}
        isMobile={false}
        onShowHistory={sinon.spy()}
        onChange={sinon.spy()}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
      />
    );

    const reasonIncompleteInput = screen.queryByTestId(
      'item-reason-incomplete-textarea'
    );

    const reasonIncompleteText = screen.queryByTestId(
      'item-reason-incomplete-text'
    );
    expect(reasonIncompleteInput).toBeTruthy();
    expect(reasonIncompleteText).toBeNull();
  });

  it('should render current reason incomplete', () => {
    const expected = 'Reason for incomplete';

    render(
      <ReasonIncomplete
        deficientItem={createDeficientItem({
          currentReasonIncomplete: expected,
          state: 'incomplete'
        })}
        isMobile={false}
        onShowHistory={sinon.spy()}
        onChange={sinon.spy()}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
      />
    );

    const reasonIncompleteText = screen.queryByTestId(
      'item-reason-incomplete-text'
    );
    expect(reasonIncompleteText).toBeTruthy();
    expect(reasonIncompleteText).toHaveTextContent(expected);
  });

  it('should render show previous button when deficient item has reasons incomplete', () => {
    const onShowHistory = sinon.spy();
    render(
      <ReasonIncomplete
        deficientItem={createDeficientItem(
          { state: STATE },
          { reasonsIncomplete: 1 }
        )}
        isMobile={false}
        onShowHistory={onShowHistory}
        onChange={sinon.spy()}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
      />
    );

    const showPreviousBtn = screen.queryByTestId(
      'show-previous-reason-incomplete-btn'
    );
    expect(showPreviousBtn).toBeTruthy();
  });

  it('should trigger request to show previous reasons incomplete', () => {
    const expected = true;
    const onShowHistory = sinon.spy();
    render(
      <ReasonIncomplete
        deficientItem={createDeficientItem(
          { state: STATE },
          { reasonsIncomplete: 1 }
        )}
        isMobile={false}
        onShowHistory={onShowHistory}
        onChange={sinon.spy()}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
      />
    );

    const showPreviousBtn = screen.queryByTestId(
      'show-previous-reason-incomplete-btn'
    );
    expect(showPreviousBtn).toBeTruthy();
    act(() => {
      userEvent.click(showPreviousBtn);
    });
    const actual = onShowHistory.called;
    expect(actual).toBe(expected);
  });

  it('should request to update reason incomplete', () => {
    const expected = true;
    const onChange = sinon.spy();

    render(
      <ReasonIncomplete
        deficientItem={createDeficientItem({
          currentReasonIncomplete: '',
          state: STATE
        })}
        isMobile={false}
        onShowHistory={sinon.spy()}
        onChange={onChange}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
      />
    );

    const reasonIncompleteInput = screen.queryByTestId(
      'item-reason-incomplete-textarea'
    );
    expect(reasonIncompleteInput).toBeTruthy();
    act(() => {
      fireEvent.change(reasonIncompleteInput, {
        target: { value: 'reason' }
      });
    });
    const actual = onChange.called;
    expect(actual).toBe(expected);
  });
});
