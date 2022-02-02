import sinon from 'sinon';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PhotoPreview from './index';
import { photoDataEntry } from '../../../__mocks__/inspections';

describe('Common | Photos Modal | Photo Preview', () => {
  afterEach(() => sinon.restore());

  it('should not show preview if no photo selected for preview', () => {
    const onClose = sinon.spy();
    const props = {
      onClose,
      photoData: null
    };
    render(<PhotoPreview {...props} />);

    const previewContainer = screen.queryByTestId('photos-modal-preview');
    expect(previewContainer).toBeFalsy();
  });

  it('should show preview if photo selected for preview', () => {
    const onClose = sinon.spy();
    const props = {
      onClose,
      photoData: photoDataEntry
    };
    render(<PhotoPreview {...props} />);

    const previewContainer = screen.queryByTestId('photos-modal-preview');
    expect(previewContainer).toBeTruthy();
  });

  it('should show image and caption if photo selected for preview', () => {
    const onClose = sinon.spy();
    const props = {
      onClose,
      photoData: photoDataEntry
    };
    render(<PhotoPreview {...props} />);

    const previewImage = screen.queryByTestId('photos-modal-preview-image');
    const previewCaption = screen.queryByTestId('photos-modal-preview-caption');

    // check preview image is rendered with correct downloadURL
    expect(previewImage).toBeTruthy();
    expect(previewImage).toHaveAttribute('src', photoDataEntry.downloadURL);

    // check preview image caption is rendered with correct value
    expect(previewCaption).toBeTruthy();
    expect(previewCaption).toHaveTextContent(photoDataEntry.caption);
  });

  it('should triggers close action when close button clicked', () => {
    const expected = true;
    const onClose = sinon.spy();
    const props = {
      onClose,
      photoData: photoDataEntry
    };
    render(<PhotoPreview {...props} />);

    const closeButton = screen.queryByTestId('photos-modal-preview-close');
    userEvent.click(closeButton);

    const actual = onClose.called;
    expect(actual).toEqual(expected);
  });
});
