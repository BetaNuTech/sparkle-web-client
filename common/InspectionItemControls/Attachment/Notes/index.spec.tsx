import { render } from '@testing-library/react';
import AttachmentNotes from './index';

describe('Common | Inspection Item Controls | Attachment Notes', () => {
  it('should not be disabled when notes are enabled', async () => {
    const props = {
      enabled: true,
      selected: false,
      onClick: () => null
    };

    const { container } = render(<AttachmentNotes {...props} />);

    const element = container.querySelector('li');

    expect(element.dataset.test).toEqual('');
  });

  it('should be disabled when notes are not enabled', () => {
    const props = {
      enabled: false,
      selected: false,
      onClick: () => null
    };

    const { container } = render(<AttachmentNotes {...props} />);

    const element = container.querySelector('li');

    expect(element.dataset.test).toEqual('disabled');
  });

  it('should show as selected when there are existing inspector notes', () => {
    const props = {
      selected: true,
      enabled: false,
      onClick: () => null
    };
    const { container } = render(<AttachmentNotes {...props} />);
    const element = container.querySelector('li');
    expect(element.dataset.testselected).toEqual('selected');
  });
});
