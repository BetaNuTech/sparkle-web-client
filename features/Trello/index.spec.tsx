import sinon from 'sinon';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TrelloModal from './TrelloModal';

describe('Unit | Features | Trello | Trello Modal', () => {
  afterEach(() => sinon.restore());

  it('invokes on close action when on close button clicked', () => {
    const expected = true;
    const onClose = sinon.spy();
    const props = {
      isVisible: true,
      onClose,
      isOnline: true,
      isStaging: true,
      property: {},
      selectedOptions: {
        openBoard: '1',
        openList: '2',
        closedBoard: '3',
        closedList: '4'
      },
      trelloUser: {
        trelloFullName: 'trelloFullName',
        trelloUsername: 'trelloUsername'
      }
    };
    render(<TrelloModal {...props} />);

    const closeButton = screen.queryByTestId('close');
    userEvent.click(closeButton);
    const actual = onClose.called;
    expect(actual).toEqual(expected);
  });
});
