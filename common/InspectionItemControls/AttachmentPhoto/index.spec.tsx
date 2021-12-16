import { render } from '@testing-library/react';
import AttachmentPhoto from './index';

describe('Common | Inspection Item Control | Attachment Photo', () => {
  it('should not disable when enabled is true', async () => {
    const props = {
      selected: false,
      enabled: true
    };

    const { container } = render(<AttachmentPhoto {...props} />);

    const element = container.querySelector('li');

    expect(element.dataset.test).toEqual('');
  });

  it('should disable when enabled is false', async () => {
    const props = {
      selected: false,
      enabled: false
    };

    const { container } = render(<AttachmentPhoto {...props} />);

    const element = container.querySelector('li');

    expect(element.dataset.test).toEqual('disabled');
  });

  it('should be render with an existing photos value', () => {
    const props = {
      selected: true,
      enabled: true
    };
    const { container } = render(<AttachmentPhoto {...props} />);
    const element = container.querySelector('li');
    expect(element.dataset.testselected).toEqual('selected');
  });
});
