import {
  createQueuedAttachment,
  stashPendingAttachments,
  takePendingAttachments
} from './pendingAttachments';

describe('Unit | Features | Property Work Orders | Utils | Pending Attachments', () => {
  test('it gives each queued file its own id and a blank description', () => {
    const file = new File(['x'], 'a.jpg');
    const [one, two] = [
      createQueuedAttachment(file),
      createQueuedAttachment(file)
    ];
    expect(one.id).not.toEqual(two.id);
    expect(one.file).toBe(file);
    expect(one.description).toEqual('');
  });

  test('it hands a stashed queue over once, per work order', () => {
    const items = [createQueuedAttachment(new File(['x'], 'a.jpg'))];
    stashPendingAttachments('531790', items);
    expect(takePendingAttachments('531791')).toEqual([]);
    expect(takePendingAttachments('531790')).toEqual(items);
    expect(takePendingAttachments('531790')).toEqual([]);
  });

  test('it ignores an empty queue', () => {
    stashPendingAttachments('531792', []);
    expect(takePendingAttachments('531792')).toEqual([]);
  });
});
