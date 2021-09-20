import sinon from 'sinon';
import Router from 'next/router';
import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import errorReports from '../../../common/services/api/errorReports';
import bidsApi from '../../../common/services/api/bids';
import bidModel from '../../../common/models/bid';
import { openBid } from '../../../__mocks__/bids';
import currentUser from '../../../common/utils/currentUser';
import useBidForm from './useBidForm';

const STUBBED_NOTIFICATIONS = (message: string, options?: any) => [
  message,
  options
];

describe('Unit | Features | Bid Edit | Hooks | Use Bid Form', () => {
  afterEach(() => sinon.restore());

  test('should call the create bid method of api', async () => {
    const expected = true;

    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);
    sinon.stub(errorReports, 'send').callsFake(() => true);
    sinon.stub(Router, 'push').callsFake(() => true);

    // Stub create response
    const createBid = sinon.stub(bidsApi, 'createNewBid').resolves({
      status: 201,
      json: () =>
        Promise.resolve({
          data: {
            id: 'bid-1',
            attributes: { vendor: 'test' }
          }
        })
    });

    await act(() => {
      const { result } = renderHook(() =>
        useBidForm(openBid, STUBBED_NOTIFICATIONS)
      );
      result.current.postBidCreate('property-1', 'job-1', {} as bidModel);
    });

    const actual = createBid.called;
    expect(actual).toEqual(expected);
  });

  test('should call the update bid method of api', async () => {
    const expected = true;

    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);
    sinon.stub(errorReports, 'send').callsFake(() => true);

    // Stub update response
    const updateBid = sinon.stub(bidsApi, 'updateBid').resolves({
      status: 201,
      json: () =>
        Promise.resolve({
          data: {
            id: 'bid-1',
            attributes: { vendor: 'test' }
          }
        })
    });

    await act(() => {
      const { result } = renderHook(() =>
        useBidForm(openBid, STUBBED_NOTIFICATIONS)
      );
      result.current.putBidUpdate(
        'property-1',
        'job-1',
        'bid-1',
        {} as bidModel
      );
    });

    const actual = updateBid.called;
    expect(actual).toEqual(expected);
  });

  test('should show an error notification on forbidden updates', async () => {
    const expected = 'error';
    const sendNotification = sinon.spy();
    sinon.stub(errorReports, 'send').callsFake(() => true);

    // Stub update response
    sinon.stub(bidsApi, 'updateBid').resolves({
      status: 403,
      json: () =>
        Promise.resolve({
          errors: []
        })
    });

    await act(() => {
      const { result } = renderHook(() =>
        useBidForm(openBid, sendNotification)
      );
      result.current.putBidUpdate(
        'property-1',
        'job-1',
        'bid-1',
        {} as bidModel
      );
    });

    const result = sendNotification.firstCall || { args: [] };
    const actual = result.args[1] ? result.args[1].type : '';
    expect(actual).toEqual(expected);
  });

  test('should show success notification on successful updates', async () => {
    const expected = 'success';
    const sendNotification = sinon.spy();

    // Stub update response
    sinon.stub(bidsApi, 'updateBid').resolves({
      status: 201,
      json: () =>
        Promise.resolve({
          data: {
            id: 'bid-1',
            attributes: { vendor: 'test' }
          }
        })
    });

    await act(() => {
      const { result } = renderHook(() =>
        useBidForm(openBid, sendNotification)
      );
      result.current.putBidUpdate(
        'property-1',
        'job-1',
        'bid-1',
        {} as bidModel
      );
    });

    const result = sendNotification.firstCall || { args: [] };
    const actual = result.args[1] ? result.args[1].type : '';
    expect(actual).toEqual(expected);
  });

  test('should show error notifications on unexpected update errors', async () => {
    const expected = 'error';
    const sendNotification = sinon.spy();
    sinon.stub(errorReports, 'send').callsFake(() => true);

    // Stub update response
    sinon.stub(bidsApi, 'updateBid').resolves({
      status: 500,
      json: () =>
        Promise.resolve({
          errors: []
        })
    });

    await act(() => {
      const { result } = renderHook(() =>
        useBidForm(openBid, sendNotification)
      );
      result.current.putBidUpdate(
        'property-1',
        'job-1',
        'bid-1',
        {} as bidModel
      );
    });

    const result = sendNotification.firstCall || { args: [] };
    const actual = result.args[1] ? result.args[1].type : '';
    expect(actual).toEqual(expected);
  });

  test('should send an error report on unexpected update errors', async () => {
    const expected = true;
    const sendNotification = sinon.spy();
    const sendErrorReport = sinon
      .stub(errorReports, 'send')
      .callsFake(() => true);

    // Stub update response
    sinon.stub(bidsApi, 'updateBid').resolves({
      status: 500,
      json: () =>
        Promise.resolve({
          errors: []
        })
    });

    await act(() => {
      const { result } = renderHook(() =>
        useBidForm(openBid, sendNotification)
      );
      result.current.putBidUpdate(
        'property-1',
        'job-1',
        'bid-1',
        {} as bidModel
      );
    });

    const actual = sendErrorReport.called;
    expect(actual).toEqual(expected);
  });
});
