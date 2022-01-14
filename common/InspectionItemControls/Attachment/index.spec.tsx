import sinon from 'sinon';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Attachment from './index';

describe('Common | Inspection Item Controls | Attachment', () => {
  afterEach(() => sinon.restore());

  it('should disable note and photo when not enabled', async () => {
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

  it('should not disable note when it is enabled', async () => {
    const props = {
      notes: true,
      photos: false
    };

    render(<Attachment {...props} />);

    const elAttachmentNote = screen.queryByTestId('attachment-note');
    expect(elAttachmentNote.dataset.test).toEqual('');
  });

  it('should not disable photo when it is  enabled', async () => {
    const props = {
      notes: false,
      photos: true
    };

    render(<Attachment {...props} />);

    const elAttachmentPhoto = screen.queryByTestId('attachment-photo');
    expect(elAttachmentPhoto.dataset.test).toEqual('');
  });

  it('should show notes and attachment icons as deficient when item has a deficient selection', async () => {
    const props = {
      notes: true,
      photos: true,
      isDeficient: true
    };

    render(<Attachment {...props} />);

    // waiting for deficientItemList to be updated in state
    await act(async () => {
      // need to set timeout in the same way we are doing it in component
      const now = Date.now();
      const nextSecond = Math.ceil(now / 1000) * 1000;
      const timeout = nextSecond - now;
      await new Promise((r) => setTimeout(r, timeout));
    });

    const attachmentNotes = screen.queryByTestId('attachment-note');
    const attachmentPhotos = screen.queryByTestId('attachment-photo');
    expect(attachmentNotes.dataset.testdeficient).toEqual('deficient');
    expect(attachmentPhotos.dataset.testdeficient).toEqual('deficient');
  });

  it('should not show notes and attachment icons as deficient when item has a sufficent selection', async () => {
    const props = {
      notes: true,
      photos: true,
      isDeficient: false
    };

    render(<Attachment {...props} />);

    // waiting for deficientItemList to be updated in state
    await act(async () => {
      // need to set timeout in the same way we are doing it in component
      const now = Date.now();
      const nextSecond = Math.ceil(now / 1000) * 1000;
      const timeout = nextSecond - now;
      await new Promise((r) => setTimeout(r, timeout));
    });

    const attachmentNotes = screen.queryByTestId('attachment-note');
    const attachmentPhotos = screen.queryByTestId('attachment-photo');
    expect(attachmentNotes.dataset.testdeficient).toEqual('');
    expect(attachmentPhotos.dataset.testdeficient).toEqual('');
  });

  it('should disable notes and photos if user is not permitted', () => {
    const expected = false;
    const onClickPhotos = sinon.spy();
    const onClickAttachmentNotes = sinon.spy();
    const props = {
      notes: true,
      photos: true,
      onClickAttachmentNotes,
      onClickPhotos,
      canEdit: false,
      isDeficient: false
    };
    render(<Attachment {...props} />);

    act(() => {
      const attachmentNotes = screen.queryByTestId('attachment-note');
      const attachmentPhotos = screen.queryByTestId('attachment-photo');

      userEvent.click(attachmentNotes);
      userEvent.click(attachmentPhotos);
    });

    expect(onClickPhotos.called).toEqual(expected);
    expect(onClickAttachmentNotes.called).toEqual(expected);
  });

  it('should disable note icon when not enabled', () => {
    const expected = false;
    const onClickAttachmentNotes = sinon.spy();
    const props = {
      notes: false,
      photos: true,
      onClickAttachmentNotes,
      onClickPhotos: sinon.spy(),
      canEdit: true,
      isDeficient: false
    };
    render(<Attachment {...props} />);

    act(() => {
      const attachmentNotes = screen.queryByTestId('attachment-note');
      userEvent.click(attachmentNotes);
    });

    expect(onClickAttachmentNotes.called).toEqual(expected);
  });

  it('should disable photo icon when not enabled', () => {
    const expected = false;
    const onClickPhotos = sinon.spy();
    const props = {
      notes: true,
      photos: false,
      onClickAttachmentNotes: sinon.spy(),
      onClickPhotos,
      canEdit: true,
      isDeficient: false
    };
    render(<Attachment {...props} />);

    act(() => {
      const attachmentPhotos = screen.queryByTestId('attachment-photo');
      userEvent.click(attachmentPhotos);
    });

    expect(onClickPhotos.called).toEqual(expected);
  });

  it('should enable notes icon when inspector notes are available', () => {
    const expected = true;
    const onClickAttachmentNotes = sinon.spy();
    const props = {
      notes: true,
      photos: true,
      onClickAttachmentNotes,
      onClickPhotos: sinon.spy(),
      canEdit: false,
      isDeficient: false,
      inspectorNotes: 'this is inspector notes'
    };
    render(<Attachment {...props} />);

    act(() => {
      const attachmentNotes = screen.queryByTestId('attachment-note');
      userEvent.click(attachmentNotes);
    });

    expect(onClickAttachmentNotes.called).toEqual(expected);
  });
});
