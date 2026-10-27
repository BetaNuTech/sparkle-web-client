import sinon from 'sinon';
import yardiApi, { toWorkOrdersQuery } from './yardi';
import currentUser from '../../utils/currentUser';
import { yardiWorkOrderOne } from '../../../__mocks__/yardi/workOrders';
import customValuesJson from '../../../__mocks__/yardi/customValues';
import residentsJson from '../../../__mocks__/yardi/residents';
import occupantsJson from '../../../__mocks__/yardi/occupants';
import ErrorForbidden from '../../models/errors/forbidden';
import ErrorNotFound from '../../models/errors/notFound';
import ErrorBadRequest from '../../models/errors/badRequest';
import ErrorBadGateway from '../../models/errors/badGateway';
import ErrorProxyForbidden from '../../models/errors/proxyForbidden';

const workOrderAttrs = { ...yardiWorkOrderOne };
delete workOrderAttrs.id;
delete workOrderAttrs.resident;

const residentAttrs = residentsJson.map((r) => {
  const resident = { ...r };
  delete resident.id;
  delete resident.occupants;
  return resident;
});

const occupanttAttrs = residentsJson.map((o: any) => {
  const occupant = { ...o };
  delete occupant.id;
  delete occupant.resident;
  return occupant;
});

const API_WORK_ORDER_DOC = {
  id: yardiWorkOrderOne.id,
  type: 'work-order',
  attributes: workOrderAttrs,
  relationships: {
    resident: {
      data: { id: yardiWorkOrderOne.resident, type: 'resident' }
    }
  }
};

const API_WORK_ORDERS_RESULT = {
  data: [API_WORK_ORDER_DOC]
};

const API_WORK_ORDER_RESULT = {
  data: API_WORK_ORDER_DOC
};

const customValuesAttrs = { ...customValuesJson };
delete customValuesAttrs.id;

const API_CUSTOM_VALUES_RESULT = {
  data: {
    id: customValuesJson.id,
    type: 'yardi-custom-values',
    attributes: customValuesAttrs
  }
};

const API_RESIDENTS_RESULT = {
  data: residentsJson.map((r, i) => ({
    id: r.id,
    type: 'resident',
    attributes: residentAttrs[i],
    relationships: {
      occupants: {
        data: (r.occupants || []).map((occId) => ({
          id: occId,
          type: 'occupant'
        }))
      }
    }
  })),
  included: occupantsJson.map((o, i) => ({
    id: o.id,
    type: 'occupant',
    attributes: occupanttAttrs[i],
    relationships: {
      resident: {
        id: o.resident,
        type: 'resident'
      }
    }
  }))
};

const jsonOK = (body, status = 200) => {
  const mockResponse = new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-type': 'application/json' }
  });

  return Promise.resolve(mockResponse);
};

const jsonErr = (status = 403, errors = []) => {
  const mockResponse = new Response(JSON.stringify({ errors }), {
    status,
    headers: { 'Content-type': 'application/json' }
  });

  return Promise.resolve(mockResponse);
};

