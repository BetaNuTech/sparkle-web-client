import sinon from 'sinon';
import Router from 'next/router';
import { act, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import useWorkOrder from './useWorkOrder';
import yardiApi from '../../../common/services/api/yardi';
import errorReports from '../../../common/services/api/errorReports';
import ErrorNotFound from '../../../common/models/errors/notFound';
import ErrorServerInternal from '../../../common/models/errors/serverInternal';
import { yardiWorkOrderOne } from '../../../__mocks__/yardi/workOrders';

describe('Unit | Features | Property Work Orders | hooks | Use Work Order', () => {
  afterEach(() => sinon.restore());

  test('should resolve the requested work order', async () => {
    const sendNotification = sinon.spy();
    const request = sinon
      .stub(yardiApi, 'getWorkOrderRequest')
      .resolves(yardiWorkOrderOne);

    const { result } = renderHook(() =>
      useWorkOrder(sendNotification, 'test-property', '42')
    );

    await act(async () => {
      await waitFor(() => result.current.status === 'success');
    });

    expect(request.firstCall.args).toEqual(['test-property', '42']);
    expect(result.current.data).toEqual(yardiWorkOrderOne);
  });

  test('should notify and redirect to the list when the work order is not found', async () => {
    const expected = '/properties/test-property/yardi-work-orders';
    const sendNotification = sinon.spy();
    const redirect = sinon.stub(Router, 'push');
    sinon
      .stub(yardiApi, 'getWorkOrderRequest')
      .rejects(new ErrorNotFound('nope'));

    renderHook(() => useWorkOrder(sendNotification, 'test-property', '42'));

    await act(async () => {
      await waitFor(() => redirect.called);
    });

    const actual = redirect.firstCall.args[0];
    expect(actual).toEqual(expected);
    expect(sendNotification.firstCall.args[1].type).toEqual('error');
  });

  test('should send an error report for an unexpected error response', async () => {
    const sendNotification = sinon.spy();
    const sendReport = sinon.stub(errorReports, 'send').resolves(true);
    sinon.stub(Router, 'push');
    sinon
      .stub(yardiApi, 'getWorkOrderRequest')
      .rejects(new ErrorServerInternal('nope'));

    renderHook(() => useWorkOrder(sendNotification, 'test-property', '42'));

    await act(async () => {
      await waitFor(() => sendNotification.called);
    });

    expect(sendReport.called).toEqual(true);
  });

  test('should allow replacing the loaded work order after an update', async () => {
    const expected = { ...yardiWorkOrderOne, status: 'canceled' };
    const sendNotification = sinon.spy();
    sinon.stub(yardiApi, 'getWorkOrderRequest').resolves(yardiWorkOrderOne);

    const { result } = renderHook(() =>
      useWorkOrder(sendNotification, 'test-property', '42')
    );

    await act(async () => {
      await waitFor(() => result.current.status === 'success');
    });

    act(() => result.current.setData(expected));
    expect(result.current.data).toEqual(expected);
  });
});
