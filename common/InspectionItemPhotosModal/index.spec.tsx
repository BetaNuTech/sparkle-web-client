import sinon from 'sinon';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PhotosModal from './index';
import { photoDataEntry } from '../../__mocks__/inspections';

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
      photosData: []
    };
    render(<PhotosModal {...props} />);

    const closeButton = screen.queryByTestId('photos-modal-close');
    userEvent.click(closeButton);

    const actual = onClose.called;
    expect(actual).toEqual(expected);
  });

  it('opens Inspection item photos modal on click when not visible', () => {
    const onClose = sinon.spy();
    const props = {
      isVisible: true,
      onClose,
      title: 'One',
      onChangeFiles: sinon.spy(),
      photosData: []
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
      photosData: [photoDataEntry]
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
      photosData: []
    };
    render(<PhotosModal {...props} />);

    const photosContainer = screen.queryByTestId('photos-modal-photos');

    expect(photosContainer).toBeNull();
  });
});
