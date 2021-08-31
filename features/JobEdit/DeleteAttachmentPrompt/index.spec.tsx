import sinon from 'sinon';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Prompt from './index';

describe('Unit | Features | Job Edit | Delete Attachment Prompt', () => {
  afterEach(() => sinon.restore());

  it('invokes on confirm action with attachment on confirm clicked', () => {
    const expected = true;
    const onConfirm = sinon.spy();
    const props = {
      isVisible: true,
      onConfirm
    };
    render(<Prompt {...props} />);

    const confirmButton = screen.queryByTestId('btn-confirm-delete-attachment');
    userEvent.click(confirmButton);
    const actual = onConfirm.called;
    expect(actual).toEqual(expected);
  });

  it('invokes on close action when on confirm button clicked', () => {
    const expected = true;
    const onClose = sinon.spy();
    const props = {
      isVisible: true,
      onConfirm: () => true,
      onClose
    };
    render(<Prompt {...props} />);

    const confirmButton = screen.queryByTestId('btn-confirm-delete-attachment');
    userEvent.click(confirmButton);
    const actual = onClose.called;
    expect(actual).toEqual(expected);
  });

  it('invokes on close action when on close button clicked', () => {
    const expected = true;
    const onClose = sinon.spy();
    const props = {
      isVisible: true,
      onConfirm: () => true,
      onClose
    };
    render(<Prompt {...props} />);

    const confirmButton = screen.queryByTestId('close');
    userEvent.click(confirmButton);
    const actual = onClose.called;
    expect(actual).toEqual(expected);
  });
});
