import sinon from 'sinon';
import Router from 'next/router';
import { act, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import useResidents from './useResidents';
import yardiApi from '../../../common/services/api/yardi';
import errorReports from '../../../common/services/api/errorReports';
import ErrorForbidden from '../../../common/models/errors/forbidden';
import ErrorServerInternal from '../../../common/models/errors/serverInternal';

const emptyCollectionResult = {
  status: 'success',
  data: []
};

describe('Unit | Features | Property Residents | hooks | Use Residents', () => {
  afterEach(() => sinon.restore());

  test('should send an error notification for a forbidden request and redirect user', async () => {
    const expected = 'error';
    const sendNotification = sinon.spy();
    const redirect = sinon.stub(Router, 'push');
    sinon
      .stub(yardiApi, 'getResidentsRequest')
      .rejects(new ErrorForbidden('nope'));

    renderHook(() => useResidents(sendNotification, 'test-property'));

    await act(async () => {
      await waitFor(() => sendNotification.called);
    });

    const result = sendNotification.firstCall || { args: [] };
    const actual = (result.args[1] || { type: '' }).type;
    expect(actual, 'sent error notification').toEqual(expected);
    expect(redirect.called, 'redirected user').toEqual(true);
  });

  test('should send an error notification and error report for an unexpected error response', async () => {
    const expected = 'error';
    const sendNotification = sinon.spy();
    const sendReport = sinon.stub(errorReports, 'send').resolves(true);
    sinon.stub(Router, 'push');
    sinon
      .stub(yardiApi, 'getResidentsRequest')
      .rejects(new ErrorServerInternal('nope'));

    renderHook(() => useResidents(sendNotification, 'test-property'));

    await act(async () => {
      await waitFor(() => sendNotification.called);
    });

    const result = sendNotification.firstCall || { args: [] };
    const actual = (result.args[1] || { type: '' }).type;
    expect(actual, 'sent error notification').toEqual(expected);
    expect(sendReport.called, 'sent error report').toEqual(true);
  });

  test('should request all residents for a property', () => {
    const expected = true;
    const sendNotification = sinon.spy();
    const getUser = sinon
      .stub(yardiApi, 'getResidentsRequest')
      .returns(emptyCollectionResult);
    renderHook(() => useResidents(sendNotification, 'test-property'));

    const actual = getUser.called;
    expect(actual).toEqual(expected);
  });
});
