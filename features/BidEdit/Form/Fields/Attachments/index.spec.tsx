import { render, screen, fireEvent, act } from '@testing-library/react';

import Attachments from './index';

describe('Unit | Features | Bid Edit | Form | Attachments', () => {
  it('should not render if its new bid', async () => {
    const props = {
      onUploadClick: jest.fn(),
      isUploadingFile: false,
      onFileChange: jest.fn(),
      attachments: [],
      openAttachmentDeletePrompt: jest.fn(),
      isNewBid: true
    };
    render(<Attachments {...props} />);

    const element = screen.queryByTestId('input-file-attachment');
    expect(element).toBeNull();
  });

  it('should request to upload on change file input', async () => {
    const onFileChange = jest.fn();

    const props = {
      onUploadClick: jest.fn(),
      isUploadingFile: false,
      attachments: [],
      openAttachmentDeletePrompt: jest.fn(),
      isNewBid: false,
      onFileChange
    };

    render(<Attachments {...props} />);

    await act(async () => {
      const blob = new Blob(['foo'], { type: 'text/plain' });

      const fileInput = screen.queryByTestId('input-file-attachment');

      await fireEvent.change(fileInput, { target: { files: [blob] } });
    });
    expect(onFileChange).toHaveBeenCalled();
  });

  it('should invoke upload on change upload button click', async () => {
    const onUploadClick = jest.fn();

    const props = {
      isUploadingFile: false,
      onFileChange: jest.fn(),
      attachments: [],
      openAttachmentDeletePrompt: jest.fn(),
      isNewBid: false,
      onUploadClick
    };

    render(<Attachments {...props} />);

    await act(async () => {
      const btnUpload = screen.queryByTestId('input-file-attachment-upload');

      await fireEvent.click(btnUpload);
    });
    expect(onUploadClick).toHaveBeenCalled();
  });
});
