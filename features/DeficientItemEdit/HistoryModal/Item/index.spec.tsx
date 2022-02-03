import { render, screen } from '@testing-library/react';
import createDeficientItem from '../../../../__tests__/helpers/createDeficientItem';

import { teamMember } from '../../../../__mocks__/users';
import { getUserFullname } from '../../../../common/utils/user';
import dateUtils from '../../../../common/utils/date';
import Item from './index';

describe('Unit | features | Deficient Item Edit | History Modal | Item', () => {
  it('should render user name as SYSTEM if there is no user in history', () => {
    const expected = 'SYSTEM';
    const props = {
      historyType: 'stateHistory',
      history: {},
      user: {},
      isLoading: false
    };
    render(<Item {...props} />);

    const userEl = screen.queryByTestId('history-user');
    expect(userEl).toHaveTextContent(expected);
  });

  it('should render user name of history user', () => {
    const expected = `${getUserFullname(teamMember)} (${teamMember.email})`;

    const deficientItem = createDeficientItem(
      { state: 'pending' },
      { stateHistory: 1 }
    );
    const stateHistoryKeys = Object.keys(deficientItem.stateHistory)[0];
    const history = deficientItem.stateHistory[stateHistoryKeys[0]];
    const props = {
      historyType: 'stateHistory',
      history: { ...history, user: teamMember.id },
      user: teamMember,
      isLoading: false
    };
    render(<Item {...props} />);

    const userEl = screen.queryByTestId('history-user');
    expect(userEl).toHaveTextContent(expected);
  });

  it('should render created at full date and time of history', () => {
    const deficientItem = createDeficientItem(
      { state: 'pending' },
      { stateHistory: 1 }
    );
    const stateHistoryKeys = Object.keys(deficientItem.stateHistory)[0];
    const history = deficientItem.stateHistory[stateHistoryKeys[0]];
    const expected = `${dateUtils.toUserFullDateDisplay(
      history.createdAt
    )} at ${dateUtils.toUserTimeDisplay(history.createdAt)}`;

    const props = {
      historyType: 'stateHistory',
      history: { ...history, user: teamMember.id },
      user: teamMember,
      isLoading: false
    };
    render(<Item {...props} />);

    const dateTimeEl = screen.queryByTestId('history-created-date-time');
    expect(dateTimeEl).toHaveTextContent(expected);
  });
});
