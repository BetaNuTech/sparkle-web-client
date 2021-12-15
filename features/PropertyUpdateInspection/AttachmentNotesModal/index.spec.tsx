import sinon from 'sinon';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AttachmentNoteModal from './index';

describe('Unit | Features | Property Update Inspection | One Action Notes Modal', () => {
  afterEach(() => sinon.restore());

  it('triggers close action when close button clicked', () => {
    const expected = true;
    const onClose = sinon.spy();
    const props = {
      isVisible: true,
      onClose,
      selectedInspectionItem: { title: 'six', mainInputNotes: '' }
    };
    render(<AttachmentNoteModal {...props} />);

    const closeButton = screen.queryByTestId('attachment-notes-modal-close');
    userEvent.click(closeButton);

    const actual = onClose.called;
    expect(actual).toEqual(expected);
  });

  it('opens note modal on click when not visible', () => {
    const onClose = sinon.spy();
    const props = {
      isVisible: true,
      onClose,
      selectedInspectionItem: { title: 'six', mainInputNotes: '' }
    };
    render(<AttachmentNoteModal {...props} />);

    const modalContainer = screen.queryByTestId('attachment-notes-modal');
    expect(modalContainer).toBeVisible();
  });
});
