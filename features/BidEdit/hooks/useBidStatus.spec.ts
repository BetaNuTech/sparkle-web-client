import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import errorReports from '../../../common/services/api/errorReports';
import { BidApiResult } from './useBidForm';
import useBidStatus from './useBidStatus';

describe('Unit | Features | Job Edit | Hooks | Use Job Status', () => {
  afterEach(() => sinon.restore());

  test('should show an error notification on forbidden updates', () => {
    const expected = 'error';
    const sendNotification = sinon.spy();
    const apiState = {
      isLoading: false,
      statusCode: 403,
      response: {}
    } as BidApiResult;
    renderHook(() =>
      useBidStatus(apiState, 'bid-1', 'job-1', 'property-1', sendNotification)
    );

    const result = sendNotification.firstCall || { args: [] };
    const actual = result.args[1] ? result.args[1].type : '';
    expect(actual).toEqual(expected);
  });

  test('should show success notification on successful updates', () => {
    const expected = 'success';
    const sendNotification = sinon.spy();
    const apiState = {
      isLoading: false,
      statusCode: 201,
      response: { data: { attributes: { title: 'My job' } } }
    } as BidApiResult;
    renderHook(() =>
      useBidStatus(apiState, 'bid-1', 'job-1', 'property-1', sendNotification)
    );

    const result = sendNotification.firstCall || { args: [] };
    const actual = result.args[1] ? result.args[1].type : '';
    expect(actual).toEqual(expected);
  });

  test('should show error notifications on unexpected update errors', () => {
    const expected = 'error';
    const sendNotification = sinon.spy();
    const apiState = {
      isLoading: false,
      statusCode: 500,
      response: {}
    } as BidApiResult;
    renderHook(() =>
      useBidStatus(apiState, 'bid-1', 'job-1', 'property-1', sendNotification)
    );

    const result = sendNotification.firstCall || { args: [] };
    const actual = result.args[1] ? result.args[1].type : '';
    expect(actual).toEqual(expected);
  });

  test('should an error report on unexpected update errors', () => {
    const expected = true;
    const sendNotification = sinon.spy();
    const apiState = {
      isLoading: false,
      statusCode: 500,
      response: { data: { attributes: { title: 'My job' } } }
    } as BidApiResult;
    sinon.stub(errorReports, 'send').callsFake(() => true);

    renderHook(() =>
      useBidStatus(apiState, 'bid-1', 'job-1', 'property-1', sendNotification)
    );

    const actual = sendNotification.called;
    expect(actual).toEqual(expected);
  });
});
