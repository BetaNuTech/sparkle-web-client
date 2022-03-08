import sinon from 'sinon';
import service from './templates';
import currentUser from '../../utils/currentUser';
import ErrorUnauthorized from '../../models/errors/unauthorized';
import ErrorForbidden from '../../models/errors/forbidden';
import ErrorNotFound from '../../models/errors/notFound';
import ErrorServerInternal from '../../models/errors/serverInternal';

const API_TEMPLATE_RESULT = {
  data: {
    id: 'template-1',
    type: 'template',
    attributes: {}
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

describe('Unit | Services | API | Templates', () => {
  afterEach(() => sinon.restore());

  test('it rejects with unauthorized error when create template request not allowed', async () => {
    const expected = true;

    sinon.stub(window, 'fetch').resolves(jsonErr());
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    let result = null;
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      await service.createRecord();
    } catch (err) {
      result = err;
    }

    const actual = result instanceof ErrorUnauthorized;
    expect(actual).toEqual(expected);
  });

  test('it rejects with not found error when template record does not exist', async () => {
    const expected = true;

    sinon.stub(window, 'fetch').resolves(jsonErr(404));
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    let result = null;
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      await service.createRecord();
    } catch (err) {
      result = err;
    }

    const actual = result instanceof ErrorNotFound;
    expect(actual).toEqual(expected);
  });

  test('it rejects with internal server error when there was an unexpected server error', async () => {
    const expected = true;

    sinon.stub(window, 'fetch').resolves(jsonErr(500));
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    let result = null;
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      await service.createRecord();
    } catch (err) {
      result = err;
    }

    const actual = result instanceof ErrorServerInternal;
    expect(actual).toEqual(expected);
  });

  test('it rejects with related errors when there was errors coming from API ', async () => {
    const tests = [
      {
        expectedErrorType: ErrorUnauthorized,
        message: 'rejects with unauthorized error'
      },
      {
        expectedErrorType: ErrorForbidden,
        message: 'rejects with forbidden error'
      },
      {
        expectedErrorType: ErrorNotFound,
        message: 'rejects with not found error'
      },
      {
        expectedErrorType: ErrorServerInternal,
        message: 'rejects with internal server error'
      }
    ];

    sinon
      .stub(window, 'fetch')
      .onCall(0)
      .resolves(jsonErr())
      .onCall(1)
      .resolves(jsonErr(403))
      .onCall(2)
      .resolves(jsonErr(404))
      .onCall(3)
      .resolves(jsonErr(500));
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    let result = null;
    // eslint-disable-next-line
    for (const test of tests) {
      try {
        // eslint-disable-next-line
        await service.createRecord();
      } catch (err) {
        result = err;
      }

      const actual = result instanceof test.expectedErrorType;
      expect(actual, test.message).toBeTruthy();
    }
  });

  test('it successfully resolves create template request', async () => {
    const expected = API_TEMPLATE_RESULT.data.id;

    sinon.stub(window, 'fetch').resolves(jsonOK(API_TEMPLATE_RESULT));
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    // eslint-disable-next-line import/no-named-as-default-member
    const actual = await service.createRecord();
    expect(actual).toEqual(expected);
  });

  test('it successfully resolves delete template request', async () => {
    const expected = API_TEMPLATE_RESULT.data.id;

    sinon.stub(window, 'fetch').resolves(jsonOK({}));
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    // eslint-disable-next-line import/no-named-as-default-member
    const actual = await service.deleteRecord(expected);
    expect(actual).toEqual(expected);
  });
});
