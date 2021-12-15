import sinon from 'sinon';
import { render } from '@testing-library/react';
import AttachmentNotes from './index';

describe('Common | Inspection Item Control | Attachment Notes', () => {
  it('should not be disabled when notes are enabled', async () => {
    const props = {
      enabled: true,
      selected: false,
      onClickAttachmentNotes: sinon.spy()
    };

    const { container } = render(<AttachmentNotes {...props} />);

    const element = container.querySelector('li');

    expect(element.dataset.test).toEqual('');
  });

  it('should be disabled when notes are not enabled', () => {
    const props = {
      enabled: false,
      selected: false,
      onClickAttachmentNotes: sinon.spy()
    };

    const { container } = render(<AttachmentNotes {...props} />);

    const element = container.querySelector('li');

    expect(element.dataset.test).toEqual('disabled');
  });

  it('should be render with an existing inspector note value', () => {
    const props = {
      selected: true,
      enabled: false,
      onClickAttachmentNotes: sinon.spy()
    };
    const { container } = render(<AttachmentNotes {...props} />);
    const element = container.querySelector('li');
    expect(element.dataset.testselected).toEqual('selected');
  });
});
