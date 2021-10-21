import sinon from 'sinon';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TrelloModal from './index';

describe('Unit | Features | Trello | Trello Modal', () => {
  afterEach(() => sinon.restore());

  it('invokes on close action when on close button clicked', () => {
    const expected = true;
    const onClose = sinon.spy();
    const props = {
      isVisible: true,
      onClose,
      onSave: () => Promise.resolve(true),
      onReset: () => Promise.resolve(true),
      isLoading: false,
      isSaving: false,
      isOnline: true,
      property: { name: 'test' },
      selectedOptions: {
        openBoard: '1',
        openList: '2',
        closedBoard: '3',
        closedList: '4'
      },
      trelloUser: {
        trelloFullName: 'trelloFullName',
        trelloUsername: 'trelloUsername'
      },
      isOpenListsLoading: false,
      isClosedListsLoading: false
    };
    render(<TrelloModal {...props} />);

    const closeButton = screen.queryByTestId('close');
    userEvent.click(closeButton);
    const actual = onClose.called;
    expect(actual).toEqual(expected);
  });
});
