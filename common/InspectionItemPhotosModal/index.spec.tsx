import sinon from 'sinon';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PhotosModal from './index';
import {
  photoDataEntry,
  unpublishedPhotoDataEntry
} from '../../__mocks__/inspections';
import * as dropzoneUtils from '../../__tests__/helpers/dropzone';

describe('Common | Inspection Item Photos Modal', () => {
  afterEach(() => sinon.restore());

  it('triggers close action when close button clicked', () => {
    const expected = true;
    const onClose = sinon.spy();
    const props = {
      isVisible: true,
      onClose,
      title: 'One',
      onChangeFiles: sinon.spy(),
      photosData: [],
      unpublishedPhotosData: []
    };
    render(<PhotosModal {...props} />);

    const closeButton = screen.queryByTestId('photos-modal-close');
    userEvent.click(closeButton);

    const actual = onClose.called;
    expect(actual).toEqual(expected);
  });

  it('opens on click when not visible', () => {
    const onClose = sinon.spy();
    const props = {
      isVisible: true,
      onClose,
      title: 'One',
      onChangeFiles: sinon.spy(),
      photosData: [],
      unpublishedPhotosData: []
    };
    render(<PhotosModal {...props} />);

    const modalContainer = screen.queryByTestId('photos-modal-close');
    expect(modalContainer).toBeVisible();
  });

  it('should render photos list if it has photos data', () => {
    const onClose = sinon.spy();
    const props = {
      isVisible: true,
      onClose,
      title: 'One',
      onChangeFiles: sinon.spy(),
      photosData: [photoDataEntry],
      unpublishedPhotosData: []
    };
    render(<PhotosModal {...props} />);

    const photosContainer = screen.queryByTestId('photos-modal-photos');
    expect(photosContainer).toBeVisible();
  });

  it('should not render photos list if it does not have photos data', () => {
    const onClose = sinon.spy();
    const props = {
      isVisible: true,
      onClose,
      title: 'One',
      onChangeFiles: sinon.spy(),
      photosData: [],
      unpublishedPhotosData: []
    };
    render(<PhotosModal {...props} />);

    const photosContainer = screen.queryByTestId('photos-modal-photos');

    expect(photosContainer).toBeNull();
  });

  it('should render remove button for unpublished photos', () => {
    const onClose = sinon.spy();
    const props = {
      isVisible: true,
      onClose,
      title: 'One',
      onChangeFiles: sinon.spy(),
      photosData: [],
      unpublishedPhotosData: [unpublishedPhotoDataEntry]
    };
    render(<PhotosModal {...props} />);

    const removeButton = screen.queryByTestId('photos-modal-photos-remove');

    expect(removeButton).toBeTruthy();
  });

  it('should request to remove a photo on remove button click', async () => {
    const expected = unpublishedPhotoDataEntry.id;
    const onRemovePhoto = sinon.spy();
    const props = {
      isVisible: true,
      onClose: sinon.spy(),
      onRemovePhoto,
      title: 'One',
      onChangeFiles: sinon.spy(),
      photosData: [],
      unpublishedPhotosData: [unpublishedPhotoDataEntry]
    };
    render(<PhotosModal {...props} />);

    act(() => {
      const removeButton = screen.queryByTestId('photos-modal-photos-remove');
      userEvent.click(removeButton);
    });
    await waitFor(() => onRemovePhoto.called);

    const result = onRemovePhoto.firstCall || { args: [] };
    const actual = result.args[0] || '';
    expect(actual).toEqual(expected);
  });

  it('should publish an encoded photo dropped into the modal', async () => {
    const expected = 'data:image/png;base64,KOKMkOKWoV/ilqEp';

    let actual = '';
    const onChangeFiles = sinon.stub().callsFake((files: string[]) => {
      actual = files[0] || '';
    });

    const props = {
      isVisible: true,
      onClose: sinon.spy(),
      title: 'One',
      onChangeFiles,
      photosData: [],
      inspectionItemsPhotos: []
    };
    const ui = <PhotosModal {...props} />;
    const { rerender } = render(ui);
    const dropzone = screen.queryByTestId('inspection-item-photos-dropzone');
    const droppedFiles = dropzoneUtils.mockFiles([
      new File(['(⌐□_□)'], 'test.png', { type: 'image/png' })
    ]);

    dropzoneUtils.dispatchEvent(dropzone, 'drop', droppedFiles);
    await dropzoneUtils.flushPromises(rerender, ui);
    await new Promise((resolve) => setTimeout(resolve, 100)); // wait for onchange to flush

    expect(actual).toEqual(expected);
  });

  it('should not publish any photo drop while disabled', async () => {
    const expected = false;
    const onChangeFiles = sinon.spy();

    const props = {
      isVisible: true,
      disabled: true,
      onClose: sinon.spy(),
      title: 'One',
      onChangeFiles,
      photosData: [],
      inspectionItemsPhotos: []
    };
    const ui = <PhotosModal {...props} />;
    const { rerender } = render(ui);
    const dropzone = screen.queryByTestId('inspection-item-photos-dropzone');
    const droppedFiles = dropzoneUtils.mockFiles([
      new File(['(⌐□_□)'], 'test.png', { type: 'image/png' })
    ]);

    dropzoneUtils.dispatchEvent(dropzone, 'drop', droppedFiles);
    await dropzoneUtils.flushPromises(rerender, ui);
    await new Promise((resolve) => setTimeout(resolve, 100)); // wait for onchange to flush

    const actual = onChangeFiles.called;
    expect(actual).toEqual(expected);
  });
});
