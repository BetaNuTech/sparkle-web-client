import sinon from 'sinon';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UpdateTeamModal from './index';

describe('Unit | Features | Property Edit | Update Team Modal', () => {
  afterEach(() => sinon.restore());

  it('invokes on close action when on close button clicked', () => {
    const expected = true;
    const onClose = sinon.spy();
    const props = {
      teams: [],
      onClose,
      selectedTeamId: '',
      isVisible: true,
      changeTeamSelection: () => true
    };
    render(<UpdateTeamModal {...props} />);

    const closeButton = screen.queryByTestId('close');
    userEvent.click(closeButton);
    const actual = onClose.called;
    expect(actual).toEqual(expected);
  });
});
