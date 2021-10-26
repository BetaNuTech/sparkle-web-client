import { render, screen } from '@testing-library/react';
import Attachment from './index';

describe('Common | Inspection Item Control | Attachment', () => {
  it('should disable when note and photo is false', async () => {
    const props = {
      notes: false,
      photos: false
    };

    render(<Attachment {...props} />);

    const elAttachmentNote = screen.queryByTestId('attachment-note');
    const elAttachmentPhoto = screen.queryByTestId('attachment-photo');

    expect(elAttachmentNote.dataset.test).toEqual('disabled');
    expect(elAttachmentPhoto.dataset.test).toEqual('disabled');
  });

  it('should not disable note element when note property is true', async () => {
    const props = {
      notes: true,
      photos: false
    };

    render(<Attachment {...props} />);

    const elAttachmentNote = screen.queryByTestId('attachment-note');

    expect(elAttachmentNote.dataset.test).toEqual('');
  });

  it('should not disable photo element when photo property is true', async () => {
    const props = {
      notes: false,
      photos: true
    };

    render(<Attachment {...props} />);

    const elAttachmentPhoto = screen.queryByTestId('attachment-photo');

    expect(elAttachmentPhoto.dataset.test).toEqual('');
  });
});
