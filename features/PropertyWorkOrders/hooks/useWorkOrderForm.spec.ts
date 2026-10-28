import sinon from 'sinon';
import Router from 'next/router';
import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import useWorkOrderForm, {
  toFieldErrors,
  toFieldName
} from './useWorkOrderForm';
import yardiApi from '../../../common/services/api/yardi';
import errorReports from '../../../common/services/api/errorReports';
import ErrorBadRequest from '../../../common/models/errors/badRequest';
import ErrorForbidden from '../../../common/models/errors/forbidden';
import ErrorServerInternal from '../../../common/models/errors/serverInternal';
import { yardiWorkOrderOne } from '../../../__mocks__/yardi/workOrders';

const badRequest = (errors) => {
  const err = new ErrorBadRequest('fix request errors');
  err.addErrors(errors);
  return err;
};

describe('Unit | Features | Property Work Orders | hooks | Use Work Order Form', () => {
  afterEach(() => sinon.restore());

  test('it converts api error pointers into form field names', () => {
    const tests = [
      { pointer: '/data/attributes/unit', expected: 'unit' },
      { pointer: '/unit', expected: 'unit' },
      { pointer: 'unit', expected: 'unit' },
      { pointer: '', expected: '' }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { pointer, expected } = tests[i];
      expect(toFieldName(pointer)).toEqual(expected);
    }
  });

  test('it separates field errors from general errors', () => {
    const { fieldErrors, generalErrors } = toFieldErrors([
      { name: '/unit', title: 'required', detail: 'unit is required' },
      { name: '/priority', title: 'invalid', detail: '' },
      { name: 'unknown', title: 'Bad Request', detail: 'yardi rejected it' }
    ]);

    expect(fieldErrors).toEqual({
      unit: 'unit is required',
      priority: 'invalid'
    });
    expect(generalErrors).toEqual(['yardi rejected it']);
  });

  test('should create a work order and notify', async () => {
    const sendNotification = sinon.spy();
    const request = sinon
      .stub(yardiApi, 'createWorkOrderRequest')
      .resolves(yardiWorkOrderOne);

    const { result } = renderHook(() =>
      useWorkOrderForm(sendNotification, 'test-property')
    );

    let created = null;
    await act(async () => {
      created = await result.current.createWorkOrder({ unit: '1724' });
    });

    expect(request.firstCall.args).toEqual(['test-property', { unit: '1724' }]);
    expect(created).toEqual(yardiWorkOrderOne);
    expect(sendNotification.firstCall.args[1].type).toEqual('success');
    expect(result.current.isLoading).toEqual(false);
  });

  test('should expose yardi field rejections for a create', async () => {
    const sendNotification = sinon.spy();
    sinon.stub(Router, 'push');
    sinon.stub(yardiApi, 'createWorkOrderRequest').rejects(
      badRequest([
        {
          source: { pointer: '/data/attributes/unit' },
          title: 'Bad Request',
          detail: 'unit does not exist'
        }
      ])
    );

    const { result } = renderHook(() =>
      useWorkOrderForm(sendNotification, 'test-property')
    );

    let created = null;
    await act(async () => {
      created = await result.current.createWorkOrder({ unit: '1724' });
    });

    expect(created).toEqual(null);
    expect(result.current.fieldErrors).toEqual({
      unit: 'unit does not exist'
    });
    expect(sendNotification.firstCall.args[1].type).toEqual('error');

    act(() => result.current.clearErrors());
    expect(result.current.fieldErrors).toEqual({});
  });

  test('should patch a work order and resolve the stored record', async () => {
    const sendNotification = sinon.spy();
    const request = sinon
      .stub(yardiApi, 'updateWorkOrderRequest')
      .resolves(yardiWorkOrderOne);

    const { result } = renderHook(() =>
      useWorkOrderForm(sendNotification, 'test-property')
    );

    let updated = null;
    await act(async () => {
      updated = await result.current.updateWorkOrder('42', {
        priority: 'High'
      });
    });

    expect(request.firstCall.args).toEqual([
      'test-property',
      '42',
      { priority: 'High' }
    ]);
    expect(updated).toEqual(yardiWorkOrderOne);
    expect(sendNotification.firstCall.args[1].type).toEqual('success');
  });

  test('should cancel a work order by patching its status and reason', async () => {
    const expected = { status: 'Canceled', reason: 'Duplicate' };
    const sendNotification = sinon.spy();
    const request = sinon
      .stub(yardiApi, 'updateWorkOrderRequest')
      .resolves(yardiWorkOrderOne);

    const { result } = renderHook(() =>
      useWorkOrderForm(sendNotification, 'test-property')
    );

    await act(async () => {
      await result.current.cancelWorkOrder('42', 'Duplicate');
    });

    expect(request.firstCall.args[2]).toEqual(expected);

    await act(async () => {
      await result.current.cancelWorkOrder('42');
    });

    expect(request.secondCall.args[2]).toEqual({ status: 'Canceled' });
  });

  test('should notify when the user may not update work orders', async () => {
    const sendNotification = sinon.spy();
    sinon
      .stub(yardiApi, 'updateWorkOrderRequest')
      .rejects(new ErrorForbidden('nope'));

    const { result } = renderHook(() =>
      useWorkOrderForm(sendNotification, 'test-property')
    );

    await act(async () => {
      await result.current.updateWorkOrder('42', { priority: 'High' });
    });

    expect(sendNotification.firstCall.args[1].type).toEqual('error');
    expect(result.current.errors).toEqual([]);
  });

  test('should send an error report for an unexpected error response', async () => {
    const sendNotification = sinon.spy();
    const sendReport = sinon.stub(errorReports, 'send').resolves(true);
    sinon
      .stub(yardiApi, 'createWorkOrderRequest')
      .rejects(new ErrorServerInternal('nope'));

    const { result } = renderHook(() =>
      useWorkOrderForm(sendNotification, 'test-property')
    );

    await act(async () => {
      await result.current.createWorkOrder({ unit: '1724' });
    });

    expect(sendReport.called).toEqual(true);
  });
});
