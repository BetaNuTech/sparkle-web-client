import sinon from 'sinon';
import bidsApi from './bids';
import currentUser from '../../utils/currentUser';
import deepClone from '../../../__tests__/helpers/deepClone';
import { openBid } from '../../../__mocks__/bids';
import ErrorUnauthorized from '../../models/errors/unauthorized';
import bidModal from '../../models/bid';

const bidAttrs = deepClone(openBid);
delete bidAttrs.id;

const API_BID_CREATE_UPDATE_RESULT = {
  data: {
    id: openBid.id,
    type: 'bid',
    attributes: bidAttrs
  }
};

const jsonOK = (body) => {
  const mockResponse = new Response(JSON.stringify(body), {
    status: 201,
    headers: { 'Content-type': 'application/json' }
  });

  return Promise.resolve(mockResponse);
};

const jsonErr = (status = 401) => {
  const mockResponse = new Response(JSON.stringify([]), {
    status,
    headers: { 'Content-type': 'application/json' }
  });

  return Promise.resolve(mockResponse);
};

describe('Unit | Services | API | Bids', () => {
  afterEach(() => sinon.restore());

  test('it rejects with unauthorized error when create new bid request not allowed', async () => {
    const expected = true;

    sinon.stub(window, 'fetch').resolves(jsonErr());
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    let result = null;
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      await bidsApi.createNewBid(openBid.job, openBid.id, {} as bidModal);
    } catch (err) {
      result = err;
    }

    const actual = result instanceof ErrorUnauthorized;
    expect(actual).toEqual(expected);
  });

  test('it resolves an created bid on successful create new bid request', async () => {
    const expected = deepClone(openBid) as bidModal;

    sinon.stub(window, 'fetch').resolves(jsonOK(API_BID_CREATE_UPDATE_RESULT));
    sinon.stub(currentUser, 'getIdToken').resolves('token');
    // eslint-disable-next-line import/no-named-as-default-member
    const actual = await bidsApi.createNewBid(openBid.job, openBid.id, {
      vendor: 'Johonson'
    } as bidModal);

    expect(actual).toEqual(expected);
  });

  test('it rejects with unauthorized error when update bid request not allowed', async () => {
    const expected = true;

    sinon.stub(window, 'fetch').resolves(jsonErr());
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    let result = null;
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      await bidsApi.updateBid(
        openBid.id,
        openBid.job,
        openBid.id,
        {} as bidModal
      );
    } catch (err) {
      result = err;
    }

    const actual = result instanceof ErrorUnauthorized;
    expect(actual).toEqual(expected);
  });

  test('it resolves an updated bid model on successful update bid request', async () => {
    const expected = deepClone(openBid) as bidModal;

    sinon.stub(window, 'fetch').resolves(jsonOK(API_BID_CREATE_UPDATE_RESULT));
    sinon.stub(currentUser, 'getIdToken').resolves('token');
    // eslint-disable-next-line import/no-named-as-default-member
    const actual = await bidsApi.updateBid(
      openBid.id,
      openBid.job,
      openBid.id,
      { vendor: 'Johonson' } as bidModal
    );

    expect(actual).toEqual(expected);
  });
});
