import {
  render,
  screen,
  act,
  waitFor,
  fireEvent
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import yardiApi from '../../../../common/services/api/yardi';
import ErrorBadRequest from '../../../../common/models/errors/badRequest';
import errorReports from '../../../../common/services/api/errorReports';
import attachments, {
  yardiWorkOrderAttachmentImage,
  yardiWorkOrderAttachmentPdf,
  yardiWorkOrderAttachmentData
} from '../../../../__mocks__/yardi/workOrderAttachments';
import Attachments from './index';

const baseProps = {
  propertyId: 'property-1',
  workOrderId: '531781',
  canUpload: true,
  sendNotification: () => null
};

describe('Unit | Features | Property Work Orders | Work Order Edit | Attachments', () => {
  afterEach(() => sinon.restore());

  it('should list attachments with their description, type, size and date', async () => {
    sinon
      .stub(yardiApi, 'getWorkOrderAttachmentsRequest')
      .resolves(attachments);
    render(<Attachments {...baseProps} />);
    expect(screen.queryByTestId('work-order-attachments-loading')).toBeTruthy();

    const items = await screen.findAllByTestId('work-order-attachment');
    expect(items).toHaveLength(2);
    const [names, metas] = [
      screen.getAllByTestId('work-order-attachment-name'),
      screen.getAllByTestId('work-order-attachment-meta')
    ];
    expect(names[0].textContent).toEqual('Pool gate latch');
    expect(names[1].textContent).toEqual(yardiWorkOrderAttachmentPdf.name);
    expect(metas[0].textContent).toContain('JPG');
    expect(metas[0].textContent).toContain('200 KB');
    expect(metas[1].textContent).toContain('1.0 MB');
    const [view, download] = screen.getAllByTestId(
      'work-order-attachment-open'
    );
    expect(view.textContent).toEqual('View');
    expect(download.textContent).toEqual('Download');
  });

  it('should say when there are no attachments or they failed to load', async () => {
    const list = sinon.stub(yardiApi, 'getWorkOrderAttachmentsRequest');
    list.onFirstCall().resolves([]);
    list.onSecondCall().rejects(Error('boom'));
    sinon.stub(errorReports, 'send').resolves();
    const { unmount } = render(<Attachments {...baseProps} />);
    expect(
      await screen.findByTestId('work-order-attachments-empty')
    ).toBeTruthy();
    unmount();

    render(<Attachments {...baseProps} workOrderId="2" />);
    expect(
      await screen.findByTestId('work-order-attachments-error')
    ).toBeTruthy();
  });

  it('should only offer uploads when allowed', async () => {
    sinon.stub(yardiApi, 'getWorkOrderAttachmentsRequest').resolves([]);
    const { rerender } = render(
      <Attachments {...baseProps} canUpload={false} />
    );
    await screen.findByTestId('work-order-attachments-empty');
    expect(screen.queryByTestId('work-order-attachment-add')).toBeNull();

    rerender(<Attachments {...baseProps} />);
    expect(screen.queryByTestId('work-order-attachment-add')).toBeTruthy();
    userEvent.click(screen.getByTestId('work-order-attachment-add'));
    expect(screen.queryByTestId('work-order-attachment-form')).toBeTruthy();
    expect(
      (screen.getByTestId('work-order-attachment-upload') as HTMLButtonElement)
        .disabled
    ).toEqual(true);
  });

  it('should upload the picked file with its description and refresh the list', async () => {
    const list = sinon.stub(yardiApi, 'getWorkOrderAttachmentsRequest');
    list.onFirstCall().resolves([]);
    list.onSecondCall().resolves([yardiWorkOrderAttachmentImage]);
    const create = sinon
      .stub(yardiApi, 'createWorkOrderAttachmentRequest')
      .resolves(yardiWorkOrderAttachmentImage);
    render(<Attachments {...baseProps} />);
    await screen.findByTestId('work-order-attachments-empty');

    userEvent.click(screen.getByTestId('work-order-attachment-add'));
    userEvent.upload(
      screen.getByTestId('work-order-attachment-file'),
      new File(['hello'], 'gate.jpg', { type: 'image/jpeg' })
    );
    userEvent.type(
      screen.getByTestId('work-order-attachment-description'),
      'Pool gate latch'
    );

    await act(async () => {
      userEvent.click(screen.getByTestId('work-order-attachment-upload'));
    });

    await waitFor(() => expect(create.called).toEqual(true));
    expect(create.firstCall.args).toEqual([
      'property-1',
      '531781',
      { data: 'aGVsbG8=', extension: 'jpg', description: 'Pool gate latch' }
    ]);
    await screen.findAllByTestId('work-order-attachment');
    expect(screen.queryByTestId('work-order-attachment-form')).toBeNull();
    expect(list.callCount).toEqual(2);
  });

  it('should show a yardi rejection next to the file', async () => {
    sinon.stub(yardiApi, 'getWorkOrderAttachmentsRequest').resolves([]);
    const err = new ErrorBadRequest('fix request errors');
    err.addErrors([
      {
        source: { pointer: '/attachment' },
        title: 'Bad Request',
        detail: 'Invalid File Extension: exe'
      }
    ]);
    sinon.stub(yardiApi, 'createWorkOrderAttachmentRequest').rejects(err);
    render(<Attachments {...baseProps} />);
    await screen.findByTestId('work-order-attachments-empty');

    userEvent.click(screen.getByTestId('work-order-attachment-add'));
    userEvent.upload(
      screen.getByTestId('work-order-attachment-file'),
      new File(['x'], 'tool.exe')
    );
    await act(async () => {
      userEvent.click(screen.getByTestId('work-order-attachment-upload'));
    });

    const error = await screen.findByTestId('work-order-attachment-error-file');
    expect(error.textContent).toEqual('Invalid File Extension: exe');
    expect(screen.queryByTestId('work-order-attachment-form')).toBeTruthy();
  });

  it('should fetch an image on demand and preview it inline', async () => {
    sinon
      .stub(yardiApi, 'getWorkOrderAttachmentsRequest')
      .resolves([yardiWorkOrderAttachmentImage]);
    const get = sinon.stub(yardiApi, 'getWorkOrderAttachmentRequest').resolves({
      ...yardiWorkOrderAttachmentImage,
      data: yardiWorkOrderAttachmentData
    });
    render(<Attachments {...baseProps} />);
    await screen.findAllByTestId('work-order-attachment');
    expect(screen.queryByTestId('work-order-attachment-preview')).toBeNull();

    await act(async () => {
      userEvent.click(screen.getByTestId('work-order-attachment-open'));
    });

    const preview = await screen.findByTestId('work-order-attachment-preview');
    expect(preview.getAttribute('src')).toEqual(
      `data:image/jpeg;base64,${yardiWorkOrderAttachmentData}`
    );
    expect(get.firstCall.args).toEqual([
      'property-1',
      '531781',
      yardiWorkOrderAttachmentImage.name
    ]);
    expect(
      screen
        .getByTestId('work-order-attachment-download')
        .getAttribute('download')
    ).toEqual(yardiWorkOrderAttachmentImage.name);

    userEvent.click(screen.getByTestId('work-order-attachment-preview-close'));
    await waitFor(() =>
      expect(screen.queryByTestId('work-order-attachment-preview')).toBeNull()
    );
  });

  it('should download a non-image attachment instead of previewing it', async () => {
    sinon
      .stub(yardiApi, 'getWorkOrderAttachmentsRequest')
      .resolves([yardiWorkOrderAttachmentPdf]);
    sinon.stub(yardiApi, 'getWorkOrderAttachmentRequest').resolves({
      ...yardiWorkOrderAttachmentPdf,
      data: 'JVBERi0='
    });
    const click = sinon.stub(HTMLAnchorElement.prototype, 'click');
    render(<Attachments {...baseProps} />);
    await screen.findAllByTestId('work-order-attachment');

    await act(async () => {
      userEvent.click(screen.getByTestId('work-order-attachment-open'));
    });

    await waitFor(() => expect(click.called).toEqual(true));
    const link = click.firstCall.thisValue as HTMLAnchorElement;
    expect(link.getAttribute('download')).toEqual(
      yardiWorkOrderAttachmentPdf.name
    );
    expect(link.getAttribute('href')).toEqual(
      'data:application/pdf;base64,JVBERi0='
    );
    expect(screen.queryByTestId('work-order-attachment-preview')).toBeNull();
  });

  it('should explain when a stored image cannot be displayed', async () => {
    sinon
      .stub(yardiApi, 'getWorkOrderAttachmentsRequest')
      .resolves([yardiWorkOrderAttachmentImage]);
    sinon
      .stub(yardiApi, 'getWorkOrderAttachmentRequest')
      .resolves({ ...yardiWorkOrderAttachmentImage, data: 'bm90IGFuIGltYWdl' });
    render(<Attachments {...baseProps} />);
    await screen.findAllByTestId('work-order-attachment');

    await act(async () => {
      userEvent.click(screen.getByTestId('work-order-attachment-open'));
    });
    const preview = await screen.findByTestId('work-order-attachment-preview');
    fireEvent.error(preview);

    expect(
      screen.queryByTestId('work-order-attachment-preview-broken')
    ).toBeTruthy();
    expect(screen.queryByTestId('work-order-attachment-download')).toBeTruthy();
  });

  it('should take a photo through a camera input and show what was picked', async () => {
    sinon.stub(yardiApi, 'getWorkOrderAttachmentsRequest').resolves([]);
    render(<Attachments {...baseProps} />);
    await screen.findByTestId('work-order-attachments-empty');
    userEvent.click(screen.getByTestId('work-order-attachment-add'));

    const camera = screen.getByTestId(
      'work-order-attachment-camera'
    ) as HTMLInputElement;
    expect(camera.getAttribute('capture')).toEqual('environment');
    expect(camera.getAttribute('accept')).toEqual('image/*');
    expect(
      screen.queryByTestId('work-order-attachment-take-photo')
    ).toBeTruthy();

    userEvent.upload(
      camera,
      new File(['photo'], 'IMG_0001.jpg', { type: 'image/jpeg' })
    );
    expect(
      screen.getByTestId('work-order-attachment-picked').textContent
    ).toContain('IMG_0001.jpg');
    expect(
      (screen.getByTestId('work-order-attachment-upload') as HTMLButtonElement)
        .disabled
    ).toEqual(false);
  });
});
