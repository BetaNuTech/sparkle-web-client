import { render, screen } from '@testing-library/react';
import moment from 'moment';
import createDeficientItem from '../../../../__tests__/helpers/createDeficientItem';
import dateUtils from '../../../utils/date';
import DueDatePill from './index';

describe('Unit | Common | Deficient Item Edit Form | fields | Due Date Pill', () => {
  it('it hides due date pill when item does not have current due date', () => {
    render(
      <DueDatePill
        deficientItem={createDeficientItem({
          state: 'pending'
        })}
        isVisible={false} // eslint-disable-line react/jsx-boolean-value
      />
    );

    const dueDatePillSection = screen.queryByTestId('due-date-pill');
    expect(dueDatePillSection).toBeFalsy();
  });

  it('it should render current due date in MM/DD/YYYY format', () => {
    const currentDueDate = moment().unix();
    const expected = dateUtils.toUserDateDisplayWithFullYear(currentDueDate);
    render(
      <DueDatePill
        deficientItem={createDeficientItem({
          state: 'pending',
          currentDueDate
        })}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
      />
    );

    const dueDateEl = screen.queryByTestId('due-date-pill-date');
    expect(dueDateEl).toHaveTextContent(expected);
  });
});
