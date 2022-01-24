import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import { render, screen, fireEvent } from '@testing-library/react';
import moment from 'moment';
import sinon from 'sinon';
import createDeficientItem from '../../../../__tests__/helpers/createDeficientItem';
import dateUtil from '../../../utils/date';
import DueDate from './index';

// set default date to tomorrow
const defaultDate = moment().add(1, 'days').format('YYYY-MM-DD');

// set maximum selectable date to 2 weeks from current date
const maxDate = moment().add(14, 'days').format('YYYY-MM-DD');

const validDate = moment().add(2, 'days').format('YYYY-MM-DD');
const validDate2 = moment().add(10, 'days').format('YYYY-MM-DD');
const validDate3 = moment().add(14, 'days').format('YYYY-MM-DD');

const invalidPastDate = moment().add(-2, 'days').format('YYYY-MM-DD');

const invalidFutureDate = moment().add(15, 'days').format('YYYY-MM-DD');

describe('Unit | Common | Deficient Item Edit Form | fields | Due Date', () => {
  afterEach(() => sinon.restore());

  it('should hides due date section when not relevant', () => {
    render(
      <DueDate
        deficientItem={createDeficientItem({})}
        isMobile={false}
        onShowDueDates={sinon.spy()}
        onChangeDueDate={sinon.spy()}
        isVisible={false} // eslint-disable-line react/jsx-boolean-value
        defaultDate={defaultDate}
        maxDate={maxDate}
      />
    );

    const dueDateContainer = screen.queryByTestId('item-due-date');
    expect(dueDateContainer).toBeNull();
  });

  it('should not render show previous button when deficient item does not have previous history', () => {
    render(
      <DueDate
        deficientItem={createDeficientItem({})}
        isMobile={false}
        onShowDueDates={sinon.spy()}
        onChangeDueDate={sinon.spy()}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
        defaultDate={defaultDate}
        maxDate={maxDate}
      />
    );

    const showPreviousBtn = screen.queryByTestId('show-previous-due-date-btn');
    expect(showPreviousBtn).toBeNull();
  });

  it('should allows updating a due date when deficient item has no current due date', () => {
    render(
      <DueDate
        deficientItem={createDeficientItem({ currentDueDate: 0 })}
        isMobile={false}
        onShowDueDates={sinon.spy()}
        onChangeDueDate={sinon.spy()}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
        defaultDate={defaultDate}
        maxDate={maxDate}
      />
    );

    const dateEl = screen.queryByTestId('item-due-date-input');

    const dueDateText = screen.queryByTestId('item-due-date-text');
    expect(dateEl).toBeTruthy();
    expect(dueDateText).toBeNull();
  });

  it('should render current due date', () => {
    const currentDueDate = moment();
    const currentDueDateUnix = currentDueDate.unix();
    const expected = `${dateUtil.toUserFullDateDisplay(
      currentDueDateUnix
    )} at ${dateUtil.toUserTimeDisplay(currentDueDateUnix)}`;

    render(
      <DueDate
        deficientItem={createDeficientItem({
          currentDueDate: currentDueDateUnix
        })}
        isMobile={false}
        onShowDueDates={sinon.spy()}
        onChangeDueDate={sinon.spy()}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
        defaultDate={defaultDate}
        maxDate={maxDate}
      />
    );

    const dueDateText = screen.queryByTestId('item-due-date-text');
    expect(dueDateText).toBeTruthy();
    expect(dueDateText).toHaveTextContent(expected);
  });

  it('should render show previous button when deficient item has history', () => {
    const onShowDueDates = sinon.spy();
    render(
      <DueDate
        deficientItem={createDeficientItem({}, { dueDates: 1 })}
        isMobile={false}
        onShowDueDates={onShowDueDates}
        onChangeDueDate={sinon.spy()}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
        defaultDate={defaultDate}
        maxDate={maxDate}
      />
    );

    const showPreviousBtn = screen.queryByTestId('show-previous-due-date-btn');
    expect(showPreviousBtn).toBeTruthy();
  });

  it('should trigger request to show previous due dates', () => {
    const expected = true;
    const onShowDueDates = sinon.spy();
    render(
      <DueDate
        deficientItem={createDeficientItem({}, { dueDates: 1 })}
        isMobile={false}
        onShowDueDates={onShowDueDates}
        onChangeDueDate={sinon.spy()}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
        defaultDate={defaultDate}
        maxDate={maxDate}
      />
    );

    const showPreviousBtn = screen.queryByTestId('show-previous-due-date-btn');
    expect(showPreviousBtn).toBeTruthy();
    act(() => {
      userEvent.click(showPreviousBtn);
    });
    const actual = onShowDueDates.called;
    expect(actual).toBe(expected);
  });

  it('should request to update due date', () => {
    const expected = true;
    const onChangeDueDate = sinon.spy();

    render(
      <DueDate
        deficientItem={createDeficientItem({ currentDueDate: 0 })}
        isMobile={false}
        onShowDueDates={sinon.spy()}
        onChangeDueDate={onChangeDueDate}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
        defaultDate={defaultDate}
        maxDate={maxDate}
      />
    );

    const dateEl = screen.queryByTestId('item-due-date-input');
    expect(dateEl).toBeTruthy();
    act(() => {
      fireEvent.change(dateEl, { target: { value: '2022-01-23' } });
    });
    const actual = onChangeDueDate.called;
    expect(actual).toBe(expected);
  });

  it('should only allows selecting a current due date between tomorrow and 2 weeks from today', async () => {
    const onChangeDueDate = sinon.spy();

    render(
      <DueDate
        deficientItem={createDeficientItem({ currentDueDate: 0 })}
        isMobile={false}
        onShowDueDates={sinon.spy()}
        onChangeDueDate={onChangeDueDate}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
        defaultDate={defaultDate}
        maxDate={maxDate}
      />
    );

    const dateEl = screen.queryByTestId(
      'item-due-date-input'
    ) as HTMLInputElement;
    expect(dateEl).toBeTruthy();

    const datesArray = [
      { date: validDate, expected: true },
      { date: invalidPastDate, expected: false },
      { date: invalidFutureDate, expected: false },
      { date: validDate2, expected: true },
      { date: validDate3, expected: true }
    ];

    // eslint-disable-next-line no-restricted-syntax
    for (const date of datesArray) {
      act(() => {
        fireEvent.change(dateEl, { target: { value: date.date } });
      });

      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 50));
      expect(dateEl.validity.valid).toBe(date.expected);
    }
  });
});
