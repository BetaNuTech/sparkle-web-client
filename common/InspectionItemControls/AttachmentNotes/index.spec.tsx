import { render } from '@testing-library/react';
import AttachmentNotes from './index';

describe('Common | Inspection Item Control | Attachment Notes', () => {
  it('should not disable when enabled is true', async () => {
    const props = {
      enabled: true
    };

    const { container } = render(<AttachmentNotes {...props} />);

    const element = container.querySelector('li');

    expect(element.dataset.test).toEqual('');
  });

  it('should disable when enabled is false', async () => {
    const props = {
      enabled: false
    };

    const { container } = render(<AttachmentNotes {...props} />);

    const element = container.querySelector('li');

    expect(element.dataset.test).toEqual('disabled');
  });
});
