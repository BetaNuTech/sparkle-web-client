import { render } from '@testing-library/react';
import AttachmentPhoto from './index';

describe('Common | Inspection Item Controls | Attachment Photo', () => {
  it('should not be disabled when enabled', async () => {
    const props = {
      selected: false,
      enabled: true
    };

    const { container } = render(<AttachmentPhoto {...props} />);

    const element = container.querySelector('li');

    expect(element.dataset.test).toEqual('');
  });

  it('should disable when not enabled', async () => {
    const props = {
      selected: false,
      enabled: false
    };

    const { container } = render(<AttachmentPhoto {...props} />);

    const element = container.querySelector('li');

    expect(element.dataset.test).toEqual('disabled');
  });

  it('should show as selected when it has existing photos', () => {
    const props = {
      selected: true,
      enabled: true
    };
    const { container } = render(<AttachmentPhoto {...props} />);
    const element = container.querySelector('li');
    expect(element.dataset.testselected).toEqual('selected');
  });
});