describe('Unit | Services | API | Yardi', () => {
  afterEach(() => sinon.restore());

  test('it rejects with forbidden error when work order request forbidden', async () => {
    const expected = true;

    sinon.stub(window, 'fetch').resolves(jsonErr());
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    let actual = false;
    try {
      await yardiApi.getWorkOrdersRequest('test-property');
    } catch (err) {
      actual = err instanceof ErrorForbidden;
    }

    expect(actual).toEqual(expected);
  });

  test('it rejects with not found error when resident request non found', async () => {
    const expected = true;

    sinon.stub(window, 'fetch').resolves(jsonErr(404));
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    let actual = false;
    try {
      await yardiApi.getResidentsRequest('test-property');
    } catch (err) {
      actual = err instanceof ErrorNotFound;
    }

    expect(actual).toEqual(expected);
  });

  test('it resolves all work orders for a property', async () => {
    const expected = [yardiWorkOrderOne];

    sinon.stub(window, 'fetch').resolves(jsonOK(API_WORK_ORDERS_RESULT));
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    const actual = await yardiApi.getWorkOrdersRequest('test-property');

    expect(actual).toEqual(expected);
  });

  test('it resolves all residents and occupants for a property', async () => {
    const residentIds = residentsJson.map((r) => r.id);
    const occupantIds = occupantsJson.map((o) => o.id);
    const expected = `residents: ${residentIds.join(
      ','
    )} | occupants: ${occupantIds.join(',')}`;

    sinon.stub(window, 'fetch').resolves(jsonOK(API_RESIDENTS_RESULT));
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    const result = await yardiApi.getResidentsRequest('test-property');
    const resultResidentIds = result.residents.map((r) => r.id);
    const resultOccupantIds = result.occupants.map((o) => o.id);
    const actual = `residents: ${resultResidentIds.join(
      ','
    )} | occupants: ${resultOccupantIds.join(',')}`;

    expect(actual).toEqual(expected);
  });

  test('it omits blank filters from the work orders query string', () => {
    const tests = [
      { filters: {}, expected: '' },
      { filters: { state: 'open' }, expected: '?state=open' },
      {
        filters: { state: 'closed', unit: '', from: '2026-01-01' },
        expected: '?state=closed&from=2026-01-01'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { filters, expected } = tests[i];
      const actual = toWorkOrdersQuery(filters as any);
      expect(actual).toEqual(expected);
    }
  });

  test('it requests work orders with the provided filters', async () => {
    const expected = 'state=closed&unit=1724&from=2026-01-01&to=2026-02-01';
    const fetchStub = sinon
      .stub(window, 'fetch')
      .resolves(jsonOK(API_WORK_ORDERS_RESULT));
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    await yardiApi.getWorkOrdersRequest('test-property', {
      state: 'closed',
      unit: '1724',
      from: '2026-01-01',
      to: '2026-02-01'
    });

    const url = `${fetchStub.firstCall.args[0]}`;
    const actual = url.split('?')[1];
    expect(actual).toEqual(expected);
  });

  test('it rejects with proxy forbidden error when yardi credentials rejected', async () => {
    const expected = true;

    sinon.stub(window, 'fetch').resolves(jsonErr(407));
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    let actual = false;
    try {
      await yardiApi.getWorkOrdersRequest('test-property');
    } catch (err) {
      actual = err instanceof ErrorProxyForbidden;
    }

    expect(actual).toEqual(expected);
  });

  test('it rejects with bad gateway error when yardi could not process request', async () => {
    const expected = true;

    sinon.stub(window, 'fetch').resolves(jsonErr(502));
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    let actual = false;
    try {
      await yardiApi.getWorkOrderRequest('test-property', '1');
    } catch (err) {
      actual = err instanceof ErrorBadGateway;
    }

    expect(actual).toEqual(expected);
  });

  test('it resolves a single work order for a property', async () => {
    const expected = yardiWorkOrderOne;
    const fetchStub = sinon
      .stub(window, 'fetch')
      .resolves(jsonOK(API_WORK_ORDER_RESULT));
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    const actual = await yardiApi.getWorkOrderRequest('test-property', '1');

    const url = `${fetchStub.firstCall.args[0]}`;
    expect(actual).toEqual(expected);
    expect(url.endsWith('/yardi/work-orders/1'), 'requested record').toEqual(
      true
    );
  });

  test('it posts new work order attributes as a plain JSON body', async () => {
    const expected = { unit: '1724', description: 'Leaky faucet' };
    const fetchStub = sinon
      .stub(window, 'fetch')
      .resolves(jsonOK(API_WORK_ORDER_RESULT, 201));
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    const result = await yardiApi.createWorkOrderRequest(
      'test-property',
      expected
    );

    const [url, options] = fetchStub.firstCall.args;
    const actual = JSON.parse(options.body);
    expect(actual).toEqual(expected);
    expect(options.method).toEqual('POST');
    expect(`${url}`.endsWith('/yardi/work-orders')).toEqual(true);
    expect(result.id).toEqual(yardiWorkOrderOne.id);
  });

  test('it rejects a work order create with the api field errors', async () => {
    const expected = ['/unit', '/priority'];
    sinon.stub(window, 'fetch').resolves(
      jsonErr(400, [
        { source: { pointer: '/unit' }, title: 'required', detail: 'nope' },
        { source: { pointer: '/priority' }, title: 'invalid', detail: 'bad' }
      ])
    );
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    let actual = [];
    try {
      await yardiApi.createWorkOrderRequest('test-property', {});
    } catch (err) {
      expect(err instanceof ErrorBadRequest, 'bad request error').toEqual(
        true
      );
      actual = err.errors.map((e) => e.name);
    }

    expect(actual).toEqual(expected);
  });

  test('it patches only the provided work order updates', async () => {
    const expected = { status: 'Canceled', reason: 'Duplicate' };
    const fetchStub = sinon
      .stub(window, 'fetch')
      .resolves(jsonOK(API_WORK_ORDER_RESULT));
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    await yardiApi.updateWorkOrderRequest('test-property', '42', expected);

    const [url, options] = fetchStub.firstCall.args;
    const actual = JSON.parse(options.body);
    expect(actual).toEqual(expected);
    expect(options.method).toEqual('PATCH');
    expect(`${url}`.endsWith('/yardi/work-orders/42')).toEqual(true);
  });

  test('it rejects with not found error when updating an unknown work order', async () => {
    const expected = true;

    sinon.stub(window, 'fetch').resolves(jsonErr(404));
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    let actual = false;
    try {
      await yardiApi.updateWorkOrderRequest('test-property', '1', {});
    } catch (err) {
      actual = err instanceof ErrorNotFound;
    }

    expect(actual).toEqual(expected);
  });

  test('it resolves the custom values yardi accepts for a property', async () => {
    const expected = customValuesJson;
    const fetchStub = sinon
      .stub(window, 'fetch')
      .resolves(jsonOK(API_CUSTOM_VALUES_RESULT));
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    const actual = await yardiApi.getCustomValuesRequest('test-property');

    const url = `${fetchStub.firstCall.args[0]}`;
    expect(actual).toEqual(expected);
    expect(url.endsWith('/yardi/custom-values')).toEqual(true);
  });

  test('it rejects an unexpected custom values payload', async () => {
    const expected = true;
    sinon.stub(window, 'fetch').resolves(jsonOK({ data: { id: 'prop1' } }));
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    let actual = false;
    try {
      await yardiApi.getCustomValuesRequest('test-property');
    } catch (err) {
      actual = `${err}`.includes('unexpected success response schema');
    }

    expect(actual).toEqual(expected);
  });
});
