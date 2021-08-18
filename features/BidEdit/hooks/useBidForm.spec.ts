import sinon from 'sinon';
import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import bidsApi from '../../../common/services/api/bids';
import bidModel from '../../../common/models/bid';
import { openBid } from '../../../__mocks__/bids';
import currentUser from '../../../common/utils/currentUser';
import useBidForm from './useBidForm';

describe('Unit | Features | Bid Edit | Hooks | Use Bid Form', () => {
  afterEach(() => sinon.restore());

  test('should call the create bid method of api', async () => {
    const expected = true;

    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);

    // Creates spy for ajax method of jQuery lib
    const spyFunc = sinon.spy(bidsApi, 'createNewBid');

    await act(async () => {
      const { result } = renderHook(() => useBidForm(openBid));
      result.current.postBidCreate('property-1', 'job-1', {} as bidModel);
    });

    const actual = spyFunc.called;
    expect(actual).toEqual(expected);
  });

  test('should call the update bid method of api', async () => {
    const expected = true;

    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);

    // Creates spy for ajax method of jQuery lib
    const spyFunc = sinon.spy(bidsApi, 'updateBid');

    await act(async () => {
      const { result } = renderHook(() => useBidForm(openBid));
      result.current.putBidUpdate('property-1', 'job-1', {} as bidModel);
    });

    const actual = spyFunc.called;
    expect(actual).toEqual(expected);
  });
});
