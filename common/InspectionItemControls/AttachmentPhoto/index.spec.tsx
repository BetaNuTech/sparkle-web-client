import { render } from '@testing-library/react';
import AttachmentPhoto from './index';

describe('Common | Inspection Item Control | Attachment Photo', () => {
  it('should not disable when enabled is true', async () => {
    const props = {
      enabled: true
    };

    const { container } = render(<AttachmentPhoto {...props} />);

    const element = container.querySelector('li');

    expect(element.dataset.test).toEqual('');
  });

  it('should disable when enabled is false', async () => {
    const props = {
      enabled: false
    };

    const { container } = render(<AttachmentPhoto {...props} />);

    const element = container.querySelector('li');

    expect(element.dataset.test).toEqual('disabled');
  });
});
