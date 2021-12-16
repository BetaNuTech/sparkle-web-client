import sinon from 'sinon';
import { render, screen } from '@testing-library/react';
import MiniPreviewGallery from './index';

describe('Unit | Common | Mini Preview Gallery', () => {
  afterEach(() => sinon.restore());

  it('should not render mini preview gallery if there are not photos', () => {
    const props = {
      photos: []
    };
    render(<MiniPreviewGallery {...props} />);

    const container = screen.queryByTestId('miniPreviewGallery-container');
    expect(container).toBeNull();
  });

  it('should render mini preview gallery if there are photos', () => {
    const props = {
      photos: [
        { id: 'photo-1', caption: 'caption-1', downloadURL: 'downloadURL-1' }
      ]
    };
    render(<MiniPreviewGallery {...props} />);

    const container = screen.queryByTestId('miniPreviewGallery-container');
    expect(container).toBeVisible();
  });

  it('should not render more than 4 photos', () => {
    const props = {
      photos: [
        { id: 'photo-1', caption: 'caption-1', downloadURL: 'downloadURL-1' },
        { id: 'photo-2', caption: 'caption-2', downloadURL: 'downloadURL-2' },
        { id: 'photo-3', caption: 'caption-3', downloadURL: 'downloadURL-3' },
        { id: 'photo-4', caption: 'caption-4', downloadURL: 'downloadURL-4' },
        { id: 'photo-5', caption: 'caption-5', downloadURL: 'downloadURL-5' },
        { id: 'photo-6', caption: 'caption-6', downloadURL: 'downloadURL-6' }
      ]
    };
    render(<MiniPreviewGallery {...props} />);

    const galleryItems = screen.queryAllByTestId(
      'miniPreviewGallery-container-item'
    );
    expect(galleryItems.length).toEqual(4);
  });
});
