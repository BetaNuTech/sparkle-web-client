import sinon from 'sinon';
import { act, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import useCustomValues, { EMPTY_CUSTOM_VALUES } from './useCustomValues';
import yardiApi from '../../../common/services/api/yardi';
import errorReports from '../../../common/services/api/errorReports';
import ErrorProxyForbidden from '../../../common/models/errors/proxyForbidden';
import ErrorServerInternal from '../../../common/models/errors/serverInternal';
import customValues from '../../../__mocks__/yardi/customValues';

describe('Unit | Features | Property Work Orders | hooks | Use Custom Values', () => {
  afterEach(() => sinon.restore());

  test('should resolve the custom values for a property', async () => {
    const sendNotification = sinon.spy();
    sinon.stub(yardiApi, 'getCustomValuesRequest').resolves(customValues);

    const { result } = renderHook(() =>
      useCustomValues(sendNotification, 'test-property')
    );

    await act(async () => {
      await waitFor(() => result.current.status === 'success');
    });

    expect(result.current.data).toEqual(customValues);
    expect(sendNotification.called).toEqual(false);
  });

  test('should send an error notification when yardi is not configured and not redirect', async () => {
    const expected = 'error';
    const sendNotification = sinon.spy();
    sinon
      .stub(yardiApi, 'getCustomValuesRequest')
      .rejects(new ErrorProxyForbidden('nope'));

    const { result } = renderHook(() =>
      useCustomValues(sendNotification, 'test-property')
    );

    await act(async () => {
      await waitFor(() => sendNotification.called);
    });

    const call = sendNotification.firstCall || { args: [] };
    const actual = (call.args[1] || { type: '' }).type;
    expect(actual).toEqual(expected);
    expect(result.current.status).toEqual('error');
    expect(result.current.data).toEqual(EMPTY_CUSTOM_VALUES);
  });

  test('should send an error report for an unexpected error response', async () => {
    const sendNotification = sinon.spy();
    const sendReport = sinon.stub(errorReports, 'send').resolves(true);
    sinon
      .stub(yardiApi, 'getCustomValuesRequest')
      .rejects(new ErrorServerInternal('nope'));

    renderHook(() => useCustomValues(sendNotification, 'test-property'));

    await act(async () => {
      await waitFor(() => sendNotification.called);
    });

    expect(sendReport.called).toEqual(true);
  });
});
