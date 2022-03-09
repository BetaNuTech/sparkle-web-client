import sinon from 'sinon';
import service from './categoreis';
import currentUser from '../../utils/currentUser';

const API_CATEGORY_RESULT = {
  data: {
    id: 'category-1',
    type: 'template-category',
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

describe('Unit | Services | API | Categories', () => {
  afterEach(() => sinon.restore());

  test('it rejects an unauthorized create category request', async () => {
    const expected =
      'services: api: categories: createRecord: user authorization not accepted';

    sinon.stub(window, 'fetch').resolves(jsonErr(401));
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    // eslint-disable-next-line
    let result = null;
    try {
      // eslint-disable-next-line
      await service.createRecord('category-1');
    } catch (err) {
      result = err;
    }

    const actual = result.toString();
    expect(actual).toEqual(expected);
  });

  test('it rejects an unfound update category request', async () => {
    const expected =
      'services: api: categories: updateRecord: record not found';

    sinon.stub(window, 'fetch').resolves(jsonErr(404));
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    // eslint-disable-next-line
    let result = null;
    try {
      // eslint-disable-next-line
      await service.updateRecord('cat-1', 'category-1');
    } catch (err) {
      result = err;
    }

    const actual = result.toString();
    expect(actual).toEqual(expected);
  });

  test('it successfully resolves create template category request', async () => {
    sinon.stub(window, 'fetch').resolves(jsonOK(API_CATEGORY_RESULT));
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    // eslint-disable-next-line import/no-named-as-default-member
    const actual = await service.createRecord('cat-1');
    expect(actual).toBeTruthy();
  });

  test('it successfully resolves update template category request', async () => {
    sinon.stub(window, 'fetch').resolves(jsonOK(API_CATEGORY_RESULT));
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    // eslint-disable-next-line import/no-named-as-default-member
    const actual = await service.updateRecord('cat-1', 'category-1');
    expect(actual).toBeTruthy();
  });
});
