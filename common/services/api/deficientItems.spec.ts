import sinon from 'sinon';
import deficientItemsApi from './deficientItems';
import currentUser from '../../utils/currentUser';
import ErrorUnauthorized from '../../models/errors/unauthorized';

const API_DI_TRELLO_CARD_RESULT = {
  data: {
    id: 'trello-1',
    type: 'trello-card',
    data: {
      shortUrl: 'https://trello.com'
    }
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

describe('Unit | Services | API | Deficient Items', () => {
  afterEach(() => sinon.restore());

  test('it rejects with unauthorized error when create trello card request not allowed', async () => {
    const expected = true;

    sinon.stub(window, 'fetch').resolves(jsonErr());
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    let result = null;
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      await deficientItemsApi.createTrelloCard('deficient-item-1');
    } catch (err) {
      result = err;
    }

    const actual = result instanceof ErrorUnauthorized;
    expect(actual).toEqual(expected);
  });

  test('it resolves successful create trello card request', async () => {
    const expected = true;

    sinon.stub(window, 'fetch').resolves(jsonOK(API_DI_TRELLO_CARD_RESULT));
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    // eslint-disable-next-line import/no-named-as-default-member
    const actual = await deficientItemsApi.createTrelloCard('deficient-item-1');
    expect(actual).toEqual(expected);
  });
});
