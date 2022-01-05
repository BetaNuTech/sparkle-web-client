import sinon from 'sinon';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignatureInputModal from './index';
import { unpublishedSignatureEntry } from '../../../__mocks__/inspections';

const DOWNLOAD_URL = 'https://dummyimage.com/600x400/000/fff';

describe('Unit | Features | Property Update Inspection | Signature Input Modal', () => {
  afterEach(() => sinon.restore());

  it('triggers close on close button button click', async () => {
    const expected = true;
    const onClose = sinon.spy();
    const props = {
      isVisible: true,
      onClose,
      inspectionItemsSignature: [],
      selectedInspectionItem: { title: 'six', mainInputNotes: '' }
    };
    render(<SignatureInputModal {...props} />);

    const closeButton = screen.queryByTestId('signature-input-modal-close');
    userEvent.click(closeButton);
    await new Promise((resolve) => setTimeout(resolve, 100));

    const actual = onClose.called;
    expect(actual).toEqual(expected);
  });

  it('does not close modal when container is clicked', async () => {
    const onClose = sinon.spy();
    const props = {
      isVisible: true,
      onClose,
      inspectionItemsSignature: [],
      selectedInspectionItem: { title: 'six', mainInputNotes: '' }
    };
    render(<SignatureInputModal {...props} />);

    const modalContainer = screen.queryByTestId('signature-input-modal');
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(modalContainer).toBeVisible();
  });

  it('should change button text to hide current on click on preview current ', () => {
    const onClose = sinon.spy();
    const props = {
      isVisible: true,
      onClose,
      inspectionItemsSignature: [],
      selectedInspectionItem: {
        title: 'six',
        mainInputNotes: '',
        signatureDownloadURL: DOWNLOAD_URL
      }
    };
    render(<SignatureInputModal {...props} />);

    const previewBtn = screen.queryByTestId(
      'signature-input-modal-preview-button'
    );
    userEvent.click(previewBtn);
    expect(previewBtn).toHaveTextContent('Hide Current');
  });

  it('should show signature preview when click on preview current', () => {
    const onClose = sinon.spy();
    const props = {
      isVisible: true,
      onClose,
      inspectionItemsSignature: [],
      selectedInspectionItem: {
        title: 'six',
        mainInputNotes: '',
        signatureDownloadURL: DOWNLOAD_URL
      }
    };
    render(<SignatureInputModal {...props} />);

    const previewBtn = screen.queryByTestId(
      'signature-input-modal-preview-button'
    );

    userEvent.click(previewBtn);
    const previewImg = screen.queryByTestId(
      'signature-input-modal-preview-image'
    );
    expect(previewBtn).toHaveTextContent('Hide Current');
    expect(previewImg).toHaveAttribute('src', DOWNLOAD_URL);
  });

  it('should hide signature preview when click on hide current', () => {
    const onClose = sinon.spy();
    const props = {
      isVisible: true,
      onClose,
      inspectionItemsSignature: [],
      selectedInspectionItem: {
        title: 'six',
        mainInputNotes: '',
        signatureDownloadURL: DOWNLOAD_URL
      }
    };
    render(<SignatureInputModal {...props} />);

    const previewBtn = screen.queryByTestId(
      'signature-input-modal-preview-button'
    );

    userEvent.click(previewBtn);
    expect(previewBtn).toHaveTextContent('Hide Current');
    userEvent.click(previewBtn);
    const previewImg = screen.queryByTestId(
      'signature-input-modal-preview-image'
    );
    expect(previewImg).toBeNull();
  });

  it('should show unpublished signature in preview when click on preview current', () => {
    const onClose = sinon.spy();
    const props = {
      isVisible: true,
      onClose,
      inspectionItemsSignature: [unpublishedSignatureEntry],
      selectedInspectionItem: {
        title: 'six',
        mainInputNotes: '',
        signatureDownloadURL: DOWNLOAD_URL
      }
    };
    render(<SignatureInputModal {...props} />);

    const previewBtn = screen.queryByTestId(
      'signature-input-modal-preview-button'
    );

    userEvent.click(previewBtn);
    const previewImg = screen.queryByTestId(
      'signature-input-modal-preview-image'
    );
    expect(previewBtn).toHaveTextContent('Hide Current');
    expect(previewImg).toHaveAttribute(
      'src',
      unpublishedSignatureEntry.signature
    );
  });
});
