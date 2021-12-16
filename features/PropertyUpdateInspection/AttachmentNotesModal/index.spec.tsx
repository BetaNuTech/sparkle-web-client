import sinon from 'sinon';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AttachmentNoteModal from './index';
import { photoDataEntry } from '../../../__mocks__/inspections';

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

  it('should render sidebar if inspection has photo data', () => {
    const onClose = sinon.spy();
    const props = {
      isVisible: true,
      onClose,
      selectedInspectionItem: {
        title: 'six',
        mainInputNotes: '',
        photos: true,
        photosData: { '123': photoDataEntry }
      }
    };
    render(<AttachmentNoteModal {...props} />);

    const sidebar = screen.queryByTestId('attachmentNotesModal-sidebar');
    expect(sidebar).toBeVisible();
  });

  it('should not render sidebar if inspection does not have photo data', () => {
    const onClose = sinon.spy();
    const props = {
      isVisible: true,
      onClose,
      selectedInspectionItem: {
        title: 'six',
        mainInputNotes: '',
        photos: true
      }
    };
    render(<AttachmentNoteModal {...props} />);

    const sidebar = screen.queryByTestId('attachmentNotesModal-sidebar');
    expect(sidebar).toBeNull();
  });

  it('should render correct inspector notes value in textarea', () => {
    const onClose = sinon.spy();
    const expected = 'this is inspector notes';
    const props = {
      isVisible: true,
      onClose,
      selectedInspectionItem: {
        title: 'six',
        inspectorNotes: expected,
        photos: false
      }
    };
    render(<AttachmentNoteModal {...props} />);

    const textarea = screen.queryByTestId('attachmentNotesModal-textarea');
    expect(textarea).toHaveValue(expected);
  });
});
