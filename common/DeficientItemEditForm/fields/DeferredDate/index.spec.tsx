import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import { render, screen, fireEvent } from '@testing-library/react';
import moment from 'moment';
import sinon from 'sinon';
import createDeficientItem from '../../../../__tests__/helpers/createDeficientItem';
import dateUtil from '../../../utils/date';
import DeferredDate from './index';

// set default date to tomorrow
const defaultDate = moment().add(1, 'days').format('YYYY-MM-DD');

const validDate = moment().add(2, 'days').format('YYYY-MM-DD');
const validDate2 = moment().add(10, 'days').format('YYYY-MM-DD');
const validDate3 = moment().add(14, 'days').format('YYYY-MM-DD');

const invalidPastDate = moment().add(-2, 'days').format('YYYY-MM-DD');

const invalidPastDate2 = moment().add(-15, 'days').format('YYYY-MM-DD');

describe('Unit | Common | Deficient Item Edit Form | fields | Deferred Date', () => {
  afterEach(() => sinon.restore());

  it('should hides deferred date section when not relevant', () => {
    render(
      <DeferredDate
        deficientItem={createDeficientItem({ state: 'requires-action' })}
        isMobile={false}
        onShowHistory={sinon.spy()}
        onChange={sinon.spy()}
        isVisible={false} // eslint-disable-line react/jsx-boolean-value
        defaultDate={defaultDate}
      />
    );

    const deferredDateContainer = screen.queryByTestId('item-deferred-date');
    expect(deferredDateContainer).toBeNull();
  });

  it('should not render show previous button when deficient item does not have previous history', () => {
    render(
      <DeferredDate
        deficientItem={createDeficientItem({ state: 'requires-action' })}
        isMobile={false}
        onShowHistory={sinon.spy()}
        onChange={sinon.spy()}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
        defaultDate={defaultDate}
      />
    );

    const showPreviousBtn = screen.queryByTestId(
      'show-previous-deferred-date-btn'
    );
    expect(showPreviousBtn).toBeNull();
  });

  it('should allows updating a deferred date when deficient item has no current deferred date', () => {
    render(
      <DeferredDate
        deficientItem={createDeficientItem({
          state: 'requires-action',
          currentDeferredDate: 0
        })}
        isMobile={false}
        onShowHistory={sinon.spy()}
        onChange={sinon.spy()}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
        defaultDate={defaultDate}
      />
    );

    const dateEl = screen.queryByTestId('item-deferred-date-input');

    const deferredDateText = screen.queryByTestId('item-deferred-date-text');
    expect(dateEl).toBeTruthy();
    expect(deferredDateText).toBeNull();
  });

  it('should render current deferred date', () => {
    const currentDeferredDate = moment();
    const currentDeferredDateUnix = currentDeferredDate.unix();
    const expected = `${dateUtil.toUserFullDateDisplay(
      currentDeferredDateUnix
    )} at ${dateUtil.toUserTimeDisplay(currentDeferredDateUnix)}`;

    render(
      <DeferredDate
        deficientItem={createDeficientItem({
          state: 'requires-action',
          currentDeferredDate: currentDeferredDateUnix
        })}
        isMobile={false}
        onShowHistory={sinon.spy()}
        onChange={sinon.spy()}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
        defaultDate={defaultDate}
      />
    );

    const deferredDateText = screen.queryByTestId('item-deferred-date-text');
    expect(deferredDateText).toBeTruthy();
    expect(deferredDateText).toHaveTextContent(expected);
  });

  it('should render show previous button when deficient item has history', () => {
    const onShowHistory = sinon.spy();
    render(
      <DeferredDate
        deficientItem={createDeficientItem(
          { state: 'requires-action' },
          { deferredDates: 1 }
        )}
        isMobile={false}
        onShowHistory={onShowHistory}
        onChange={sinon.spy()}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
        defaultDate={defaultDate}
      />
    );

    const showPreviousBtn = screen.queryByTestId(
      'show-previous-deferred-date-btn'
    );
    expect(showPreviousBtn).toBeTruthy();
  });

  it('should trigger request to show previous deferred dates', () => {
    const expected = true;
    const onShowHistory = sinon.spy();
    render(
      <DeferredDate
        deficientItem={createDeficientItem(
          { state: 'requires-action' },
          { deferredDates: 1 }
        )}
        isMobile={false}
        onShowHistory={onShowHistory}
        onChange={sinon.spy()}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
        defaultDate={defaultDate}
      />
    );

    const showPreviousBtn = screen.queryByTestId(
      'show-previous-deferred-date-btn'
    );
    expect(showPreviousBtn).toBeTruthy();
    act(() => {
      userEvent.click(showPreviousBtn);
    });
    const actual = onShowHistory.called;
    expect(actual).toBe(expected);
  });

  it('should request to update deferred date', () => {
    const expected = true;
    const onChange = sinon.spy();

    render(
      <DeferredDate
        deficientItem={createDeficientItem({
          state: 'requires-action',
          currentDeferredDate: 0
        })}
        isMobile={false}
        onShowHistory={sinon.spy()}
        onChange={onChange}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
        defaultDate={defaultDate}
      />
    );

    const dateEl = screen.queryByTestId('item-deferred-date-input');
    expect(dateEl).toBeTruthy();
    act(() => {
      fireEvent.change(dateEl, { target: { value: '2022-01-23' } });
    });
    const actual = onChange.called;
    expect(actual).toBe(expected);
  });

  it('it only allows selecting any deferred date starting from tomorrow', async () => {
    const onChange = sinon.spy();

    render(
      <DeferredDate
        deficientItem={createDeficientItem({
          state: 'requires-action',
          currentDeferredDate: 0
        })}
        isMobile={false}
        onShowHistory={sinon.spy()}
        onChange={onChange}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
        defaultDate={defaultDate}
      />
    );

    const dateEl = screen.queryByTestId(
      'item-deferred-date-input'
    ) as HTMLInputElement;
    expect(dateEl).toBeTruthy();

    const datesArray = [
      {
        date: validDate,
        expected: true,
        message: 'selecting 2 days from now is valid'
      },
      {
        date: invalidPastDate,
        expected: false,
        message: 'selecting 2 days back date from now is invalid'
      },
      {
        date: invalidPastDate2,
        expected: false,
        message: 'selecting 15 days back date from now is invalid'
      },
      {
        date: validDate2,
        expected: true,
        message: 'selecting 10 days from now is valid'
      },
      {
        date: validDate3,
        expected: true,
        message: 'selecting 14 days from now is valid'
      }
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
