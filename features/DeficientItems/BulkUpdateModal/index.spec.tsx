import sinon from 'sinon';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BulkUpdateModal from './index';

describe('Unit | Features | Deficient Item List | Bulk Update Modal', () => {
  afterEach(() => sinon.restore());

  it('triggers close on close button click', () => {
    const expected = true;
    const onClose = sinon.spy();
    const props = {
      isVisible: true,
      onClose,
      movingItemsLength: 2,
      nextState: 'go-back'
    };
    render(<BulkUpdateModal {...props} />);

    const closeButton = screen.queryByTestId('bulk-update-modal-close');
    userEvent.click(closeButton);

    const actual = onClose.called;
    expect(actual).toEqual(expected);
  });

  it('triggers close on abort button click', () => {
    const expected = true;
    const onClose = sinon.spy();
    const props = {
      isVisible: true,
      onClose,
      movingItemsLength: 2,
      nextState: 'go-back'
    };
    render(<BulkUpdateModal {...props} />);

    const abortButton = screen.queryByTestId('bulk-update-modal-abort');
    userEvent.click(abortButton);

    const actual = onClose.called;
    expect(actual).toEqual(expected);
  });

  it('should render title with next state remove "-" character and titleize', () => {
    const expected = 'Move To Go Back';
    const onClose = sinon.spy();
    const props = {
      isVisible: true,
      onClose,
      movingItemsLength: 2,
      nextState: 'go-back'
    };
    render(<BulkUpdateModal {...props} />);

    const headingEl = screen.queryByTestId('bulk-update-modal-heading');
    expect(headingEl).toHaveTextContent(expected);
  });
});
