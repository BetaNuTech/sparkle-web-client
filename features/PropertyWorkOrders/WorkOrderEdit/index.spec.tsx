import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import Router from 'next/router';
import customValues from '../../../__mocks__/yardi/customValues';
import { yardiWorkOrderOne } from '../../../__mocks__/yardi/workOrders';
import yardiApi from '../../../common/services/api/yardi';
import features from '../../../config/features';
import ErrorBadRequest from '../../../common/models/errors/badRequest';
import WorkOrderEdit from './index';

const property = { id: 'property-1', name: 'Test Property' } as any;

const baseProps = {
  isOnline: true,
  property,
  customValues,
  customValuesStatus: 'success',
  sendNotification: () => null
};

const badRequest = (pointer: string, detail: string) => {
  const err = new ErrorBadRequest('fix request errors');
  err.addErrors([{ source: { pointer }, title: 'Bad Request', detail }]);
  return err;
};

describe('Unit | Features | Property Work Orders | Work Order Edit', () => {
  let flag;
  beforeEach(() => {
    flag = features.supportPropertyYardiWorkOrderEdit;
    features.supportPropertyYardiWorkOrderEdit = true;
    // Details mount the attachments list
    sinon.stub(yardiApi, 'getWorkOrderAttachmentsRequest').resolves([]);
  });
  afterEach(() => {
    features.supportPropertyYardiWorkOrderEdit = flag;
    sinon.restore();
  });

  it('should show read-only details with edit and cancel actions for an existing work order', () => {
    render(<WorkOrderEdit {...baseProps} workOrder={yardiWorkOrderOne} />);
    expect(screen.queryByTestId('work-order-details')).toBeTruthy();
    expect(screen.queryByTestId('work-order-form')).toBeNull();
    expect(screen.queryByTestId('work-order-edit')).toBeTruthy();
    expect(screen.queryByTestId('work-order-cancel')).toBeTruthy();
  });

  it('should show attachments on the details and only offer uploads when the feature is on', () => {
    const { unmount } = render(
      <WorkOrderEdit {...baseProps} workOrder={yardiWorkOrderOne} />
    );
    expect(screen.queryByTestId('work-order-attachments')).toBeTruthy();
    expect(screen.queryByTestId('work-order-attachment-add')).toBeTruthy();
    userEvent.click(screen.getByTestId('work-order-edit'));
    expect(screen.queryByTestId('work-order-attachments')).toBeNull();
    unmount();

    features.supportPropertyYardiWorkOrderEdit = false;
    render(<WorkOrderEdit {...baseProps} workOrder={yardiWorkOrderOne} />);
    expect(screen.queryByTestId('work-order-attachments')).toBeTruthy();
    expect(screen.queryByTestId('work-order-attachment-add')).toBeNull();
  });

  it('should not show attachments while creating', () => {
    render(<WorkOrderEdit {...baseProps} />);
    expect(screen.queryByTestId('work-order-attachments')).toBeNull();
  });

  it('should hide write actions when the feature is dark', () => {
    features.supportPropertyYardiWorkOrderEdit = false;
    render(<WorkOrderEdit {...baseProps} workOrder={yardiWorkOrderOne} />);
    expect(screen.queryByTestId('work-order-details')).toBeTruthy();
    expect(screen.queryByTestId('work-order-edit')).toBeNull();
    expect(screen.queryByTestId('work-order-cancel')).toBeNull();
  });

  it('should not offer cancelling an already cancelled work order', () => {
    render(
      <WorkOrderEdit
        {...baseProps}
        workOrder={{ ...yardiWorkOrderOne, status: 'canceled' }}
      />
    );
    expect(screen.queryByTestId('work-order-edit')).toBeTruthy();
    expect(screen.queryByTestId('work-order-cancel')).toBeNull();
  });

  it('should block editing when the custom values failed to load', () => {
    render(
      <WorkOrderEdit
        {...baseProps}
        workOrder={yardiWorkOrderOne}
        customValuesStatus="error"
      />
    );
    expect(screen.queryByTestId('work-order-values-notice')).toBeTruthy();
    expect(screen.queryByTestId('work-order-edit')).toBeNull();
  });

  it('should start in the form when creating and require a summary for a request without a unit', async () => {
    const create = sinon.stub(yardiApi, 'createWorkOrderRequest');
    render(<WorkOrderEdit {...baseProps} />);
    expect(screen.queryByTestId('work-order-form')).toBeTruthy();

    await act(async () => {
      userEvent.click(screen.getByTestId('work-order-save'));
    });

    expect(
      screen.getByTestId('work-order-error-briefDescription').textContent
    ).toEqual('A summary is required when there is no unit');
    expect(screen.queryByTestId('work-order-error-unit')).toBeNull();
    expect(create.called).toEqual(false);
  });

  it('should post a request with no unit without a unit attribute', async () => {
    sinon.stub(Router, 'push');
    const create = sinon
      .stub(yardiApi, 'createWorkOrderRequest')
      .resolves({ ...yardiWorkOrderOne, unit: '' });
    render(<WorkOrderEdit {...baseProps} />);

    userEvent.type(
      screen.getByTestId('work-order-input-briefDescription'),
      'Pool gate latch broken'
    );

    await act(async () => {
      userEvent.click(screen.getByTestId('work-order-save'));
    });

    await waitFor(() => expect(create.called).toEqual(true));
    expect(create.firstCall.args).toEqual([
      'property-1',
      { briefDescription: 'Pool gate latch broken' }
    ]);
  });

  it('should post only the entered attributes when creating', async () => {
    const expected = { unit: '1724', priority: 'High', description: 'Leak' };
    sinon.stub(Router, 'push');
    const create = sinon
      .stub(yardiApi, 'createWorkOrderRequest')
      .resolves(yardiWorkOrderOne);
    render(<WorkOrderEdit {...baseProps} />);

    userEvent.type(screen.getByTestId('work-order-input-unit'), '1724');
    userEvent.selectOptions(
      screen.getByTestId('work-order-input-priority'),
      'High'
    );
    userEvent.type(screen.getByTestId('work-order-input-description'), 'Leak');

    await act(async () => {
      userEvent.click(screen.getByTestId('work-order-save'));
    });

    await waitFor(() => expect(create.called).toEqual(true));
    expect(create.firstCall.args).toEqual(['property-1', expected]);
  });

  it('should fill the unit and tenant code from a picked resident unit', async () => {
    const unitOptions = [
      { unit: '1-103', resident: 't0225029', label: '1-103 · Jane Doe' }
    ];
    sinon.stub(Router, 'push');
    const create = sinon
      .stub(yardiApi, 'createWorkOrderRequest')
      .resolves(yardiWorkOrderOne);
    render(<WorkOrderEdit {...baseProps} unitOptions={unitOptions} />);

    const picker = screen.getByTestId('work-order-input-unitPicker');
    const [option] = Array.from(picker.querySelectorAll('option')).slice(2);
    userEvent.selectOptions(picker, option.getAttribute('value'));

    await act(async () => {
      userEvent.click(screen.getByTestId('work-order-save'));
    });

    await waitFor(() => expect(create.called).toEqual(true));
    expect(create.firstCall.args).toEqual([
      'property-1',
      { unit: '1-103', resident: 't0225029' }
    ]);
  });

  it('should patch only the changed attributes when editing', async () => {
    const expected = { priority: 'Low', permissionToEnter: true };
    const onWorkOrderUpdated = sinon.spy();
    const update = sinon
      .stub(yardiApi, 'updateWorkOrderRequest')
      .resolves({ ...yardiWorkOrderOne, priority: 'low' });
    render(
      <WorkOrderEdit
        {...baseProps}
        workOrder={{ ...yardiWorkOrderOne, priority: 'high' }}
        onWorkOrderUpdated={onWorkOrderUpdated}
      />
    );

    userEvent.click(screen.getByTestId('work-order-edit'));
    userEvent.selectOptions(
      screen.getByTestId('work-order-input-priority'),
      'Low'
    );
    userEvent.click(screen.getByTestId('work-order-input-permissionToEnter'));

    await act(async () => {
      userEvent.click(screen.getByTestId('work-order-save'));
    });

    await waitFor(() => expect(update.called).toEqual(true));
    expect(update.firstCall.args).toEqual([
      'property-1',
      yardiWorkOrderOne.id,
      expected
    ]);
    expect(onWorkOrderUpdated.called).toEqual(true);
    await screen.findByTestId('work-order-details');
    expect(screen.queryByTestId('work-order-form')).toBeNull();
  });

  it('should require a reason before saving a status that needs one', async () => {
    const update = sinon.stub(yardiApi, 'updateWorkOrderRequest');
    render(<WorkOrderEdit {...baseProps} workOrder={yardiWorkOrderOne} />);

    userEvent.click(screen.getByTestId('work-order-edit'));
    userEvent.selectOptions(
      screen.getByTestId('work-order-input-status'),
      'On Hold'
    );

    await act(async () => {
      userEvent.click(screen.getByTestId('work-order-save'));
    });

    expect(screen.getByTestId('work-order-error-reason').textContent).toEqual(
      'This status requires a reason'
    );
    expect(update.called).toEqual(false);
  });

  it('should show yardi field rejections next to the field', async () => {
    sinon
      .stub(yardiApi, 'updateWorkOrderRequest')
      .rejects(badRequest('/data/attributes/vendor', 'unknown vendor'));
    render(<WorkOrderEdit {...baseProps} workOrder={yardiWorkOrderOne} />);

    userEvent.click(screen.getByTestId('work-order-edit'));
    userEvent.type(screen.getByTestId('work-order-input-vendor'), 'ACME');

    await act(async () => {
      userEvent.click(screen.getByTestId('work-order-save'));
    });

    const error = await screen.findByTestId('work-order-error-vendor');
    expect(error.textContent).toEqual('unknown vendor');
    expect(screen.queryByTestId('work-order-form')).toBeTruthy();
  });

  it('should discard edits and return to the details', () => {
    render(<WorkOrderEdit {...baseProps} workOrder={yardiWorkOrderOne} />);
    userEvent.click(screen.getByTestId('work-order-edit'));
    userEvent.type(screen.getByTestId('work-order-input-vendor'), 'ACME');
    userEvent.click(screen.getByTestId('work-order-discard'));
    expect(screen.queryByTestId('work-order-details')).toBeTruthy();
    userEvent.click(screen.getByTestId('work-order-edit'));
    expect(screen.getByTestId('work-order-input-vendor')).toHaveValue('');
  });

  it('should cancel a work order with the chosen reason', async () => {
    const expected = { status: 'Canceled', reason: 'Duplicate' };
    const onWorkOrderUpdated = sinon.spy();
    const update = sinon
      .stub(yardiApi, 'updateWorkOrderRequest')
      .resolves({ ...yardiWorkOrderOne, status: 'canceled' });
    render(
      <WorkOrderEdit
        {...baseProps}
        workOrder={yardiWorkOrderOne}
        onWorkOrderUpdated={onWorkOrderUpdated}
      />
    );

    userEvent.click(screen.getByTestId('work-order-cancel'));
    userEvent.selectOptions(
      screen.getByTestId('cancel-work-order-reason'),
      'Duplicate'
    );

    await act(async () => {
      userEvent.click(screen.getByTestId('cancel-work-order-confirm'));
    });

    await waitFor(() => expect(update.called).toEqual(true));
    expect(update.firstCall.args).toEqual([
      'property-1',
      yardiWorkOrderOne.id,
      expected
    ]);
    expect(onWorkOrderUpdated.called).toEqual(true);
  });

  it('should not let a legacy value yardi already holds block an unrelated edit', async () => {
    const update = sinon
      .stub(yardiApi, 'updateWorkOrderRequest')
      .resolves(yardiWorkOrderOne);
    render(
      <WorkOrderEdit
        {...baseProps}
        workOrder={{ ...yardiWorkOrderOne, resident: 'way-too-long-code' }}
      />
    );

    userEvent.click(screen.getByTestId('work-order-edit'));
    userEvent.type(screen.getByTestId('work-order-input-vendor'), 'ACME');

    await act(async () => {
      userEvent.click(screen.getByTestId('work-order-save'));
    });

    await waitFor(() => expect(update.called).toEqual(true));
    expect(update.firstCall.args[2]).toEqual({ vendor: 'ACME' });
  });
});
