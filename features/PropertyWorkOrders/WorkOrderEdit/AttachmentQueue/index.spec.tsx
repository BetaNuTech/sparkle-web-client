import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import { createQueuedAttachment } from '../../utils/pendingAttachments';
import AttachmentQueue from './index';

const baseProps = {
  items: [],
  onAdd: () => null,
  onRemove: () => null,
  onDescriptionChange: () => null
};

describe('Unit | Features | Property Work Orders | Work Order Edit | Attachment Queue', () => {
  it('should add every picked file and allow picking several at once', () => {
    const onAdd = sinon.spy();
    render(<AttachmentQueue {...baseProps} onAdd={onAdd} />);
    const input = screen.getByTestId(
      'work-order-queue-file'
    ) as HTMLInputElement;
    expect(input.multiple).toEqual(true);
    expect(
      screen.getByTestId('work-order-queue-camera').getAttribute('capture')
    ).toEqual('environment');
    expect(screen.queryByTestId('work-order-queue-take-photo')).toBeTruthy();

    userEvent.upload(input, [
      new File(['a'], 'a.jpg', { type: 'image/jpeg' }),
      new File(['b'], 'b.pdf', { type: 'application/pdf' })
    ]);
    expect(onAdd.firstCall.args[0].map((f: File) => f.name)).toEqual([
      'a.jpg',
      'b.pdf'
    ]);
  });

  it('should list queued files with a description each and a way to remove them', () => {
    const items = [
      createQueuedAttachment(new File(['a'], 'a.jpg')),
      {
        ...createQueuedAttachment(new File(['b'], 'b.pdf')),
        description: 'Lease'
      }
    ];
    const onRemove = sinon.spy();
    const onDescriptionChange = sinon.spy();
    render(
      <AttachmentQueue
        {...baseProps}
        items={items}
        onRemove={onRemove}
        onDescriptionChange={onDescriptionChange}
      />
    );
    expect(screen.getAllByTestId('work-order-queue-item')).toHaveLength(2);
    const [, second] = screen.getAllByTestId(
      'work-order-queue-item-description'
    ) as HTMLInputElement[];
    expect(second.value).toEqual('Lease');

    userEvent.type(second, '!');
    expect(onDescriptionChange.lastCall.args).toEqual([items[1].id, 'Lease!']);

    userEvent.click(screen.getAllByTestId('work-order-queue-item-remove')[0]);
    expect(onRemove.firstCall.args).toEqual([items[0].id]);
  });
});
