import sinon from 'sinon';
import yardiApi from './yardi';
import currentUser from '../../utils/currentUser';
import { yardiWorkOrderOne } from '../../../__mocks__/yardi/workOrders';
import ErrorForbidden from '../../models/errors/forbidden';

const API_WORK_ORDERS_RESULT = {
  data: [
    {
      id: yardiWorkOrderOne.id,
      type: 'work-order',
      attributes: {
        category: yardiWorkOrderOne.category,
        createdAt: yardiWorkOrderOne.createdAt,
        description: yardiWorkOrderOne.description,
        origin: yardiWorkOrderOne.origin,
        permissionToEnter: yardiWorkOrderOne.permissionToEnter,
        priority: yardiWorkOrderOne.priority,
        problemNotes: yardiWorkOrderOne.problemNotes,
        requestDate: yardiWorkOrderOne.requestDate,
        requestorEmail: yardiWorkOrderOne.requestorEmail,
        requestorName: yardiWorkOrderOne.requestorName,
        requestorPhone: yardiWorkOrderOne.requestorPhone,
        status: yardiWorkOrderOne.status,
        technicianNotes: yardiWorkOrderOne.technicianNotes,
        tenantCaused: yardiWorkOrderOne.tenantCaused,
        unit: yardiWorkOrderOne.unit,
        updatedAt: yardiWorkOrderOne.updatedAt,
        updatedBy: yardiWorkOrderOne.updatedBy
      },
      relationships: {
        resident: {
          data: { id: yardiWorkOrderOne.resident, type: 'resident' }
        }
      }
    }
  ]
};

const jsonOK = (body) => {
  const mockResponse = new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-type': 'application/json' }
  });

  return Promise.resolve(mockResponse);
};

const jsonErr = () => {
  const mockResponse = new Response(JSON.stringify([]), {
    status: 403,
    headers: { 'Content-type': 'application/json' }
  });

  return Promise.resolve(mockResponse);
};

describe('Unit | Services | API | Yardi', () => {
  afterEach(() => sinon.restore());

  test('it rejects with forbidden error when request forbidden', async () => {
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

  test('it resolves all work orders for a property', async () => {
    const expected = [yardiWorkOrderOne];

    sinon.stub(window, 'fetch').resolves(jsonOK(API_WORK_ORDERS_RESULT));
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    const actual = await yardiApi.getWorkOrdersRequest('test-property');

    expect(actual).toEqual(expected);
  });
});
